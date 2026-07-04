"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PageStat } from "@/lib/analytics/types";

interface Props {
  data: PageStat[];
}

export default function PageBarChart({ data }: Props) {
  if (!data.length) {
    return <p className="text-text-subtle font-body text-sm text-center py-8">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#ffffff10" />
        <XAxis dataKey="page" tick={{ fill: "#8B7D6B", fontSize: 10 }} />
        <YAxis tick={{ fill: "#8B7D6B", fontSize: 10 }} width={28} />
        <Tooltip
          contentStyle={{ background: "#1A1114", border: "1px solid #C9921A40", borderRadius: 4 }}
          labelStyle={{ color: "#F5F0E8", fontSize: 11 }}
          itemStyle={{ color: "#C9921A", fontSize: 11 }}
        />
        <Bar dataKey="messages" fill="#C9921A" radius={[3, 3, 0, 0]} name="Messages" />
        <Bar dataKey="sessions" fill="#4A9B8E" radius={[3, 3, 0, 0]} name="Sessions" />
      </BarChart>
    </ResponsiveContainer>
  );
}
