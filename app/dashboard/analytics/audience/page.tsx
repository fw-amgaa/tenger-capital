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
  formatNumber,
  formatPercent,
} from "@/components/analytics/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MongoliaTileMap } from "@/components/analytics/mongolia-tile-map";
import {
  countryName,
  flagEmoji,
  mongoliaRegionLabel,
} from "@/lib/analytics/mongolia-regions";

type Response = {
  range: { from: string; to: string };
  countries: { code: string | null; visitors: number; sessions: number }[];
  mongoliaRegions: { code: string | null; visitors: number; sessions: number }[];
  ubCities: { city: string | null; visitors: number; sessions: number }[];
  devices: { kind: string | null; sessions: number }[];
  browsers: { kind: string | null; sessions: number }[];
  oses: { kind: string | null; sessions: number }[];
  languages: { kind: string | null; sessions: number }[];
};

function Bar({
  label,
  value,
  max,
  pct,
}: {
  label: string;
  value: number;
  max: number;
  pct?: number;
}) {
  return (
    <li className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-xs text-muted-foreground">
          {formatNumber(value)}
          {pct != null ? ` · ${formatPercent(pct)}` : ""}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary"
          style={{ width: `${(value / Math.max(1, max)) * 100}%` }}
        />
      </div>
    </li>
  );
}

export default function AudiencePage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const { from, to } = rangeToWindow(range);
    fetch(
      `/api/analytics/audience?from=${from.toISOString()}&to=${to.toISOString()}`,
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

  const totals = useMemo(() => {
    const c = data?.countries ?? [];
    const total = c.reduce((acc, r) => acc + r.visitors, 0);
    const mn = c.find((r) => r.code === "MN")?.visitors ?? 0;
    const foreign = total - mn;
    return { total, mn, foreign };
  }, [data]);

  const foreignCountries = useMemo(
    () => (data?.countries ?? []).filter((c) => c.code && c.code !== "MN"),
    [data],
  );

  const totalDeviceSessions = useMemo(
    () => (data?.devices ?? []).reduce((a, d) => a + d.sessions, 0),
    [data],
  );

  return (
    <DashboardShell
      breadcrumbs={[
        { label: "Аналитик", href: "/dashboard/analytics" },
        { label: "Үзэгчид" },
      ]}
      actions={<RangePicker value={range} onChange={setRange} />}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Үзэгчид</h1>
        <p className="text-muted-foreground">
          Хаанаас орж ирсэн, ямар төхөөрөмжөөс үзсэн, ямар хэлэнд хэрэглэдэг.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          label="Нийт зочин"
          value={formatNumber(totals.total)}
          sub={`${totals.foreign > 0 ? formatNumber(totals.foreign) + " гадаад" : ""}`}
        />
        <KpiCard
          label="Монгол"
          value={formatNumber(totals.mn)}
          sub={
            totals.total > 0
              ? formatPercent((totals.mn / totals.total) * 100, 0)
              : ""
          }
        />
        <KpiCard
          label="Гадаад"
          value={formatNumber(totals.foreign)}
          sub={`${foreignCountries.length} орон`}
        />
        <KpiCard
          label="Хэл"
          value={
            data?.languages?.[0]?.kind
              ? `${data.languages[0].kind?.toUpperCase()}`
              : "—"
          }
          sub={
            data?.languages?.[0]
              ? `${formatNumber(data.languages[0].sessions)} сесс`
              : ""
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MongoliaTileMap
            regions={data?.mongoliaRegions ?? []}
            selected={selectedRegion}
            onSelect={(c) => setSelectedRegion(selectedRegion === c ? null : c)}
          />
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Аймаг жагсаалт</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center text-muted-foreground">
                Уншиж байна...
              </div>
            ) : (
              <ul className="max-h-[280px] space-y-2 overflow-y-auto pr-1 text-sm">
                {(data?.mongoliaRegions ?? []).map((r) => (
                  <Bar
                    key={r.code ?? "_"}
                    label={mongoliaRegionLabel(r.code)}
                    value={r.visitors}
                    max={
                      data?.mongoliaRegions[0]?.visitors ?? 1
                    }
                  />
                ))}
                {(!data || data.mongoliaRegions.length === 0) && (
                  <li className="py-4 text-center text-muted-foreground">
                    Өгөгдөл алга.
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedRegion === "1" && data && data.ubCities.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Улаанбаатар хотын дүүрэг</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.ubCities.map((c, i) => (
                <Bar
                  key={i}
                  label={c.city || "Тодорхойгүй"}
                  value={c.visitors}
                  max={data.ubCities[0]?.visitors ?? 1}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">🌍 Гадаадаас</CardTitle>
          </CardHeader>
          <CardContent>
            {foreignCountries.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                Гадаадаас зочин алга.
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                {foreignCountries.map((c) => (
                  <li
                    key={c.code}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none">
                        {flagEmoji(c.code)}
                      </span>
                      <span className="font-medium">{countryName(c.code)}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.code}
                      </span>
                    </div>
                    <span className="tabular-nums text-xs">
                      {formatNumber(c.visitors)} зочин
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Төхөөрөмж</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(data?.devices ?? []).map((d) => (
                <Bar
                  key={d.kind ?? "_"}
                  label={d.kind || "—"}
                  value={d.sessions}
                  max={totalDeviceSessions}
                  pct={
                    totalDeviceSessions > 0
                      ? (d.sessions / totalDeviceSessions) * 100
                      : 0
                  }
                />
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Хөтөч</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(data?.browsers ?? []).slice(0, 8).map((d) => (
                <Bar
                  key={d.kind ?? "_"}
                  label={d.kind || "—"}
                  value={d.sessions}
                  max={data?.browsers[0]?.sessions ?? 1}
                />
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Үйлдлийн систем</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {(data?.oses ?? []).slice(0, 8).map((d) => (
                <Bar
                  key={d.kind ?? "_"}
                  label={d.kind || "—"}
                  value={d.sessions}
                  max={data?.oses[0]?.sessions ?? 1}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
