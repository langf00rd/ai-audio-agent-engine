"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DAYS, MONTHS } from "@/lib/constants";
import {
  AgentAnalyticsChartDuration,
  AgentAnalyticsMetadata,
  Analytics,
} from "@/lib/types";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  usage: {
    label: "Calls",
    color: "var(--primary)",
  },
};

export function AgentAnalyticsChart(props: {
  groupBy: AgentAnalyticsChartDuration;
  data: Analytics<AgentAnalyticsMetadata>[];
}) {
  const chartData = groupUsageData(props.data, props.groupBy);
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

function groupUsageData(
  data: Analytics<AgentAnalyticsMetadata>[],
  groupBy: AgentAnalyticsChartDuration,
) {
  if (!data) return [];
  const buckets =
    groupBy === "day"
      ? Object.fromEntries(DAYS.map((d) => [d, 0]))
      : Object.fromEntries(MONTHS.map((m) => [m, 0]));
  for (const event of data) {
    const date = new Date(event.created_at);
    const key =
      groupBy === "day"
        ? DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]
        : format(date, "MMM");
    if (buckets[key] !== undefined) {
      buckets[key]++;
    }
  }
  const orderedLabels = groupBy === "day" ? DAYS : MONTHS;
  return orderedLabels.map((label) => ({
    label,
    usage: buckets[label],
  }));
}
