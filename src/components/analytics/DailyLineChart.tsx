"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DailyStat } from "@/lib/analytics/types";

interface Props {
  data: DailyStat[];
}

export default function DailyLineChart({ data }: Props) {
  if (!data.length) {
    return <p className="text-text-subtle font-body text-sm text-center py-8">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#ffffff10" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#8B7D6B", fontSize: 10 }}
          tickFormatter={(v: string) => v.slice(5)}
        />
        <YAxis tick={{ fill: "#8B7D6B", fontSize: 10 }} width={28} />
        <Tooltip
          contentStyle={{ background: "#1A1114", border: "1px solid #C9921A40", borderRadius: 4 }}
          labelStyle={{ color: "#F5F0E8", fontSize: 11 }}
          itemStyle={{ color: "#C9921A", fontSize: 11 }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: "#8B7D6B" }} />
        <Line type="monotone" dataKey="messages" stroke="#C9921A" dot={false} strokeWidth={2} name="Messages" />
        <Line type="monotone" dataKey="sessions" stroke="#4A9B8E" dot={false} strokeWidth={2} name="Sessions" />
        <Line type="monotone" dataKey="fallbacks" stroke="#e05a5a" dot={false} strokeWidth={1.5} strokeDasharray="4 2" name="Fallbacks" />
      </LineChart>
    </ResponsiveContainer>
  );
}
