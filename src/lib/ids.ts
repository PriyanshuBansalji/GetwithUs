/** A request ID for logs and error references. Returned to clients in `x-request-id`. */
export function newRequestId(): string {
  return crypto.randomUUID();
}
