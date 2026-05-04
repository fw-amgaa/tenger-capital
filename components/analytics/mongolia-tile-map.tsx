"use client";

import {
  MN_TILE_MAP,
  mongoliaRegionLabel,
} from "@/lib/analytics/mongolia-regions";

type Region = { code: string | null; visitors: number; sessions: number };

export function MongoliaTileMap({
  regions,
  onSelect,
  selected,
}: {
  regions: Region[];
  onSelect?: (code: string) => void;
  selected?: string | null;
}) {
  const counts = new Map<string, number>();
  for (const r of regions) {
    if (r.code) counts.set(r.code, r.visitors);
  }
  const max = Math.max(1, ...regions.map((r) => r.visitors));

  return (
    <div className="rounded-lg border bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-wide">Аймгууд</span>
        <span>{regions.length} бүс</span>
      </div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
      >
        {Object.entries(MN_TILE_MAP).map(([code, pos]) => {
          const visitors = counts.get(code) ?? 0;
          const intensity = visitors / max;
          const isSelected = selected === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onSelect?.(code)}
              style={{
                gridColumn: pos.col,
                gridRow: pos.row,
                background: visitors
                  ? `color-mix(in oklch, var(--primary) ${20 + intensity * 70}%, transparent)`
                  : "var(--muted)",
                outline: isSelected ? "2px solid var(--primary)" : undefined,
              }}
              className={`group relative flex aspect-[5/4] flex-col items-center justify-center rounded-md text-center text-[10px] leading-tight transition-all hover:scale-[1.04] ${
                pos.emphasis ? "ring-1 ring-primary/40" : ""
              }`}
              title={`${mongoliaRegionLabel(code)} — ${visitors} зочин`}
            >
              <span
                className={`font-medium ${
                  intensity > 0.5 ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {mongoliaRegionLabel(code)}
              </span>
              {visitors > 0 && (
                <span
                  className={`mt-0.5 tabular-nums text-[9px] ${
                    intensity > 0.5
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {visitors}
                </span>
              )}
              {pos.emphasis && (
                <span className="absolute right-1 top-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Дөрвөлжний өнгөний эрчимт зочдын тоог илэрхийлнэ. Улаанбаатар төв
        дөрвөлжин нь онцгой тэмдэглэгээтэй.
      </p>
    </div>
  );
}
