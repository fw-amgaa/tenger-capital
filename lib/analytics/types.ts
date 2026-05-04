export type IngestInit = {
  landingPath: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  language?: string | null;
  viewportW?: number | null;
  viewportH?: number | null;
};

export type IngestPageview = {
  kind: "pageview";
  id: string;
  path: string;
  query?: string | null;
  title?: string | null;
  startedAt: number;
  endedAt?: number | null;
  durationMs?: number | null;
  maxScrollPct?: number | null;
  viewportW?: number | null;
  viewportH?: number | null;
  isExit?: boolean;
};

export type IngestSection = {
  kind: "section";
  id: string;
  pageviewId: string;
  pagePath: string;
  sectionId: string;
  firstSeenAt: number;
  lastSeenAt: number;
  dwellMs: number;
  maxVisiblePct: number;
};

export type IngestEvent = {
  kind: "event";
  id: string;
  pageviewId?: string | null;
  type: string;
  name?: string | null;
  target?: string | null;
  value?: string | null;
  payload?: Record<string, unknown> | null;
  path?: string | null;
  occurredAt: number;
};

export type IngestItem = IngestPageview | IngestSection | IngestEvent;

export type IngestPayload = {
  visitorId: string;
  sessionId: string;
  init?: IngestInit;
  items: IngestItem[];
};
