"use client";

import dynamic from "next/dynamic";

// Toasts only answer user actions, so the library loads after hydration instead of with every page.
const Toaster = dynamic(() => import("sonner").then((module) => module.Toaster), { ssr: false });

/**
 * The toast region, themed to the brand tokens. Trigger toasts with `toast()`
 * from "sonner"; the text uses the same verb as the control that caused it.
 */
export default function Toast() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-[min(356px,calc(100vw-32px))] items-start gap-3 rounded-card border border-line-2 bg-card-2 p-4 type-small text-ink",
          title: "font-medium text-ink",
          description: "mt-0.5 text-body",
          success: "[&_[data-icon]]:text-ok",
          error: "[&_[data-icon]]:text-err",
          icon: "mt-0.5 shrink-0",
        },
      }}
    />
  );
}
