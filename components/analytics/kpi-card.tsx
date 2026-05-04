"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "default" | "live";
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          {accent === "live" && (
            <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase text-emerald-600">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-emerald-500",
                  "animate-pulse",
                )}
              />
              шууд
            </span>
          )}
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">
          {value}
        </div>
        {sub && (
          <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("mn-MN").format(n);
}

export function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return "0с";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}с`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return rs ? `${m}м ${rs}с` : `${m}м`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm ? `${h}ц ${rm}м` : `${h}ц`;
}

export function formatPercent(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "0%";
  return `${n.toFixed(digits)}%`;
}
