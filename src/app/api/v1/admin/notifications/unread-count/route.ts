import { getAdmin } from "@/features/admin/auth";
import { unreadCount } from "@/features/notifications/service";
import { unauthorized } from "@/lib/errors";
import { fail, ok, withHandler } from "@/lib/http";
import { rateLimit } from "@/server/rate-limit";
import { hashKey } from "@/server/request";

/** GET /api/v1/admin/notifications/unread-count: the header badge, polled every 30 seconds. */
export const GET = withHandler(async (_request, { requestId }) => {
  const admin = await getAdmin();
  if (!admin) return fail(unauthorized(), requestId);
  const limited = await rateLimit({
    key: `unread:admin:${hashKey(admin.email)}`,
    limit: 120,
    windowSeconds: 60,
  });
  if (!limited.ok) return fail(limited.error, requestId);
  const count = await unreadCount();
  if (!count.ok) return fail(count.error, requestId);
  return ok({ count: count.data }, { headers: { "cache-control": "no-store" } });
});
