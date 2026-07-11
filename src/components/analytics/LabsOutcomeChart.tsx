"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { ResultCode } from "@/types/studio";
import { RESULT_CODE_LABELS } from "@/types/studio";

export interface LabsOutcomeSlice {
  code: ResultCode;
  count: number;
}

interface Props {
  data: LabsOutcomeSlice[];
}

const OUTCOME_COLORS: Record<ResultCode, string> = {
  PASS:    "#34d399",
  FAIL:    "#e05a5a",
  PARTIAL: "#f59e0b",
  ANOMALY: "#a78bfa",
};

export default function LabsOutcomeChart({ data }: Props) {
  if (!data.length) {
    return (
      <p className="text-text-subtle font-body text-sm text-center py-8">
        No concluded experiments yet.
      </p>
    );
  }

  const display = data.map((d) => ({
    name: RESULT_CODE_LABELS[d.code],
    value: d.count,
    color: OUTCOME_COLORS[d.code],
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
