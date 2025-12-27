"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
  { month: "Андеррайтер", prev: 48.7, this: 440.2 },
  { month: "Брокер", prev: 74.7, this: 559.9 },
];

const chartConfig = {
  prev: {
    label: "2024",
    color: "var(--chart-1)",
  },
  this: {
    label: "2025",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartBarMultiple() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData} barGap={48}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="prev" fill="#4a3f38" radius={4} barSize={32} />
        <Bar dataKey="this" fill="#8b6a3f" radius={4} barSize={32} />
      </BarChart>
    </ChartContainer>
  );
}
