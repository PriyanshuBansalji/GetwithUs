import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/ui/Logo";
import Skeleton from "@/components/ui/Skeleton";
import { getAdmin } from "@/features/admin/auth";

export const metadata: Metadata = { title: "Sign in" };

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Already signed in: go straight to the destination. Otherwise the email form. */
async function SignIn({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const params = await searchParams;
  const next = firstValue(params.next);
  if (await getAdmin()) redirect(next?.startsWith("/admin") ? next : "/admin");
  return <LoginForm next={next} authError={firstValue(params.error)} />;
}

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main
      id="content"
      tabIndex={-1}
      className="grid min-h-svh place-items-center px-6 outline-none"
    >
      <div className="w-full max-w-sm">
        <Logo size="md" href="/" />
        <h1 className="mt-10 type-h2">Sign in to the admin</h1>
        <p className="mt-2 text-body">We email a one-time link to team addresses.</p>
        <div className="mt-8">
          <Suspense fallback={<Skeleton className="h-36 w-full" />}>
            <SignIn searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
