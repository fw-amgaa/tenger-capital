"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getTracker } from "@/lib/analytics/tracker";
import { startAutoTracking } from "@/lib/analytics/auto-track";

const SKIP_PREFIXES = ["/dashboard", "/login", "/api"];

function shouldSkip(pathname: string | null): boolean {
  if (!pathname) return true;
  return SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const startedRef = useRef(false);
  const stopAutoRef = useRef<(() => void) | null>(null);
  const pathRef = useRef<string | null>(pathname);

  pathRef.current = pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isPending) return;

    const tracker = getTracker();
    const isAdmin = !!session?.user;
    const skip = shouldSkip(pathname) || isAdmin;

    if (skip) {
      if (startedRef.current) {
        tracker.disable();
        startedRef.current = false;
      }
      if (stopAutoRef.current) {
        stopAutoRef.current();
        stopAutoRef.current = null;
      }
      return;
    }

    if (!startedRef.current) {
      tracker.init();
      stopAutoRef.current = startAutoTracking(() => pathRef.current);
      startedRef.current = true;
    }
    const query = searchParams?.toString() || null;
    tracker.pageview(pathname, query, document.title);
  }, [pathname, searchParams, session, isPending]);

  return null;
}
