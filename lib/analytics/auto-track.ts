"use client";

import { getTracker } from "./tracker";

const RAGE_WINDOW_MS = 1000;
const RAGE_DISTANCE_PX = 60;
const RAGE_THRESHOLD = 3;

const SCROLL_MILESTONES = [25, 50, 75, 100];

type ClickSample = { x: number; y: number; t: number };

export function startAutoTracking(getPath: () => string | null): () => void {
  if (typeof window === "undefined") return () => {};

  const recentClicks: ClickSample[] = [];
  const milestonesHit = new Map<string, Set<number>>();
  let currentPath = getPath();

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const sample: ClickSample = { x: e.clientX, y: e.clientY, t: Date.now() };
    recentClicks.push(sample);
    while (recentClicks.length && sample.t - recentClicks[0].t > RAGE_WINDOW_MS) {
      recentClicks.shift();
    }

    // Rage detection: count near-coincident clicks.
    const cluster = recentClicks.filter(
      (c) =>
        Math.abs(c.x - sample.x) < RAGE_DISTANCE_PX &&
        Math.abs(c.y - sample.y) < RAGE_DISTANCE_PX,
    );
    if (cluster.length >= RAGE_THRESHOLD) {
      getTracker().event({
        type: "rage_click",
        target: describeElement(target),
        payload: { count: cluster.length },
      });
      // Reset cluster tracking to avoid spamming.
      recentClicks.length = 0;
    }

    // Anchor / outbound / cta classification.
    const anchor = target.closest("a") as HTMLAnchorElement | null;
    const cta = target.closest("[data-tc-cta]") as HTMLElement | null;
    const button = target.closest("button") as HTMLButtonElement | null;

    if (cta) {
      getTracker().event({
        type: "cta_click",
        name: cta.getAttribute("data-tc-cta") || "cta",
        target: describeElement(cta),
      });
    }

    if (anchor && anchor.href) {
      const isOutbound = isOutboundUrl(anchor.href);
      const isMail = anchor.href.startsWith("mailto:");
      const isTel = anchor.href.startsWith("tel:");
      if (isOutbound || isMail || isTel) {
        getTracker().event({
          type: isMail ? "mailto_click" : isTel ? "tel_click" : "outbound_click",
          target: anchor.href.slice(0, 256),
          name: describeElement(anchor),
        });
      } else if (!cta) {
        getTracker().event({
          type: "link_click",
          target: anchor.getAttribute("href") || "",
          name: describeElement(anchor),
        });
      }
    } else if (button && !cta) {
      getTracker().event({
        type: "button_click",
        target: describeElement(button),
        name: button.textContent?.trim().slice(0, 64) || undefined,
      });
    }
  };

  const onScroll = () => {
    const path = getPath();
    if (!path) return;
    if (path !== currentPath) {
      currentPath = path;
      milestonesHit.clear();
    }
    const doc = document.documentElement;
    const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, ((window.scrollY || 0) / scrollable) * 100);
    let hit = milestonesHit.get(path);
    if (!hit) {
      hit = new Set();
      milestonesHit.set(path, hit);
    }
    for (const m of SCROLL_MILESTONES) {
      if (pct >= m && !hit.has(m)) {
        hit.add(m);
        getTracker().event({
          type: "scroll_milestone",
          name: `${m}`,
          value: String(m),
        });
      }
    }
  };

  document.addEventListener("click", onClick, { capture: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    document.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
    window.removeEventListener("scroll", onScroll);
  };
}

function describeElement(el: Element): string {
  const aria = el.getAttribute("aria-label");
  if (aria) return aria.slice(0, 96);
  const tcLabel = el.getAttribute("data-tc-label");
  if (tcLabel) return tcLabel.slice(0, 96);
  const text = (el.textContent || "").trim().replace(/\s+/g, " ");
  if (text) return text.slice(0, 96);
  const id = el.id ? `#${el.id}` : "";
  const tag = el.tagName.toLowerCase();
  return `${tag}${id}`.slice(0, 96);
}

function isOutboundUrl(href: string): boolean {
  try {
    const url = new URL(href, window.location.href);
    return url.host !== window.location.host && /^https?:$/.test(url.protocol);
  } catch {
    return false;
  }
}
