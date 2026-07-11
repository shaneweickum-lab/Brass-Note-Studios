"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface PipelineSlice {
  stage: string;
  count: number;
}

interface Props {
  data: PipelineSlice[];
}

const STAGE_COLORS: Record<string, string> = {
  intake:     "#6B8EC4",
  production: "#C9921A",
  revision:   "#f59e0b",
  delivered:  "#34d399",
};

const STAGE_LABELS: Record<string, string> = {
  intake:     "Intake",
  production: "Production",
  revision:   "Revision",
  delivered:  "Delivered",
};

export default function PipelineDonutChart({ data }: Props) {
  if (!data.length) {
    return (
      <p className="text-text-subtle font-body text-sm text-center py-8">
        No commission data yet.
      </p>
    );
  }

  const display = data.map((d) => ({
    name: STAGE_LABELS[d.stage] ?? d.stage,
    value: d.count,
    color: STAGE_COLORS[d.stage] ?? "#8B7D6B",
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={display}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {display.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#1A1114", border: "1px solid #C9921A40", borderRadius: 4 }}
          itemStyle={{ fontSize: 11 }}
          labelStyle={{ color: "#F5F0E8", fontSize: 11 }}
        />
        <Legend
          iconSize={8}
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: "#8B7D6B" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
