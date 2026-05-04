"use client";

import type {
  IngestEvent,
  IngestInit,
  IngestItem,
  IngestPageview,
  IngestPayload,
  IngestSection,
} from "./types";

const VISITOR_KEY = "tc_a_vid";
const SESSION_KEY = "tc_a_sid";
const SESSION_LAST_KEY = "tc_a_sla";
const SESSION_INIT_KEY = "tc_a_sii";
const SESSION_IDLE_MS = 30 * 60 * 1000;
const BATCH_INTERVAL_MS = 10_000;
const MAX_BATCH_SIZE = 25;
const INGEST_URL = "/api/analytics/ingest";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // RFC4122 v4 fallback.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readStored(key: string, store: Storage): string | null {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string, store: Storage) {
  try {
    store.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function removeStored(key: string, store: Storage) {
  try {
    store.removeItem(key);
  } catch {
    /* ignore */
  }
}

type ActivePageview = {
  id: string;
  path: string;
  query: string | null;
  title: string | null;
  startedAt: number;
  maxScrollPct: number;
  viewportW: number;
  viewportH: number;
};

type SectionState = {
  rowId: string;
  sectionId: string;
  pageviewId: string;
  pagePath: string;
  firstSeenAt: number;
  lastSeenAt: number;
  dwellMs: number;
  visibleSince: number | null;
  maxVisiblePct: number;
};

class Tracker {
  private enabled = false;
  private visitorId = "";
  private sessionId = "";
  private queue: IngestItem[] = [];
  private active: ActivePageview | null = null;
  private sections: Map<string, SectionState> = new Map();
  private flushTimer: number | null = null;
  private pendingInit: IngestInit | null = null;
  private hasSentInit = false;

  init() {
    if (typeof window === "undefined") return;
    if (this.enabled) return;

    this.enabled = true;
    this.visitorId = this.ensureVisitorId();
    this.sessionId = this.ensureSessionId();

    // Capture session-init metadata once per session.
    if (!this.sessionInitSent()) {
      const url = new URL(window.location.href);
      this.pendingInit = {
        landingPath: window.location.pathname,
        referrer: document.referrer || null,
        utmSource: url.searchParams.get("utm_source"),
        utmMedium: url.searchParams.get("utm_medium"),
        utmCampaign: url.searchParams.get("utm_campaign"),
        utmTerm: url.searchParams.get("utm_term"),
        utmContent: url.searchParams.get("utm_content"),
        language: this.detectLanguage(),
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
      };
    } else {
      this.hasSentInit = true;
    }

    // Visibility / unload flushers.
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    window.addEventListener("pagehide", this.onPageHide);
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  disable() {
    this.enabled = false;
    if (typeof window === "undefined") return;
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    window.removeEventListener("pagehide", this.onPageHide);
    window.removeEventListener("scroll", this.onScroll);
    this.queue = [];
    this.sections.clear();
    if (this.flushTimer) {
      window.clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private ensureVisitorId(): string {
    let id = readStored(VISITOR_KEY, localStorage);
    if (!id) {
      id = uuid();
      writeStored(VISITOR_KEY, id, localStorage);
    }
    return id;
  }

  private ensureSessionId(): string {
    const now = Date.now();
    const last = Number(readStored(SESSION_LAST_KEY, sessionStorage) || 0);
    let id = readStored(SESSION_KEY, sessionStorage);
    if (!id || now - last > SESSION_IDLE_MS) {
      id = uuid();
      writeStored(SESSION_KEY, id, sessionStorage);
      removeStored(SESSION_INIT_KEY, sessionStorage);
    }
    writeStored(SESSION_LAST_KEY, String(now), sessionStorage);
    return id;
  }

  private touchSession() {
    writeStored(SESSION_LAST_KEY, String(Date.now()), sessionStorage);
  }

  private sessionInitSent(): boolean {
    return readStored(SESSION_INIT_KEY, sessionStorage) === "1";
  }

  private markSessionInitSent() {
    writeStored(SESSION_INIT_KEY, "1", sessionStorage);
    this.hasSentInit = true;
  }

  private detectLanguage(): string {
    try {
      const cookieMatch = document.cookie.match(/(?:^|;\s*)tc_lang=([^;]+)/);
      if (cookieMatch) return decodeURIComponent(cookieMatch[1]);
      const stored = localStorage.getItem("tc_language");
      if (stored) return stored;
    } catch {
      /* ignore */
    }
    return navigator.language?.split("-")[0] || "mn";
  }

  pageview(path: string, query?: string | null, title?: string | null) {
    if (!this.enabled) return;
    this.touchSession();
    this.endActivePageview();
    this.active = {
      id: uuid(),
      path,
      query: query ?? null,
      title: title ?? document.title,
      startedAt: Date.now(),
      maxScrollPct: 0,
      viewportW: window.innerWidth,
      viewportH: window.innerHeight,
    };
    // Reset section accumulators (they belong to a pageview).
    this.sections.clear();
    this.scheduleFlush();
  }

  /**
   * Marks the active pageview as ended and pushes it (and any active sections)
   * onto the outgoing queue. The pageview is upsertable on the server, so calling
   * this multiple times is safe.
   */
  endActivePageview(opts?: { isExit?: boolean }) {
    if (!this.active) return;
    const now = Date.now();
    const a = this.active;
    const item: IngestPageview = {
      kind: "pageview",
      id: a.id,
      path: a.path,
      query: a.query,
      title: a.title,
      startedAt: a.startedAt,
      endedAt: now,
      durationMs: Math.max(0, now - a.startedAt),
      maxScrollPct: a.maxScrollPct,
      viewportW: a.viewportW,
      viewportH: a.viewportH,
      isExit: !!opts?.isExit,
    };
    this.queue.push(item);
    // Snapshot sections.
    for (const s of this.sections.values()) {
      this.snapshotSection(s, /* finalize */ true);
    }
  }

  private snapshotSection(s: SectionState, finalize: boolean) {
    const now = Date.now();
    if (s.visibleSince != null) {
      s.dwellMs += now - s.visibleSince;
      s.lastSeenAt = now;
      s.visibleSince = finalize ? null : now;
    }
    const item: IngestSection = {
      kind: "section",
      id: s.rowId,
      pageviewId: s.pageviewId,
      pagePath: s.pagePath,
      sectionId: s.sectionId,
      firstSeenAt: s.firstSeenAt,
      lastSeenAt: s.lastSeenAt,
      dwellMs: Math.floor(s.dwellMs),
      maxVisiblePct: Math.floor(s.maxVisiblePct),
    };
    this.queue.push(item);
  }

  /**
   * Called by <TrackedSection> on observer ratio changes.
   */
  reportSectionRatio(sectionId: string, ratio: number) {
    if (!this.enabled || !this.active) return;
    const now = Date.now();
    const key = `${this.active.id}:${sectionId}`;
    let s = this.sections.get(key);
    if (!s) {
      s = {
        rowId: uuid(),
        sectionId,
        pageviewId: this.active.id,
        pagePath: this.active.path,
        firstSeenAt: now,
        lastSeenAt: now,
        dwellMs: 0,
        visibleSince: ratio > 0 ? now : null,
        maxVisiblePct: Math.round(ratio * 100),
      };
      this.sections.set(key, s);
    } else {
      if (ratio > 0) {
        if (s.visibleSince == null) s.visibleSince = now;
        s.lastSeenAt = now;
      } else if (s.visibleSince != null) {
        s.dwellMs += now - s.visibleSince;
        s.visibleSince = null;
        s.lastSeenAt = now;
      }
      s.maxVisiblePct = Math.max(s.maxVisiblePct, Math.round(ratio * 100));
    }
    this.scheduleFlush();
  }

  event(opts: {
    type: string;
    name?: string;
    target?: string;
    value?: string;
    payload?: Record<string, unknown>;
  }) {
    if (!this.enabled) return;
    const item: IngestEvent = {
      kind: "event",
      id: uuid(),
      pageviewId: this.active?.id ?? null,
      type: opts.type,
      name: opts.name ?? null,
      target: opts.target ?? null,
      value: opts.value ?? null,
      payload: opts.payload ?? null,
      path: this.active?.path ?? (typeof window !== "undefined" ? window.location.pathname : null),
      occurredAt: Date.now(),
    };
    this.queue.push(item);
    this.touchSession();
    this.scheduleFlush();
  }

  private onScroll = () => {
    if (!this.active) return;
    const doc = document.documentElement;
    const scrollable = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, ((window.scrollY || 0) / scrollable) * 100));
    if (pct > this.active.maxScrollPct) {
      this.active.maxScrollPct = pct;
    }
  };

  private onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      // Stop section visibility timers.
      for (const s of this.sections.values()) {
        if (s.visibleSince != null) {
          s.dwellMs += Date.now() - s.visibleSince;
          s.visibleSince = null;
        }
      }
      // Flush pageview snapshot + sections.
      this.endActivePageview();
      this.flush(true);
      // Re-arm a fresh pageview on next visibility (kept simple: skip; usually
      // the tab regains focus and user navigates -> new pageview).
    } else if (document.visibilityState === "visible") {
      // Re-arm visible-since for sections that are still onscreen will naturally
      // get a ratio update from the observer.
    }
  };

  private onPageHide = () => {
    this.endActivePageview({ isExit: true });
    this.flush(true);
  };

  private scheduleFlush() {
    if (this.queue.length >= MAX_BATCH_SIZE) {
      this.flush();
      return;
    }
    if (this.flushTimer != null) return;
    this.flushTimer = window.setTimeout(() => {
      this.flushTimer = null;
      this.flush();
    }, BATCH_INTERVAL_MS);
  }

  private cancelFlushTimer() {
    if (this.flushTimer != null) {
      window.clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  flush(useBeacon = false) {
    if (!this.enabled) return;
    if (this.queue.length === 0 && !this.pendingInit) {
      this.cancelFlushTimer();
      return;
    }
    this.cancelFlushTimer();

    const items = this.queue.splice(0, this.queue.length);
    const payload: IngestPayload = {
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      items,
    };
    if (this.pendingInit && !this.hasSentInit) {
      payload.init = this.pendingInit;
    }

    const body = JSON.stringify(payload);

    let sent = false;
    if (useBeacon && "sendBeacon" in navigator) {
      try {
        const blob = new Blob([body], { type: "application/json" });
        sent = navigator.sendBeacon(INGEST_URL, blob);
      } catch {
        sent = false;
      }
    }
    if (!sent) {
      fetch(INGEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      })
        .then(() => {
          if (payload.init) this.markSessionInitSent();
        })
        .catch(() => {
          // Re-queue items on failure (best effort).
          this.queue.unshift(...items);
        });
      return;
    }
    if (payload.init) this.markSessionInitSent();
  }
}

let singleton: Tracker | null = null;

export function getTracker(): Tracker {
  if (!singleton) singleton = new Tracker();
  return singleton;
}
