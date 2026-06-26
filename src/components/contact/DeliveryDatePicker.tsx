"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS   = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export interface DeliveryWindows {
  standard:  [number, number]; // [minDays, maxDays] from today
  expedited: [number, number];
  label: {
    standard:  string; // human-readable e.g. "10–14 days"
    expedited: string; // e.g. "5–7 days"
    expeditedCost: string; // e.g. "$75"
  };
}

interface Props {
  value:   string; // "YYYY-MM-DD" or ""
  onChange: (date: string) => void;
  windows: DeliveryWindows | null;
}

function addDays(base: Date, n: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function toISO(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function DeliveryDatePicker({ value, onChange, windows }: Props) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const standardStart  = windows ? addDays(today, windows.standard[0])  : null;
  const standardEnd    = windows ? addDays(today, windows.standard[1])   : null;
  const expeditedStart = windows ? addDays(today, windows.expedited[0])  : null;
  const expeditedEnd   = windows ? addDays(today, windows.expedited[1])  : null;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function classForDay(day: number): string {
    const date = new Date(viewYear, viewMonth, day);
    const iso  = toISO(date);
    const isPast      = date < today;
    const isSelected  = iso === value;
    const isToday     = iso === toISO(today);
    const inStandard  = standardStart  && standardEnd  && date >= standardStart  && date <= standardEnd;
    const inExpedited = expeditedStart && expeditedEnd && date >= expeditedStart && date <= expeditedEnd;

    const base = "flex items-center justify-center w-8 h-8 rounded-sm text-xs font-body font-medium transition-colors duration-100 select-none ";

    if (isPast)       return base + "text-white/15 cursor-default";
    if (isSelected)   return base + "bg-gold text-background font-bold cursor-pointer";
    if (inStandard)   return base + "bg-gold/25 text-gold hover:bg-gold/50 cursor-pointer";
    if (inExpedited)  return base + "bg-teal/25 text-teal hover:bg-teal/50 cursor-pointer";
    if (isToday)      return base + "border border-white/20 text-text-base hover:bg-white/5 cursor-pointer";
    return base + "text-text-muted hover:bg-white/5 cursor-pointer";
  }

  const todayISO = toISO(today);

  return (
    <div className="bg-surface border border-white/10 rounded-sm p-4 select-none">

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth}
          className="p-1 rounded-sm text-text-muted hover:text-text-base hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-body font-semibold text-text-base text-sm">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth}
          className="p-1 rounded-sm text-text-muted hover:text-text-base hover:bg-white/5 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="flex items-center justify-center w-8 h-6 text-[10px] font-body font-semibold text-text-subtle uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center">
            {day !== null ? (
              <button
                type="button"
                disabled={new Date(viewYear, viewMonth, day) < today}
                onClick={() => {
                  const iso = toISO(new Date(viewYear, viewMonth, day));
                  if (iso === value) onChange(""); // deselect
                  else onChange(iso);
                }}
                className={classForDay(day)}
              >
                {day}
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2">
        {windows ? (
          <>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-sm bg-gold/25 border border-gold/50 shrink-0 mt-0.5" />
              <p className="text-[10px] font-body text-text-subtle leading-relaxed">
                <span className="text-gold font-semibold">Standard delivery</span> — {windows.label.standard} from order date
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-sm bg-teal/25 border border-teal/50 shrink-0 mt-0.5" />
              <p className="text-[10px] font-body text-text-subtle leading-relaxed">
                <span className="text-teal font-semibold">Expedited delivery</span> — {windows.label.expedited} from order date · add-on {windows.label.expeditedCost} at checkout
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-sm bg-gold/25 border border-gold/50 shrink-0 mt-0.5" />
              <p className="text-[10px] font-body text-text-subtle">Standard delivery window (select a package to see dates)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-sm bg-teal/25 border border-teal/50 shrink-0 mt-0.5" />
              <p className="text-[10px] font-body text-text-subtle">Expedited delivery window (add-on at checkout)</p>
            </div>
          </>
        )}
        {value && value >= todayISO && (
          <p className="text-[10px] font-body text-gold/80 mt-0.5">
            Requested: {new Date(value + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}
