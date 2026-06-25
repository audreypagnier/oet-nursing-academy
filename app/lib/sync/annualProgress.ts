import { supabase } from "../supabase";

/* ─── Types ───────────────────────────────────────────────────── */

export type DayRecord = {
  date: string;     // "YYYY-MM-DD"
  taskIds: string[]; // e.g. ["vocab","listening","speaking","writing"]
};

export type AnnualStats = {
  currentStreak:  number;
  longestStreak:  number;
  daysStudied:    number; // days with ≥1 task
  completeDays:   number; // days with all 4 required tasks
  totalMinutes:   number;
};

export type AnnualProgressData = {
  records: DayRecord[];
  stats:   AnnualStats;
};

/* ─── Constants ───────────────────────────────────────────────── */

export const TASK_DURATIONS: Record<string, number> = {
  vocab: 5, listening: 5, speaking: 5, writing: 10,
};

export const REQUIRED_TASKS = ["vocab", "listening", "speaking", "writing"] as const;

/* ─── Stats computation ───────────────────────────────────────── */

export function computeStats(records: DayRecord[]): AnnualStats {
  const today = new Date().toISOString().slice(0, 10);
  const map = new Map(records.map(r => [r.date, r]));

  let totalMinutes = 0;
  let daysStudied  = 0;
  let completeDays = 0;

  for (const r of records) {
    const minutes = r.taskIds.reduce((s, id) => s + (TASK_DURATIONS[id] ?? 5), 0);
    totalMinutes += minutes;
    if (r.taskIds.length > 0) daysStudied++;
    const requiredDone = REQUIRED_TASKS.filter(t => r.taskIds.includes(t)).length;
    if (requiredDone === REQUIRED_TASKS.length) completeDays++;
  }

  // Build sorted list of all dates with ≥1 task
  const studied = records
    .filter(r => r.taskIds.length > 0)
    .map(r => r.date)
    .sort();

  // Current streak — consecutive days ending today or yesterday
  let currentStreak = 0;
  {
    const d = new Date(today);
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (!map.get(key)?.taskIds.length) {
        // Allow today with no study yet (streak still lives)
        if (key === today) { d.setDate(d.getDate() - 1); continue; }
        break;
      }
      currentStreak++;
      d.setDate(d.getDate() - 1);
    }
  }

  // Longest streak
  let longestStreak = 0;
  let run = 0;
  for (let i = 0; i < studied.length; i++) {
    if (i === 0) { run = 1; continue; }
    const prev = new Date(studied[i - 1]);
    const curr = new Date(studied[i]);
    prev.setDate(prev.getDate() + 1);
    if (prev.toISOString().slice(0, 10) === studied[i]) {
      run++;
    } else {
      longestStreak = Math.max(longestStreak, run);
      run = 1;
    }
  }
  longestStreak = Math.max(longestStreak, run, currentStreak);

  return { currentStreak, longestStreak, daysStudied, completeDays, totalMinutes };
}

/* ─── Supabase fetch ──────────────────────────────────────────── */

export async function getAnnualProgress(userId: string): Promise<DayRecord[]> {
  if (!supabase) return [];

  const year = new Date().getFullYear();
  const { data, error } = await supabase
    .from("daily_progress")
    .select("date, task_ids")
    .eq("user_id", userId)
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`);

  if (error) {
    console.error("[OET Annual] fetch error:", error.message);
    return [];
  }

  return (data as { date: string; task_ids: string[] }[]).map(r => ({
    date: r.date,
    taskIds: r.task_ids,
  }));
}

/* ─── localStorage fallback (unauthenticated users) ──────────── */

export function loadLocalAnnualProgress(): DayRecord[] {
  if (typeof window === "undefined") return [];

  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);
  const records: DayRecord[] = [];

  const d = new Date(year, 0, 1);
  while (d.getFullYear() === year) {
    const date = d.toISOString().slice(0, 10);
    if (date > today) break;
    try {
      const raw = localStorage.getItem(`oet_daily_practice_${date}`);
      if (raw) {
        const ids = JSON.parse(raw) as string[];
        if (ids.length > 0) records.push({ date, taskIds: ids });
      }
    } catch {}
    d.setDate(d.getDate() + 1);
  }

  return records;
}
