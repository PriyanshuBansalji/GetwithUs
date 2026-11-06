"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { logger } from "@/lib/logger";

type ErrorPageProps = { error: unknown; retry: () => void };

function digestOf(error: unknown): string | undefined {
  if (error instanceof Error && "digest" in error && typeof error.digest === "string")
    return error.digest;
  return undefined;
}

/**
 * Route-level error page. Server errors carry a digest that also appears in the
 * server log; client errors get a short reference generated here and logged.
 */
export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const digest = digestOf(error);
  // Error boundaries render on the client only, so a random fallback ID cannot cause a hydration mismatch.
  const [reference] = useState(() => digest ?? crypto.randomUUID().slice(0, 8));

  useEffect(() => {
    logger.error("Render error shown to user", { reference, error });
  }, [reference, error]);

  return (
    <main id="content" tabIndex={-1} className="outline-none">
      <Container className="dots-bg py-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-semibold text-err shadow-soft">
          Error
        </p>
        <h1 className="mt-5 type-display text-ink">Something went wrong</h1>
        <p className="mt-4 max-w-[52ch] type-lead text-body">
          This page could not load. Try again, and if it keeps happening,{" "}
          <Link href="/contact" className="font-semibold text-accent underline underline-offset-4">
            contact us
          </Link>{" "}
          with the reference below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={retry}>Try again</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
        <p className="mt-6 type-small text-body">
          Reference:{" "}
          <span className="rounded-md bg-bg-soft px-2 py-0.5 font-mono text-ink">{reference}</span>
        </p>
      </Container>
    </main>
  );
}
