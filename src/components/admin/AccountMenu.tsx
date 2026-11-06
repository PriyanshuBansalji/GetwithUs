"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useTransition } from "react";
import DropdownMenu from "@/components/ui/DropdownMenu";
import Icon from "@/components/ui/Icon";
import { signOutAdmin } from "@/features/admin/actions";

/** The signed-in email with a menu holding "Sign out". */
export default function AccountMenu({ email }: { email: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <DropdownMenu
      trigger={
        <button
          type="button"
          className="inline-flex h-9 max-w-[16rem] items-center gap-2 rounded-control px-2.5 type-small text-body transition-colors duration-150 ease-out hover:bg-card-2"
        >
          <span className="truncate font-mono">{email}</span>
          <Icon icon={ChevronDown} size={16} />
        </button>
      }
      items={[
        {
          label: pending ? "Signing out" : "Sign out",
          icon: LogOut,
          disabled: pending,
          onSelect: () => startTransition(() => signOutAdmin()),
        },
      ]}
    />
  );
}
