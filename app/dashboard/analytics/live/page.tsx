"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/analytics/dashboard-shell";
import { KpiCard, formatDuration, formatNumber } from "@/components/analytics/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  countryName,
  flagEmoji,
  mongoliaRegionLabel,
} from "@/lib/analytics/mongolia-regions";

type Visitor = {
  visitorId: string;
  sessionId: string;
  path: string;
  startedAt: string;
  durationMs: number;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
};

type Event = {
  id: string;
  type: string;
  name: string | null;
  target: string | null;
  path: string | null;
  occurredAt: string;
};

type Response = {
  cutoff: string;
  visitors: Visitor[];
  events: Event[];
};

const POLL_MS = 5_000;

function shortVisitor(id: string): string {
  return id.slice(0, 8);
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return `${Math.max(0, Math.round(ms / 1000))}с`;
  if (ms < 60 * 60_000) return `${Math.round(ms / 60_000)}м`;
  return `${Math.round(ms / 3_600_000)}ц`;
}

export default function LivePage() {
  const [data, setData] = useState<Response | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      fetch("/api/analytics/live")
        .then((r) => (r.ok ? r.json() : null))
        .then((j: Response | null) => {
          if (!cancelled) setData(j);
        })
        .catch(() => {});
    };
    tick();
    const id = window.setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Шууд" },
      ]}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Шууд</h1>
        <p className="text-muted-foreground">
          Сүүлийн 5 минутад идэвхтэй зочин болон үйлдлүүд. 5 секунд тутамд
          сэргэнэ.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <KpiCard
          label="Онлайн зочин"
          value={formatNumber(data?.visitors.length ?? 0)}
          accent="live"
        />
        <KpiCard
          label="Сүүлийн үйлдлүүд"
          value={formatNumber(data?.events.length ?? 0)}
        />
        <KpiCard
          label="Шинэчилсэн"
          value={data ? "одоо" : "—"}
          sub="5 секунд тутам"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Идэвхтэй зочид</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.visitors.length ?? 0) === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Одоогоор зочин алга.
              </div>
            ) : (
              <ul className="space-y-2">
                {data!.visitors.map((v) => (
                  <li
                    key={v.visitorId}
                    className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="text-xl leading-none">
                        {flagEmoji(v.country)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {shortVisitor(v.visitorId)}
                          </span>
                          {v.country === "MN" && v.region && (
                            <Badge variant="secondary" className="text-[10px]">
                              {mongoliaRegionLabel(v.region)}
                            </Badge>
                          )}
                          {v.country && v.country !== "MN" && (
                            <Badge variant="outline" className="text-[10px]">
                              {countryName(v.country)}
                            </Badge>
                          )}
                          {v.device && (
                            <span className="text-xs text-muted-foreground">
                              · {v.device}
                              {v.browser ? ` · ${v.browser}` : ""}
                            </span>
                          )}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {v.path}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="tabular-nums">
                        {formatDuration(v.durationMs)}
                      </div>
                      <div className="text-muted-foreground">
                        {timeAgo(v.startedAt)} өмнө
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Үйлдлийн урсгал</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.events.length ?? 0) === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                Үйлдэл алга.
              </div>
            ) : (
              <ul className="max-h-[400px] space-y-1.5 overflow-y-auto pr-1 text-xs">
                {data!.events.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-start gap-2 border-b border-dashed border-border/40 pb-1.5 last:border-0"
                  >
                    <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{e.type}</span>
                        {e.name && (
                          <span className="text-muted-foreground">
                            · {e.name}
                          </span>
                        )}
                      </div>
                      <div className="truncate text-muted-foreground">
                        {e.target || e.path || ""}
                      </div>
                    </div>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {timeAgo(e.occurredAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
