"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/analytics/dashboard-shell";
import {
  RangePicker,
  rangeToWindow,
  type RangeKey,
} from "@/components/analytics/range-picker";
import {
  KpiCard,
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/components/analytics/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

type SectionRow = {
  id: string;
  label: string;
  registered: boolean;
  impressions: number;
  uniqueVisitors: number;
  avgDwellMs: number;
  avgVisiblePct: number;
  reachPct: number;
};

type Response = {
  range: { from: string; to: string };
  path: string;
  pages: string[];
  pageviews: number;
  uniqueVisitors: number;
  sections: SectionRow[];
};

export default function SectionsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [path, setPath] = useState("/");
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { from, to } = rangeToWindow(range);
    fetch(
      `/api/analytics/sections?from=${from.toISOString()}&to=${to.toISOString()}&path=${encodeURIComponent(path)}`,
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
  }, [range, path]);

  const seen = useMemo(
    () => (data?.sections ?? []).filter((s) => s.impressions > 0),
    [data],
  );
  const neverSeen = useMemo(
    () =>
      (data?.sections ?? []).filter((s) => s.registered && s.impressions === 0),
    [data],
  );
  const drift = useMemo(
    () => (data?.sections ?? []).filter((s) => !s.registered),
    [data],
  );

  const sortedSeen = useMemo(
    () =>
      [...seen].sort((a, b) => b.uniqueVisitors - a.uniqueVisitors || b.impressions - a.impressions),
    [seen],
  );

  const maxReach = sortedSeen[0]?.reachPct ?? 0;

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Хэсгүүд" },
      ]}
      actions={<RangePicker value={range} onChange={setRange} />}
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Хэсгүүд</h1>
          <p className="text-muted-foreground">
            Хэрэглэгчид аль хэсгийг хэр их хардаг — олдсон болон <strong>огт</strong>{" "}
            үзэгдээгүй хэсгүүд.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border bg-background p-1">
          {(data?.pages ?? ["/"]).map((p) => (
            <button
              key={p}
              onClick={() => setPath(p)}
              className={`h-7 rounded px-2.5 text-xs ${
                path === p
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Хуудасны үзэлт"
          value={formatNumber(data?.pageviews ?? 0)}
        />
        <KpiCard
          label="Үзсэн зочин"
          value={formatNumber(data?.uniqueVisitors ?? 0)}
        />
        <KpiCard
          label="Бүртгэгдсэн хэсэг"
          value={formatNumber((data?.sections ?? []).filter((s) => s.registered).length)}
        />
        <KpiCard
          label="Огт үзэгдээгүй"
          value={formatNumber(neverSeen.length)}
          sub={
            neverSeen.length > 0
              ? "анхаар: хүн харахгүй байна"
              : "бүх хэсэг харагдсан"
          }
        />
      </div>

      {drift.length > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
            <div className="text-sm">
              <p className="font-medium">Бүртгэгдээгүй хэсэг илэрсэн</p>
              <p className="text-muted-foreground">
                {drift.map((d) => d.id).join(", ")} — section-registry.ts-д
                нэмнэ үү.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4" /> Хүрэлт ба идэвх
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">
              Уншиж байна...
            </div>
          ) : sortedSeen.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Энэ хугацаанд харагдсан хэсэг алга.
            </div>
          ) : (
            <ul className="space-y-3">
              {sortedSeen.map((s, i) => (
                <li key={s.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-right text-xs text-muted-foreground">
                        {i + 1}.
                      </span>
                      <span className="font-medium">{s.label}</span>
                      {!s.registered && (
                        <Badge variant="secondary" className="text-[10px]">
                          бүртгэлгүй
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {s.id}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{formatPercent(s.reachPct)} хүрэлт</span>
                      <span>{formatDuration(s.avgDwellMs)} дунд</span>
                      <span>{formatNumber(s.uniqueVisitors)} зочин</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${maxReach > 0 ? (s.reachPct / maxReach) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {neverSeen.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <EyeOff className="h-4 w-4 text-destructive" /> Огт үзэгдээгүй хэсгүүд
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {neverSeen.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between border-b border-dashed border-border/50 py-1.5 last:border-0"
                >
                  <span className="font-medium">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.id}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}
