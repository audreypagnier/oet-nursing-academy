import { supabase } from "../supabase";

/**
 * Fetch daily progress rows for a set of dates in one round-trip.
 * Returns a map of { "YYYY-MM-DD": string[] }.
 * Returns {} when Supabase is not configured or the user is not logged in.
 */
export async function fetchRemoteDailyProgress(
  userId: string,
  dates: string[],
): Promise<Record<string, string[]>> {
  if (!supabase || dates.length === 0) return {};

  const { data, error } = await supabase
    .from("daily_progress")
    .select("date, task_ids")
    .eq("user_id", userId)
    .in("date", dates);

  if (error || !data) return {};

  return Object.fromEntries(
    (data as { date: string; task_ids: string[] }[]).map(row => [row.date, row.task_ids]),
  );
}

/**
 * Upsert today's completed task IDs for the given user.
 * Silently swallows errors — localStorage is the source of truth if this fails.
 */
export async function pushDailyProgress(
  userId: string,
  date: string,
  taskIds: string[],
): Promise<void> {
  if (!supabase) return;

  await supabase.from("daily_progress").upsert(
    { user_id: userId, date, task_ids: taskIds, updated_at: new Date().toISOString() },
    { onConflict: "user_id,date" },
  );
}
