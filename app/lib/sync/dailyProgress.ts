import { supabase } from "../supabase";

const LOG = (...args: unknown[]) => console.log("[OET Daily Sync]", ...args);
const ERR = (...args: unknown[]) => console.error("[OET Daily Sync]", ...args);

/**
 * Fetch daily progress rows for a set of dates in one round-trip.
 * Returns a map of { "YYYY-MM-DD": string[] }.
 */
export async function fetchRemoteDailyProgress(
  userId: string,
  dates: string[],
): Promise<Record<string, string[]>> {
  if (!supabase)  { LOG("fetch skipped — Supabase not configured"); return {}; }
  if (dates.length === 0) { LOG("fetch skipped — no dates provided"); return {}; }

  LOG("fetch start — userId:", userId, "| dates:", dates);

  const { data, error } = await supabase
    .from("daily_progress")
    .select("date, task_ids")
    .eq("user_id", userId)
    .in("date", dates);

  if (error) {
    ERR("fetch error:", error.message, "| code:", error.code, "| details:", error.details);
    return {};
  }

  const result = Object.fromEntries(
    (data as { date: string; task_ids: string[] }[]).map(row => [row.date, row.task_ids]),
  );

  LOG("fetch result:", result);
  return result;
}

/**
 * Upsert today's completed task IDs for the given user.
 * Logs errors so the caller can diagnose RLS or network issues.
 */
export async function pushDailyProgress(
  userId: string,
  date: string,
  taskIds: string[],
): Promise<void> {
  if (!supabase) { LOG("push skipped — Supabase not configured"); return; }

  const payload = { user_id: userId, date, task_ids: taskIds, updated_at: new Date().toISOString() };
  LOG("push start — payload:", payload);

  const { data, error } = await supabase
    .from("daily_progress")
    .upsert(payload, { onConflict: "user_id,date" })
    .select();

  if (error) {
    ERR("push error:", error.message, "| code:", error.code, "| details:", error.details, "| hint:", error.hint);
  } else {
    LOG("push success — returned rows:", data);
  }
}
