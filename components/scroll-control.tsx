"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import Lenis from "lenis";

type ScrollControl = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: number | string | Element, opts?: Parameters<Lenis["scrollTo"]>[1]) => void;
};

const ScrollControlContext = createContext<ScrollControl | null>(null);

export function ScrollControlProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  const scrollTo = useCallback<ScrollControl["scrollTo"]>((target, opts) => {
    lenisRef.current?.scrollTo(target as any, opts as any);
  }, []);

  const value = useMemo(() => ({ stop, start, scrollTo }), [stop, start, scrollTo]);

  return <ScrollControlContext.Provider value={value}>{children}</ScrollControlContext.Provider>;
}

export function useScrollControl(): ScrollControl {
  const ctx = useContext(ScrollControlContext);
  if (!ctx) throw new Error("useScrollControl must be used within ScrollControlProvider");
  return ctx;
}


