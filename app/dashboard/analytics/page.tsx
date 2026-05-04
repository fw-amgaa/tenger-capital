"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

type OverviewResponse = {
  range: { from: string; to: string };
  totals: {
    visitors: number;
    newVisitors: number;
    sessions: number;
    pageviews: number;
    bounces: number;
    durationMs: number;
  };
  live: { visitors: number; pageviews: number };
  series: {
    day: string;
    visitors: number;
    sessions: number;
    pageviews: number;
    bounces: number;
    durationMs: number;
  }[];
};

type Metric = "visitors" | "sessions" | "pageviews";

const METRIC_LABEL: Record<Metric, string> = {
  visitors: "Зочин",
  sessions: "Сесс",
  pageviews: "Үзэлт",
};

export default function AnalyticsOverviewPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<Metric>("visitors");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { from, to } = rangeToWindow(range);
    fetch(
      `/api/analytics/overview?from=${from.toISOString()}&to=${to.toISOString()}`,
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled) return;
        setData(j);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const totals = data?.totals;
  const bounceRate = useMemo(() => {
    if (!totals || totals.sessions === 0) return 0;
    return (totals.bounces / totals.sessions) * 100;
  }, [totals]);
  const avgDuration = useMemo(() => {
    if (!totals || totals.sessions === 0) return 0;
    return totals.durationMs / totals.sessions;
  }, [totals]);

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Тойм" },
      ]}
      actions={<RangePicker value={range} onChange={setRange} />}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Тойм</h1>
        <p className="text-muted-foreground">
          Сайтын траффикийн ерөнхий зураг — {METRIC_LABEL.visitors.toLowerCase()},
          сесс, үзэлт.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard
          label="Шууд онлайн"
          value={formatNumber(data?.live.visitors ?? 0)}
          sub={`${formatNumber(data?.live.pageviews ?? 0)} сүүлийн 5 минут`}
          accent="live"
        />
        <KpiCard
          label="Нийт зочин"
          value={formatNumber(totals?.visitors ?? 0)}
          sub={
            totals
              ? `${formatNumber(totals.newVisitors)} шинэ`
              : undefined
          }
        />
        <KpiCard
          label="Сесс"
          value={formatNumber(totals?.sessions ?? 0)}
        />
        <KpiCard
          label="Үзэлт"
          value={formatNumber(totals?.pageviews ?? 0)}
        />
        <KpiCard
          label="Дундаж сесс"
          value={formatDuration(avgDuration)}
        />
        <KpiCard
          label="Bounce rate"
          value={formatPercent(bounceRate)}
          sub={`${formatNumber(totals?.bounces ?? 0)} нэг үзэлттэй`}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base">Цаг хугацааны түүх</CardTitle>
          <div className="flex gap-1 rounded-md border bg-background p-1">
            {(["visitors", "sessions", "pageviews"] as Metric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`h-7 rounded px-2.5 text-xs ${
                  metric === m
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {METRIC_LABEL[m]}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Уншиж байна...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.series ?? []}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--primary)"
                        stopOpacity={0.45}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    strokeOpacity={0.08}
                  />
                  <XAxis
                    dataKey="day"
                    tickFormatter={(v: string) => v.slice(5)}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [formatNumber(v), METRIC_LABEL[metric]]}
                    labelFormatter={(v) => v as string}
                  />
                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#metricFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
