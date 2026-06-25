"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../lib/auth-context";
import {
  getAnnualProgress,
  loadLocalAnnualProgress,
  computeStats,
  REQUIRED_TASKS,
  TASK_DURATIONS,
  type DayRecord,
  type AnnualStats,
} from "../lib/sync/annualProgress";

/* ─── Constants ───────────────────────────────────────────────── */

const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"];
const DAY_LABELS = ["L","","M","","V","","D"]; // alternating to avoid clutter

const MODULE_LABELS: Record<string, { label: string; icon: string }> = {
  vocab:     { label: "Vocabulaire", icon: "📖" },
  listening: { label: "Listening",   icon: "🎧" },
  speaking:  { label: "Speaking",    icon: "🎙️" },
  writing:   { label: "Writing",     icon: "✍️" },
};

/* ─── Calendar grid builder ───────────────────────────────────── */

type MonthStart = { month: number; weekIdx: number };

function buildGrid(year: number): {
  weeks: (string | null)[][];
  monthStarts: MonthStart[];
} {
  const jan1 = new Date(year, 0, 1);
  const startDow = (jan1.getDay() + 6) % 7; // Mon=0, Sun=6

  const allDays: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) allDays.push(null);

  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    allDays.push(`${d.getFullYear()}-${mm}-${dd}`);
    d.setDate(d.getDate() + 1);
  }
  while (allDays.length % 7 !== 0) allDays.push(null);

  // Split into week columns
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  // Find the first week index where each month appears.
  // Parse month directly from the string to avoid timezone issues with new Date().
  const monthStarts: MonthStart[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    for (const day of week) {
      if (!day) continue;
      const m = parseInt(day.slice(5, 7), 10) - 1; // 0-based, no timezone ambiguity
      if (m !== lastMonth) {
        monthStarts.push({ month: m, weekIdx: wi });
        lastMonth = m;
      }
      break;
    }
  });

  return { weeks, monthStarts };
}

/* ─── Cell color ──────────────────────────────────────────────── */

function cellColor(date: string | null, dayMap: Map<string, DayRecord>, today: string): string {
  if (!date) return "bg-transparent pointer-events-none";
  if (date > today) return "bg-gray-100";
  const r = dayMap.get(date);
  const n = r ? REQUIRED_TASKS.filter(t => r.taskIds.includes(t)).length : 0;
  if (n === 0) return "bg-red-200";
  if (n < 4)   return "bg-orange-400";
  return "bg-green-500";
}

/* ─── Format duration ─────────────────────────────────────────── */

function fmtMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h${rem.toString().padStart(2, "0")}` : `${h}h`;
}

function fmtDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
}

/* ─── Stat chip ───────────────────────────────────────────────── */

function StatChip({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 bg-white border border-gray-200 rounded-2xl px-4 py-3 flex-1 min-w-[80px]">
      <span className="text-lg leading-none">{icon}</span>
      <span className="text-base font-bold text-[#0B1E4B] leading-tight">{value}</span>
      <span className="text-[10px] text-gray-400 text-center leading-tight">{label}</span>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export default function AnnualProgressCalendar() {
  const { user, loading: authLoading } = useAuth();

  const [records,   setRecords]   = useState<DayRecord[]>([]);
  const [stats,     setStats]     = useState<AnnualStats | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  const year  = new Date().getFullYear();
  const _now  = new Date();
  const today = `${_now.getFullYear()}-${String(_now.getMonth()+1).padStart(2,"0")}-${String(_now.getDate()).padStart(2,"0")}`;
  const { weeks, monthStarts } = buildGrid(year);
  const CELL = 12; // px
  const GAP  = 2;  // px
  const STEP = CELL + GAP;

  /* ── Load data ── */
  const load = useCallback(async () => {
    setLoading(true);
    let rows: DayRecord[];
    if (user) {
      rows = await getAnnualProgress(user.id);
    } else {
      rows = loadLocalAnnualProgress();
    }
    setRecords(rows);
    setStats(computeStats(rows));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  /* ── Scroll selected day into view ── */
  useEffect(() => {
    if (selectedDay && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedDay]);

  const dayMap = new Map(records.map(r => [r.date, r]));

  /* ─── Loading skeleton ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => <div key={i} className="flex-1 h-20 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-36 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  /* ─── Selected day data ────────────────────────────────────── */
  const selRecord = selectedDay ? (dayMap.get(selectedDay) ?? { date: selectedDay, taskIds: [] }) : null;
  const selMinutes = selRecord
    ? selRecord.taskIds.reduce((s, id) => s + (TASK_DURATIONS[id] ?? 5), 0)
    : 0;

  return (
    <div className="space-y-4">

      {/* ── Stat chips ── */}
      {stats && (
        <div className="flex flex-wrap gap-2">
          <StatChip icon="🔥" value={stats.currentStreak} label="Série actuelle" />
          <StatChip icon="🏆" value={stats.longestStreak} label="Meilleure série" />
          <StatChip icon="📅" value={stats.daysStudied}   label="Jours étudiés" />
          <StatChip icon="⭐" value={`${stats.daysStudied > 0 ? Math.round((stats.completeDays / stats.daysStudied) * 100) : 0} %`} label="Jours complets" />
          <StatChip icon="⏱" value={fmtMinutes(stats.totalMinutes)} label="Temps total" />
        </div>
      )}

      {/* ── Selected day detail ── */}
      {selRecord && (
        <div ref={selectedRef} className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-[#0B1E4B] text-sm capitalize">{fmtDate(selRecord.date)}</p>
              {selMinutes > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">{fmtMinutes(selMinutes)} de pratique</p>
              )}
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm transition-colors"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {REQUIRED_TASKS.map(taskId => {
              const done = selRecord.taskIds.includes(taskId);
              const info = MODULE_LABELS[taskId];
              return (
                <div
                  key={taskId}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                    done
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : selRecord.date <= today
                      ? "bg-red-50 text-red-500 border border-red-100"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  <span>{info?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{info?.label}</p>
                    <p className="font-normal opacity-70">{done ? `${TASK_DURATIONS[taskId]} min · ✓` : "Non fait"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Calendar ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">

        {/* Legend */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {year} — Calendrier annuel
          </p>
          <div className="flex items-center gap-2.5 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-200 inline-block" />Aucun</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block" />Partiel</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" />Complet</span>
          </div>
        </div>

        {/* Scrollable grid */}
        <div className="overflow-x-auto -mx-1 px-1">
          <div style={{ minWidth: `${weeks.length * STEP + 28}px` }}>

            {/* Month labels */}
            <div className="relative h-4 mb-1" style={{ marginLeft: "28px" }}>
              {monthStarts.map(({ month, weekIdx }) => (
                <span
                  key={month}
                  className="absolute text-[10px] text-gray-400 font-medium"
                  style={{ left: `${weekIdx * STEP}px` }}
                >
                  {MONTHS_FR[month]}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap: `${GAP}px` }}>

              {/* Day-of-week labels */}
              <div className="flex flex-col flex-shrink-0" style={{ gap: `${GAP}px`, width: "24px" }}>
                {DAY_LABELS.map((lbl, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-end pr-1 text-[9px] text-gray-400 leading-none"
                    style={{ height: `${CELL}px` }}
                  >
                    {lbl}
                  </div>
                ))}
              </div>

              {/* Week columns */}
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map((date, di) => {
                    const color  = cellColor(date, dayMap, today);
                    const isToday = date === today;
                    const isSel   = date === selectedDay;
                    return (
                      <div
                        key={di}
                        title={date ?? undefined}
                        onClick={() => { if (date && date <= today) setSelectedDay(isSel ? null : date); }}
                        className={[
                          "rounded-sm transition-all",
                          date && date <= today ? "cursor-pointer hover:opacity-80" : "",
                          color,
                          isToday  ? "ring-2 ring-[#0B1E4B] ring-offset-1" : "",
                          isSel    ? "ring-2 ring-[#009DA1] ring-offset-1" : "",
                        ].join(" ")}
                        style={{ width: `${CELL}px`, height: `${CELL}px` }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tap hint */}
        <p className="text-[10px] text-gray-300 mt-3 text-right">
          Appuyez sur un jour pour voir le détail
        </p>
      </div>
    </div>
  );
}
