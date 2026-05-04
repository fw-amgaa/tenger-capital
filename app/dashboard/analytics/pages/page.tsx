"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/analytics/dashboard-shell";
import {
  RangePicker,
  rangeToWindow,
  type RangeKey,
} from "@/components/analytics/range-picker";
import {
  formatDuration,
  formatNumber,
  formatPercent,
} from "@/components/analytics/kpi-card";
import { Card, CardContent } from "@/components/ui/card";

type Row = {
  path: string;
  pageviews: number;
  uniqueVisitors: number;
  avgDurationMs: number;
  avgScrollPct: number;
  bounceRate: number;
  exitRate: number;
  bounces: number;
  exits: number;
};

export default function PagesPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { from, to } = rangeToWindow(range);
    fetch(
      `/api/analytics/pages?from=${from.toISOString()}&to=${to.toISOString()}`,
    )
      .then((r) => (r.ok ? r.json() : { rows: [] }))
      .then((j: { rows: Row[] }) => {
        if (cancelled) return;
        setRows(j.rows ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const max = rows[0]?.pageviews ?? 0;

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Хуудсууд" },
      ]}
      actions={<RangePicker value={range} onChange={setRange} />}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Хуудсууд</h1>
        <p className="text-muted-foreground">
          Тус бүр хуудасны үзэлт, дундаж хугацаа, scroll гүн ба exit/bounce
          харьцаа.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Хуудас</th>
                  <th className="px-4 py-3 text-right">Үзэлт</th>
                  <th className="px-4 py-3 text-right">Зочин</th>
                  <th className="px-4 py-3 text-right">Дундаж</th>
                  <th className="px-4 py-3 text-right">Scroll</th>
                  <th className="px-4 py-3 text-right">Bounce</th>
                  <th className="px-4 py-3 text-right">Exit</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Уншиж байна...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      Өгөгдөл алга.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr
                      key={r.path}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.path}</div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${max > 0 ? (r.pageviews / max) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatNumber(r.pageviews)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatNumber(r.uniqueVisitors)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatDuration(r.avgDurationMs)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatPercent(r.avgScrollPct, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatPercent(r.bounceRate)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatPercent(r.exitRate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
