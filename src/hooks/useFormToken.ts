"use client";

import { useCallback, useEffect, useRef } from "react";
import { fetchFormToken } from "@/features/leads/client";

/**
 * Fetches the signed form token when the form mounts. `get` returns it, fetching
 * again when it is missing; `refresh` replaces it after a bot-check failure.
 */
export function useFormToken(): { get: () => Promise<string | null>; refresh: () => void } {
  const token = useRef<Promise<string | null> | null>(null);

  const load = useCallback(() => {
    token.current = fetchFormToken().then((result) => (result.ok ? result.data.token : null));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const get = useCallback(async () => {
    const value = await (token.current ?? Promise.resolve(null));
    if (value) return value;
    load();
    return token.current;
  }, [load]);

  return { get, refresh: load };
}
