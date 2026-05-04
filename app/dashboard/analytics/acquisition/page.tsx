"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/analytics/dashboard-shell";
import {
  RangePicker,
  rangeToWindow,
  type RangeKey,
} from "@/components/analytics/range-picker";
import { formatNumber, formatPercent } from "@/components/analytics/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Response = {
  range: { from: string; to: string };
  channels: { channel: string; sessions: number; visitors: number }[];
  referrers: { host: string | null; sessions: number; visitors: number }[];
  utm: {
    source: string | null;
    medium: string | null;
    campaign: string | null;
    sessions: number;
    visitors: number;
  }[];
};

export default function AcquisitionPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { from, to } = rangeToWindow(range);
    fetch(
      `/api/analytics/acquisition?from=${from.toISOString()}&to=${to.toISOString()}`,
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

  const totalSessions = useMemo(
    () => (data?.channels ?? []).reduce((a, c) => a + c.sessions, 0),
    [data],
  );

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Эх сурвалж" },
      ]}
      actions={<RangePicker value={range} onChange={setRange} />}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Эх сурвалж</h1>
        <p className="text-muted-foreground">
          Зочин хаанаас орж ирсэн — шууд, хайлт, лавлагаа, сошиал, кампанит.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Сувгууд</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center text-muted-foreground">
              Уншиж байна...
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {(data?.channels ?? []).map((c) => {
                const pct =
                  totalSessions > 0 ? (c.sessions / totalSessions) * 100 : 0;
                return (
                  <li key={c.channel} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{c.channel}</span>
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {formatNumber(c.sessions)} сесс · {formatPercent(pct)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Лавлагаа домэйн</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.referrers.length ?? 0) === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Лавлагаа алга.
              </div>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {data!.referrers.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between border-b border-dashed border-border/50 py-1.5 last:border-0"
                  >
                    <span className="truncate text-xs">{r.host}</span>
                    <span className="tabular-nums text-xs text-muted-foreground">
                      {formatNumber(r.sessions)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">UTM кампанит</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.utm.length ?? 0) === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                UTM-тэй кампанит алга.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="px-1 py-1">source</th>
                      <th className="px-1 py-1">medium</th>
                      <th className="px-1 py-1">campaign</th>
                      <th className="px-1 py-1 text-right">сесс</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data!.utm.map((u, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-1 py-1.5">{u.source || "—"}</td>
                        <td className="px-1 py-1.5">{u.medium || "—"}</td>
                        <td className="px-1 py-1.5">{u.campaign || "—"}</td>
                        <td className="px-1 py-1.5 text-right tabular-nums">
                          {formatNumber(u.sessions)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
