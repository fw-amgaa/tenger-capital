# Tenger Capital — agent guide

This project ships a self-hosted analytics tracker with a multi-page dashboard
under `/dashboard/analytics`. **Read this section before touching anything that
adds pages, sections, forms, CTAs, or schema** — most "just works" if you
follow the conventions; deviating breaks the dashboards silently.

## Architecture at a glance

```
Client                                    Server
─────────                                 ──────────
AnalyticsProvider (app/layout.tsx)        POST /api/analytics/ingest
  │                                          │ (bot filter, geo headers,
  ├─ tracker (lib/analytics/tracker.ts)      │  admin cookie short-circuit)
  │    pageview / section / event queue      ▼
  │    sendBeacon every 10s / 25 events    Postgres (Drizzle):
  │                                          analytics_visitor
  ├─ auto-track (lib/analytics/auto-track.ts) analytics_session
  │    clicks, rage, scroll, outbound        analytics_pageview
  │                                          analytics_section_view
  └─ TrackedSection                          analytics_event
       (components/analytics/                analytics_daily_*  ← rolled up
        tracked-section.tsx)                   by Vercel cron @ 03:15 UTC
                                               (/api/analytics/cron/aggregate)
```

**Raw retention: 90 days. Daily aggregates: forever.** The cron also prunes
visitors with `last_seen_at` older than 365 days.

## What's tracked automatically — DO NOT reinvent

A new page or component already gets all of this for free:

- Pageviews, sessions, visitors, durations, **max scroll %**, exit
- Scroll milestones (25/50/75/100)
- All clicks → auto-classified as `cta_click` / `button_click` / `link_click` /
  `outbound_click` / `mailto_click` / `tel_click`
- Rage clicks (3+ near-coincident clicks within 1s)
- Referrer, UTM (`utm_source/medium/campaign/term/content`), geo (Vercel
  headers), device / OS / browser, language, viewport

If a user asks you to "add tracking" for a new page or button, **first check
what is already auto-captured** — usually nothing more is needed.

## Excluded from tracking — DO NOT change without asking

`components/analytics-provider.tsx` skips tracking when:
- pathname starts with `/dashboard`, `/login`, or `/api`
- there is an active better-auth session (admin)

`/api/analytics/ingest` also short-circuits on the admin cookie and on bot UA
patterns. **Both layers exist on purpose** — keep them.

## The three tiers for adding new things

### Tier 1 — Just works (no code)

New page, new component, new button. Already covered.

For a button you want to surface by *name* in the Идэвх dashboard, add a
`data-tc-cta` attribute (no JS required):

```tsx
<Button data-tc-cta="calculator-submit">Тооцоолох</Button>
<a href="..." data-tc-cta="brochure-download">Брошур</a>
```

The auto-tracker emits `cta_click` events with that name.

### Tier 2 — Section instrumentation (two lines)

Anything that should appear on the **Хэсгүүд** dashboard with reach / dwell /
"never seen" detection must be:

1. Wrapped with `<TrackedSection id="kebab-case-id">`
2. Registered in `lib/analytics/section-registry.ts`

```tsx
import { TrackedSection } from "@/components/analytics/tracked-section";

<TrackedSection id="newsletter-signup">
  <NewsletterSignup />
</TrackedSection>
```

```ts
// lib/analytics/section-registry.ts
"/some-page": [
  { id: "newsletter-signup", label: "Мэдээллийн захиалга" },
  ...
]
```

**Conventions:**
- Section IDs are kebab-case, stable, English. They are foreign keys in
  practice — renaming an ID orphans historical data.
- Labels are user-facing; Mongolian preferred (UI is Mongolian-first with EN
  fallback via `LanguageProvider`).
- If you add a `<TrackedSection>` but skip registry → the dashboard shows a
  yellow drift warning. If you register but the section never gets impressions
  → red "Огт үзэгдээгүй" callout. Both are intended signals.

A new path enters the page selector dropdown only when added to
`SECTION_REGISTRY`. Path keys are exact pathnames (`/`, `/submit-form`, etc.).

### Tier 3 — Custom events (richer payload)

```ts
import { getTracker } from "@/lib/analytics/tracker";

getTracker().event({
  type: "video_play",          // required, lowercase_with_underscores
  name: "intro-video",         // optional, semantic identifier
  target: "section:hero",      // optional, where it happened
  value: "30",                 // optional, single scalar (string)
  payload: { quality: "1080p"} // optional, bag of structured data
});
```

**Type naming convention** — keep types stable; dashboard SQL filters by exact
string match. Existing types in use:
- pageview lifecycle: `(handled by tracker, don't emit manually)`
- clicks: `cta_click`, `button_click`, `link_click`, `outbound_click`,
  `mailto_click`, `tel_click`, `rage_click`
- engagement: `scroll_milestone`
- form funnel: `form_open`, `form_first_input`, `form_field_focus`,
  `form_field_blur`, `form_submit_attempt`, `form_submit_success`,
  `form_submit_error`, `form_abandon`

Pick existing type if the meaning matches; only invent new ones for genuinely
new behaviors. New types only show in **Шууд** until a dashboard query is
written for them.

### Form funnels

If a new form should get the **Маягт**-style funnel (Opens → First Input →
Submit Attempts → Success), mirror the pattern in
`app/submit-form/form.tsx` exactly: same event types with a distinct `name`
field (e.g. `name: "newsletter_form"`). The current `/api/analytics/form`
route hardcodes `name = "submit_form"`; for a second form clone the route +
dashboard page with a different `name` filter — don't try to merge them.

## Schema rules

- `lib/db/schema.ts` is shared with better-auth. Only **additive** changes.
- Never modify or rename existing analytics tables/columns — historical data
  cannot be backfilled and the cron aggregates will drop rows on type
  mismatch.
- New columns: nullable + default, never `notNull` without a default, so
  existing rows survive `pnpm db:push`.
- Drizzle migrations: this project uses `pnpm db:push` (no migrations
  directory). Don't run `db:generate` casually — it tries to recreate
  pre-existing better-auth tables. If the user wants migrations, set that up
  deliberately and commit the `drizzle/` directory.
- For new daily-aggregate columns, also update
  `app/api/analytics/cron/aggregate/route.ts` — the cron is the *only* writer
  to `analytics_daily_*`.

## Geo / Mongolia conventions

- Geo comes from Vercel free-tier headers: `x-vercel-ip-country`,
  `x-vercel-ip-country-region` (ISO 3166-2 suffix), `x-vercel-ip-city`. Free
  tier — do not introduce paid IP-lookup APIs without explicit budget signoff.
- Mongolia regions are mapped in `lib/analytics/mongolia-regions.ts`
  (`MONGOLIA_REGIONS`, `MN_TILE_MAP`). When you see Vercel return a new region
  code that isn't there, add it — don't change codes.
- Audience dashboard is **Mongolia-first**: aimag tile map + UB drilldown +
  separate "Гадаадаас" panel with flag emoji. Keep this split — global users
  are tight on budget and the app is primarily for Mongolian visitors.
- Country codes: `"MN"` is special-cased throughout. `null`/missing maps to
  `"ZZ"` in aggregates.

## Cost guardrails (Vercel free tier + budget)

- **Batch on the client.** Tracker holds events in memory and flushes every
  10s / 25 events / `visibilitychange`. Don't add `flush()` calls per event.
- **One ingest endpoint.** A single multi-row INSERT per request. Don't
  introduce per-event roundtrips.
- **Bot filter at the door.** `lib/analytics/server-utils.ts` blocks crawlers
  before any DB write. Keep it conservative — false positives cost less than
  ingest noise.
- **No paid services.** No GA, no Segment, no PostHog, no MaxMind, no map
  tiles. Everything must work with the existing Vercel + Postgres setup.
- **Dashboard queries** default to last 30d on raw tables. Anything older
  than 90d *must* go through `analytics_daily_*` — raw rows are pruned.

## File map (where to look)

```
lib/analytics/
  tracker.ts             ← client singleton, batching, beacon flush
  auto-track.ts          ← global click/scroll/rage listeners
  section-registry.ts    ← per-page expected sections
  mongolia-regions.ts    ← aimag codes, tile map, country names/flags
  server-utils.ts        ← bot filter, UA parser, geo headers, validators
  types.ts               ← ingest payload contract (client ↔ server)

components/analytics/
  tracked-section.tsx    ← IntersectionObserver wrapper
  dashboard-shell.tsx    ← shared sidebar + header for dashboard pages
  range-picker.tsx       ← 24h / 7d / 30d / 90d
  kpi-card.tsx           ← KPI tiles + format helpers
  mongolia-tile-map.tsx  ← 22-tile aimag heat map

components/analytics-provider.tsx  ← mounted in app/layout.tsx

app/api/analytics/
  ingest/                ← POST, public, batched
  overview/              ← GET, auth, daily series + KPIs
  pages/                 ← GET, auth, top paths
  sections/              ← GET, auth, per-path section reach
  engagement/            ← GET, auth, clicks/scroll/rage
  audience/              ← GET, auth, geo + devices
  acquisition/           ← GET, auth, channels + UTM
  form/                  ← GET, auth, submit_form funnel only
  live/                  ← GET, auth, last 5 min
  cron/aggregate/        ← GET, CRON_SECRET, daily rollup + 90d cleanup

app/dashboard/analytics/
  page.tsx               ← Тойм
  pages/page.tsx         ← Хуудсууд
  sections/page.tsx      ← Хэсгүүд
  engagement/page.tsx    ← Идэвх
  audience/page.tsx      ← Үзэгчид
  acquisition/page.tsx   ← Эх сурвалж
  form/page.tsx          ← Маягт
  live/page.tsx          ← Шууд

vercel.json              ← cron schedule (don't add jobs without asking,
                           free tier allows 2 daily crons)
```

## Common pitfalls — read before coding

- **Wrapping a section breaks layout?** `<TrackedSection>` renders a `<div>`.
  If the parent is a flex/grid that targets specific child shapes, pass
  `as="section"` or restructure so the wrapper sits outside the layout-
  critical box.
- **Adding a route under `/dashboard`?** It is auto-excluded from tracking
  (good). It is also auth-gated by `middleware.ts` — keep it that way.
- **Rendering a heavy component in the home page?** Wrap with
  `<TrackedSection>` so it joins the section funnel. Wrapping has near-zero
  cost (one IntersectionObserver).
- **Need to query a custom event on the dashboard?** Filter `analytics_event`
  by `type` exact match. Add a new API route under `/api/analytics/...` and a
  page under `/dashboard/analytics/...` using `<DashboardShell>` — don't
  bolt onto an existing route.
- **Touching `app/layout.tsx`?** `<AnalyticsProvider>` must remain inside the
  Suspense boundary because it uses `useSearchParams`. Don't unwrap it.
- **Touching `components/app-sidebar.tsx`?** The Аналитик group's `items`
  array drives the sub-nav. Adding a new analytics page → add an entry there.
- **Renaming a path?** Old path data lives in raw + daily tables under the
  old path string. The new path starts a fresh row. Document the rename in
  the PR; don't try to retroactively update aggregates.
- **The Mongolian dashboard text?** UI is Mongolian-first. Match the tone of
  existing labels (e.g. "Зочин", "Сесс", "Үзэлт", "Хүрэлт"). Don't auto-
  translate to English in dashboard copy.

## When in doubt

Match the patterns in `app/submit-form/form.tsx` (form events) and
`app/page.tsx` (TrackedSection wrapping). Both are the canonical references.
