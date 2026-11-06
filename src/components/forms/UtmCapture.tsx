"use client";

import { useEffect } from "react";
import { captureUtm } from "@/features/leads/client";

/** Remembers campaign parameters from the landing URL for the rest of the visit. Renders nothing. */
export default function UtmCapture() {
  useEffect(() => captureUtm(), []);
  return null;
}
