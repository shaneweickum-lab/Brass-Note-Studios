"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface RevenuePoint {
  month: string;
  revenue: number;
}

interface Props {
  data: RevenuePoint[];
}

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
};

function formatMonth(ym: string) {
  const [, m] = ym.split("-");
  return MONTH_LABELS[m] ?? ym;
}

export default function RevenueAreaChart({ data }: Props) {
  if (!data.length) {
    return (
      <p className="text-text-subtle font-body text-sm text-center py-8">
        No revenue data yet — add payment amounts to commissions to see this chart.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C9921A" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#C9921A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ffffff10" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#8B7D6B", fontSize: 10 }}
          tickFormatter={formatMonth}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#8B7D6B", fontSize: 10 }}
          width={42}
          tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: "#1A1114", border: "1px solid #C9921A40", borderRadius: 4 }}
          labelStyle={{ color: "#F5F0E8", fontSize: 11 }}
          itemStyle={{ color: "#C9921A", fontSize: 11 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          labelFormatter={(label: any) => formatMonth(String(label ?? ""))}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: any) => [`$${typeof v === "number" ? v.toFixed(2) : v}`, "Revenue"]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#C9921A"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={{ fill: "#C9921A", r: 3 }}
          activeDot={{ r: 5 }}
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
