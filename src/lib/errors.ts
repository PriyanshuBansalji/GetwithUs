/** HTTP status for every error code the API can return. */
export const ERROR_STATUS = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  VERIFICATION_INVALID: 400,
  VERIFICATION_EXPIRED: 410,
  VERIFICATION_LOCKED: 423,
  BOT_CHECK_FAILED: 400,
  DB_ERROR: 500,
  EMAIL_ERROR: 502,
  INTERNAL: 500,
} as const;

export type ErrorCode = keyof typeof ERROR_STATUS;

export type ErrorDetails = Record<string, unknown>;

/** The shape of an error once it crosses a network or server-action boundary. */
export type PublicError = {
  code: ErrorCode;
  message: string;
  details?: ErrorDetails;
};

/**
 * The one error type services return and boundaries map. `message` is safe to show
 * to a user; anything internal goes in `cause`, which is logged and never sent.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: ErrorDetails;

  constructor(
    code: ErrorCode,
    message: string,
    options?: { details?: ErrorDetails; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = "AppError";
    this.code = code;
    this.status = ERROR_STATUS[code];
    this.details = options?.details;
  }

  /** True for errors caused by the server or a provider rather than by the request. */
  get isServerError(): boolean {
    return this.status >= 500;
  }

  /** The serializable form. Server errors never expose their message or details. */
  toPublic(): PublicError {
    if (this.isServerError) {
      return { code: this.code, message: GENERIC_SERVER_MESSAGE };
    }
    return this.details
      ? { code: this.code, message: this.message, details: this.details }
      : { code: this.code, message: this.message };
  }
}

export const GENERIC_SERVER_MESSAGE = "Something went wrong on our side. Try again in a moment.";

/** Narrows an unknown thrown value to an AppError. */
export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

/** The request body or query failed validation. */
export function validationError(
  message = "Check the highlighted fields and try again.",
  details?: ErrorDetails,
): AppError {
  return new AppError("VALIDATION_ERROR", message, { details });
}

/** No valid session or API key was supplied. */
export function unauthorized(message = "Sign in to continue."): AppError {
  return new AppError("UNAUTHORIZED", message);
}

/** The caller is known but not allowed to do this. */
export function forbidden(message = "You do not have access to this."): AppError {
  return new AppError("FORBIDDEN", message);
}

/** The requested record does not exist. */
export function notFound(message = "That item does not exist."): AppError {
  return new AppError("NOT_FOUND", message);
}

/** The request conflicts with the current state of a record. */
export function conflict(message: string): AppError {
  return new AppError("CONFLICT", message);
}

/** A rate limit window is exhausted. `retryAfterSeconds` feeds the Retry-After header. */
export function rateLimited(retryAfterSeconds: number): AppError {
  return new AppError(
    "RATE_LIMITED",
    "Too many requests from this connection. Try again in a few minutes.",
    { details: { retryAfterSeconds } },
  );
}

/** The verification code did not match. */
export function verificationInvalid(remainingAttempts: number): AppError {
  return new AppError(
    "VERIFICATION_INVALID",
    "That code is not correct. Check the email and try again.",
    {
      details: { remainingAttempts },
    },
  );
}

/** The verification code is past its expiry time. */
export function verificationExpired(): AppError {
  return new AppError("VERIFICATION_EXPIRED", "That code has expired. Request a new one.");
}

/** Too many wrong attempts on the current code. */
export function verificationLocked(): AppError {
  return new AppError("VERIFICATION_LOCKED", "Too many attempts. Request a new code to continue.");
}

/** The honeypot, form token, or Turnstile check failed. */
export function botCheckFailed(): AppError {
  return new AppError(
    "BOT_CHECK_FAILED",
    "We could not confirm this request came from a person. Reload the page and try again.",
  );
}

/** A database query failed. The driver error is kept as `cause`. */
export function dbError(cause: unknown): AppError {
  return new AppError("DB_ERROR", "Database query failed.", { cause });
}

/** An email provider call failed. */
export function emailError(cause: unknown): AppError {
  return new AppError("EMAIL_ERROR", "Email delivery failed.", { cause });
}

/** Anything unexpected. */
export function internal(cause: unknown): AppError {
  return new AppError("INTERNAL", "Unexpected error.", { cause });
}
