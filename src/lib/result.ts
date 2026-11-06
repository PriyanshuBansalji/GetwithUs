import type { AppError } from "@/lib/errors";

/** The return type of every service: data on success, a typed error otherwise. */
export type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E };

/** Wraps a successful value. */
export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });

/** Wraps an expected failure. */
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
