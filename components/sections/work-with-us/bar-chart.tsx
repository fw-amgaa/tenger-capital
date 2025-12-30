"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A bar chart with a custom label";

const chartData = [
  { name: "ҮЦК 1", amount: 528.1, fill: "#4a3f38" },
  { name: "tg", amount: 379.2, fill: "#8b6a3f" },
  { name: "ҮЦК 2", fill: "#4a3f38", amount: 175.4 },
  { name: "ҮЦК 3", fill: "#4a3f38", amount: 151.4 },
  { name: "ҮЦК 4", fill: "#4a3f38", amount: 125.9 },
  { name: "ҮЦК 5", fill: "#4a3f38", amount: 61.8 },
  { name: "ҮЦК 6", fill: "#4a3f38", amount: 56.6 },
  { name: "ҮЦК 7", fill: "#4a3f38", amount: 15.2 },
  { name: "ҮЦК 8", fill: "#4a3f38", amount: 14.8 },
  { name: "ҮЦК 9", fill: "#4a3f38", amount: 4.4 },
];

const chartConfig = {
  amount: {
    label: "Tэрбум төгрөг: ",
  },
  tg: {
    label: "TG",
  },
  ["ҮЦК 1"]: {
    label: "Ү1",
  },
  ["ҮЦК 2"]: {
    label: "Ү2",
  },
  ["ҮЦК 3"]: {
    label: "Ү3",
  },
  ["ҮЦК 4"]: {
    label: "Ү4",
  },
  ["ҮЦК 5"]: {
    label: "Ү5",
  },
  ["ҮЦК 6"]: {
    label: "Ү6",
  },
  ["ҮЦК 7"]: {
    label: "Ү7",
  },
  ["ҮЦК 8"]: {
    label: "Ү8",
  },
  ["ҮЦК 9"]: {
    label: "Ү9",
  },
} satisfies ChartConfig;

export function ChartBarLabelCustom() {
  return (
    <ChartContainer config={chartConfig} className="w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            chartConfig[value as keyof typeof chartConfig]?.label
          }
        />
        {/* <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        /> */}
        <Bar
          dataKey="amount"
          strokeWidth={2}
          radius={4}
          barSize={16}
          activeIndex={1}
          activeBar={({ ...props }) => {
            return (
              <Rectangle
                {...props}
                fillOpacity={1}
                stroke={props.payload.fill}
                strokeDasharray={4}
                strokeDashoffset={4}
              />
            );
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
