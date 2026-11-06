import { describe, expect, it } from "vitest";
import {
  AppError,
  ERROR_STATUS,
  GENERIC_SERVER_MESSAGE,
  botCheckFailed,
  conflict,
  dbError,
  emailError,
  forbidden,
  internal,
  isAppError,
  notFound,
  rateLimited,
  unauthorized,
  validationError,
  verificationExpired,
  verificationInvalid,
  verificationLocked,
} from "@/lib/errors";

describe("AppError factories", () => {
  const cases: Array<[AppError, keyof typeof ERROR_STATUS]> = [
    [validationError(), "VALIDATION_ERROR"],
    [unauthorized(), "UNAUTHORIZED"],
    [forbidden(), "FORBIDDEN"],
    [notFound(), "NOT_FOUND"],
    [conflict("Already exists."), "CONFLICT"],
    [rateLimited(60), "RATE_LIMITED"],
    [verificationInvalid(2), "VERIFICATION_INVALID"],
    [verificationExpired(), "VERIFICATION_EXPIRED"],
    [verificationLocked(), "VERIFICATION_LOCKED"],
    [botCheckFailed(), "BOT_CHECK_FAILED"],
    [dbError(new Error("connection refused")), "DB_ERROR"],
    [emailError(new Error("timeout")), "EMAIL_ERROR"],
    [internal(new Error("boom")), "INTERNAL"],
  ];

  it.each(cases)("%#: produces the code and status from the table", (error, code) => {
    expect(error).toBeInstanceOf(AppError);
    expect(isAppError(error)).toBe(true);
    expect(error.code).toBe(code);
    expect(error.status).toBe(ERROR_STATUS[code]);
  });

  it("covers every code in the status table", () => {
    expect(new Set(cases.map(([, code]) => code))).toEqual(new Set(Object.keys(ERROR_STATUS)));
  });
});

describe("AppError.toPublic", () => {
  it("keeps the message and details of client errors", () => {
    expect(rateLimited(120).toPublic()).toEqual({
      code: "RATE_LIMITED",
      message: "Too many requests from this connection. Try again in a few minutes.",
      details: { retryAfterSeconds: 120 },
    });
  });

  it("hides the message, details, and cause of server errors", () => {
    const publicError = dbError(new Error("password authentication failed for user")).toPublic();
    expect(publicError).toEqual({ code: "DB_ERROR", message: GENERIC_SERVER_MESSAGE });
    expect(JSON.stringify(publicError)).not.toContain("password");
  });

  it("does not treat plain errors as AppError", () => {
    expect(isAppError(new Error("plain"))).toBe(false);
  });
});
