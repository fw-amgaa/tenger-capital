"use client";

import { useEffect, useState } from "react";
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

type Response = {
  range: { from: string; to: string };
  funnel: {
    opens: number;
    firstInputs: number;
    submitAttempts: number;
    submitSuccess: number;
    submitErrors: number;
    abandons: number;
  };
  completionRate: number;
  timeToFirstInput: { median: number; p90: number; samples: number };
  timeToSubmit: { median: number; samples: number };
  fields: {
    id: string;
    label: string;
    focuses: number;
    uniqueSessions: number;
    abandonHere: number;
  }[];
};

const FUNNEL_STEPS: { key: keyof Response["funnel"]; label: string }[] = [
  { key: "opens", label: "Маягт нээгдсэн" },
  { key: "firstInputs", label: "Эхний оролт" },
  { key: "submitAttempts", label: "Илгээх оролдлого" },
  { key: "submitSuccess", label: "Амжилттай илгээсэн" },
];

export default function FormAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { from, to } = rangeToWindow(range);
    fetch(
      `/api/analytics/form?from=${from.toISOString()}&to=${to.toISOString()}`,
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

  const top = data?.funnel.opens ?? 0;
  const maxFieldFocus = Math.max(1, ...(data?.fields.map((f) => f.focuses) ?? [0]));

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Маягт" },
      ]}
      actions={<RangePicker value={range} onChange={setRange} />}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Маягт</h1>
        <p className="text-muted-foreground">
          /submit-form хуудасны бөглөлтийн funnel — хэн нээж, хэн орхиж, хэн илгээж байна.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Илгээлт"
          value={formatNumber(data?.funnel.submitSuccess ?? 0)}
        />
        <KpiCard
          label="Бөглөх хувь"
          value={formatPercent(data?.completionRate ?? 0)}
          sub={`${formatNumber(data?.funnel.opens ?? 0)} нээгдсэн`}
        />
        <KpiCard
          label="Эхэлтэл (median)"
          value={formatDuration(data?.timeToFirstInput.median ?? 0)}
          sub={`p90: ${formatDuration(data?.timeToFirstInput.p90 ?? 0)}`}
        />
        <KpiCard
          label="Илгээтэл (median)"
          value={formatDuration(data?.timeToSubmit.median ?? 0)}
          sub={`${formatNumber(data?.timeToSubmit.samples ?? 0)} sample`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center text-muted-foreground">Уншиж байна...</div>
            ) : (
              <ul className="space-y-3 text-sm">
                {FUNNEL_STEPS.map((s) => {
                  const v = data?.funnel[s.key] ?? 0;
                  const pct = top > 0 ? (v / top) * 100 : 0;
                  return (
                    <li key={s.key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{s.label}</span>
                        <span className="tabular-nums text-xs text-muted-foreground">
                          {formatNumber(v)} · {formatPercent(pct)}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
                {data?.funnel.submitErrors ? (
                  <li className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs">
                    <span>Алдаа</span>
                    <span className="tabular-nums">
                      {formatNumber(data.funnel.submitErrors)}
                    </span>
                  </li>
                ) : null}
                <li className="flex items-center justify-between rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs">
                  <span>Орхисон</span>
                  <span className="tabular-nums">
                    {formatNumber(data?.funnel.abandons ?? 0)}
                  </span>
                </li>
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Талбарууд</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.fields.length ?? 0) === 0 ? (
              <div className="py-6 text-center text-muted-foreground">Өгөгдөл алга.</div>
            ) : (
              <ul className="space-y-2.5 text-sm">
                {data!.fields.map((f) => (
                  <li key={f.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{f.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatNumber(f.uniqueSessions)} зочин · {formatNumber(f.abandonHere)} орхисон
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(f.focuses / maxFieldFocus) * 100}%`,
                        }}
                      />
                    </div>
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
