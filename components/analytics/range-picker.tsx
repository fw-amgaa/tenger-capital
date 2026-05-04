"use client";

import { Button } from "@/components/ui/button";

export type RangeKey = "1d" | "7d" | "30d" | "90d";

const OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "1d", label: "24 цаг" },
  { key: "7d", label: "7 хоног" },
  { key: "30d", label: "30 хоног" },
  { key: "90d", label: "90 хоног" },
];

export function rangeToWindow(key: RangeKey): { from: Date; to: Date } {
  const to = new Date();
  const ms =
    key === "1d"
      ? 24 * 60 * 60 * 1000
      : key === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : key === "30d"
          ? 30 * 24 * 60 * 60 * 1000
          : 90 * 24 * 60 * 60 * 1000;
  return { from: new Date(to.getTime() - ms), to };
}

export function RangePicker({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (v: RangeKey) => void;
}) {
  return (
    <div className="flex gap-1 rounded-md border bg-background p-1">
      {OPTIONS.map((o) => (
        <Button
          key={o.key}
          size="sm"
          variant={value === o.key ? "default" : "ghost"}
          onClick={() => onChange(o.key)}
          className="h-7 px-3 text-xs"
        >
          {o.label}
        </Button>
      ))}
    </div>
  );
}
