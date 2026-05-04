"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/analytics/dashboard-shell";
import {
  RangePicker,
  rangeToWindow,
  type RangeKey,
} from "@/components/analytics/range-picker";
import { formatNumber } from "@/components/analytics/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUpRight, MousePointerClick } from "lucide-react";

type Response = {
  range: { from: string; to: string };
  ctas: { name: string; target: string; type: string; clicks: number; uniqueSessions: number }[];
  outbound: { target: string; clicks: number }[];
  rage: { target: string; path: string; occurrences: number }[];
  scrollMilestones: { milestone: string; count: number }[];
  scrollDistribution: { label: string; count: number }[];
};

const TYPE_LABEL: Record<string, string> = {
  cta_click: "CTA",
  button_click: "Товч",
  link_click: "Холбоос",
  outbound_click: "Гадагш",
  mailto_click: "И-мэйл",
  tel_click: "Утас",
};

export default function EngagementPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { from, to } = rangeToWindow(range);
    fetch(
      `/api/analytics/engagement?from=${from.toISOString()}&to=${to.toISOString()}`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Response | null) => {
        if (cancelled) return;
        setData(j);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const maxScroll = Math.max(1, ...(data?.scrollDistribution.map((s) => s.count) ?? [0]));
  const maxCta = Math.max(1, ...(data?.ctas.map((c) => c.clicks) ?? [0]));

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Идэвх" },
      ]}
      actions={<RangePicker value={range} onChange={setRange} />}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Идэвх</h1>
        <p className="text-muted-foreground">
          Дарагдсан товч, гадагш холбоос, scroll гүн ба rage click.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <MousePointerClick className="h-4 w-4" /> Дарагдсан элементүүд
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center text-muted-foreground">Уншиж байна...</div>
            ) : (data?.ctas.length ?? 0) === 0 ? (
              <div className="py-6 text-center text-muted-foreground">Өгөгдөл алга.</div>
            ) : (
              <ul className="space-y-2.5 text-sm">
                {data!.ctas.slice(0, 15).map((c, i) => (
                  <li key={i} className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {TYPE_LABEL[c.type] ?? c.type}
                        </Badge>
                        <span className="truncate font-medium">
                          {c.name || c.target || "—"}
                        </span>
                      </div>
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {formatNumber(c.clicks)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(c.clicks / maxCta) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Scroll тархалт</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(data?.scrollDistribution ?? []).map((b) => (
                <li key={b.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{b.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatNumber(b.count)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(b.count / maxScroll) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            {data?.scrollMilestones && data.scrollMilestones.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                {[25, 50, 75, 100].map((m) => {
                  const hit = data.scrollMilestones.find(
                    (s) => Number(s.milestone) === m,
                  );
                  return (
                    <div
                      key={m}
                      className="rounded-md border bg-muted/30 px-2 py-1.5"
                    >
                      <div className="font-medium">{m}%</div>
                      <div className="tabular-nums text-muted-foreground">
                        {formatNumber(hit?.count ?? 0)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUpRight className="h-4 w-4" /> Гадагш холбоос
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.outbound.length ?? 0) === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Гадагш дарсан холбоос алга.
              </div>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {data!.outbound.map((o, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 border-b border-dashed border-border/50 py-1.5 last:border-0"
                  >
                    <span className="truncate text-xs text-muted-foreground">
                      {o.target}
                    </span>
                    <span className="tabular-nums text-xs">
                      {formatNumber(o.clicks)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-600" /> Rage click
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.rage.length ?? 0) === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Rage click алга — UX найдвартай байна.
              </div>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {data!.rage.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 border-b border-dashed border-border/50 py-1.5 last:border-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{r.target || "—"}</div>
                      <div className="text-xs text-muted-foreground">{r.path}</div>
                    </div>
                    <span className="tabular-nums text-xs text-amber-700">
                      {formatNumber(r.occurrences)}
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
