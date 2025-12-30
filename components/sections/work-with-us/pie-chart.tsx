"use client";

import { Pie, PieChart, Sector } from "recharts";
import { type PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A donut chart with an active sector";

const chartData = [
  { name: "Tenger Capital", percentage: 25, fill: "#8b6a3f" },
  { name: "Others", percentage: 75, fill: "#4a3f38" },
];

const chartConfig = {
  percentage: {
    label: "Percentage",
  },
  name: {
    label: "Name",
  },
} satisfies ChartConfig;

export function ChartPieDonutActive() {
  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square">
      <PieChart>
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        /> */}
        <Pie
          data={chartData}
          dataKey="percentage"
          nameKey="name"
          innerRadius={64}
          strokeWidth={5}
          activeIndex={0}
          activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
            <Sector {...props} outerRadius={outerRadius + 10} />
          )}
        />
      </PieChart>
    </ChartContainer>
  );
}
