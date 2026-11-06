import { CircleAlert } from "lucide-react";
import Icon from "@/components/ui/Icon";

/**
 * A form-level message next to the action that caused it. The region is always
 * present and polite, so a new message is announced without moving focus.
 */
export default function FormAlert({
  message,
  tone = "error",
}: {
  message: string | null;
  tone?: "error" | "status";
}) {
  return (
    <div aria-live="polite" className="empty:hidden">
      {message ? (
        <p
          className={`flex items-start gap-2 type-small ${tone === "error" ? "text-err" : "text-body"}`}
        >
          {tone === "error" ? <Icon icon={CircleAlert} size={16} className="mt-0.5" /> : null}
          {message}
        </p>
      ) : null}
    </div>
  );
}
