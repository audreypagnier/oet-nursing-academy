"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import { fetchRemoteDailyProgress, pushDailyProgress } from "../lib/sync/dailyProgress";
import { getDailyCompletion, type DailyCompletion } from "../lib/getDailyCompletion";
import { SPEAKING, LISTENING, WRITING, getDayOfYear, pick } from "../lib/dailyModules";

/* ─── Types ───────────────────────────────────────────────────── */

type DailyTask = {
  id: string;
  icon: string;
  label: string;
  description: string;
  tip: string;
  href: string;
  linkLabel: string;
  duration: number;
  required: boolean;
};

type AppState = {
  speakingPracticed:  Set<string>;
  listeningCompleted: Set<string>;
  writingCompleted:   Set<string>;
  vocabReviewCount:   number;
  vocabKnownCount:    number;
  level:              string | null;
  vocabStreak:        number;
};

type View = "plan" | "session" | "done";
type DayCompletion = "complete" | "partial" | "none" | "future";

/* ─── Helpers ─────────────────────────────────────────────────── */

const TODAY_DATE = new Date().toISOString().slice(0, 10);
const STORAGE_KEY = (date: string) => `oet_daily_practice_${date}`;

function formatDate(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function getLast7Days(): { date: string; label: string; isToday: boolean; isFuture: boolean }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().slice(0, 10);
    return {
      date,
      label: d.toLocaleDateString("fr-FR", { weekday: "short" })[0].toUpperCase(),
      isToday: i === 6,
      isFuture: false,
    };
  });
}

/* ─── Plan generator ──────────────────────────────────────────── */

function generatePlan(state: AppState): DailyTask[] {
  const nextSpeaking  = SPEAKING.find(s => !state.speakingPracticed.has(s.id))  ?? pick(SPEAKING);
  const nextListening = LISTENING.find(s => !state.listeningCompleted.has(s.id)) ?? pick(LISTENING);
  const nextWriting   = WRITING.find(w => !state.writingCompleted.has(w.id))    ?? pick(WRITING);

  const hasReview = state.vocabReviewCount > 0;
  const vocabDesc = hasReview
    ? `Révisez ${Math.min(state.vocabReviewCount, 5)} cartes marquées "À revoir"`
    : state.vocabKnownCount < 30
    ? `Apprenez ${Math.min(5, 30 - state.vocabKnownCount)} nouveaux mots médicaux`
    : "Révisez 5 mots pour consolider votre mémoire";

  return [
    {
      id: "vocab",
      icon: "📖",
      label: "Vocabulaire",
      description: vocabDesc,
      tip: "Prononcez chaque mot à voix haute et utilisez-le dans une phrase clinique.",
      href: "/vocabulary",
      linkLabel: "Ouvrir le vocabulaire →",
      duration: 5,
      required: true,
    },
    {
      id: "listening",
      icon: "🎧",
      label: "Listening",
      description: `Scénario du jour : "${nextListening.title}" — écoutez et répondez aux questions.`,
      tip: "Prenez des notes pendant l'écoute. Concentrez-vous sur les chiffres, noms et actions clés.",
      href: "/listening",
      linkLabel: "Ouvrir Listening →",
      duration: 5,
      required: true,
    },
    {
      id: "speaking",
      icon: "🎙️",
      label: "Speaking",
      description: `Scénario du jour : "${nextSpeaking.title}" — parlez à voix haute et enregistrez-vous.`,
      tip: "Lisez la situation, parlez sans regarder les réponses, puis comparez avec les modèles.",
      href: "/speaking",
      linkLabel: "Ouvrir Speaking →",
      duration: 5,
      required: true,
    },
    {
      id: "writing",
      icon: "✍️",
      label: "Writing",
      description: `Lettre du jour : "${nextWriting.title}" — rédigez en 180–200 mots.`,
      tip: "Structure : ouverture → antécédents → traitement → recommandation. Soignez le registre formel.",
      href: "/writing",
      linkLabel: "Ouvrir Writing →",
      duration: 10,
      required: true,
    },
    {
      id: "reading",
      icon: "📄",
      label: "Reading",
      description: "Lisez un dossier patient complet et répondez aux questions de compréhension.",
      tip: "Skimmez d'abord (30 sec), lisez les questions, puis relisez pour les réponses ciblées.",
      href: "/reading",
      linkLabel: "Ouvrir Reading →",
      duration: 10,
      required: false,
    },
  ];
}

/* ─── Status dot ──────────────────────────────────────────────── */

function StatusDot({ percent, label }: { percent: number; label: string }) {
  const color =
    percent >= 100 ? "bg-green-500"
    : percent > 0  ? "bg-orange-400"
    : "bg-red-400";
  const textColor =
    percent >= 100 ? "text-green-700"
    : percent > 0  ? "text-orange-600"
    : "text-red-500";
  return (
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className={`text-[10px] font-medium leading-tight text-right ${textColor}`} style={{ maxWidth: "90px" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Week calendar ───────────────────────────────────────────── */

function WeekCalendar({
  days,
  dayStates,
  doneCount,
}: {
  days: { label: string; isToday: boolean }[];
  dayStates: DayCompletion[];
  doneCount: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cette semaine</p>
        <p className="text-xs text-gray-500 font-medium">{doneCount} / 7 jours réalisés</p>
      </div>
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {days.map((d, i) => {
          const state = dayStates[i] ?? "future";
          const dotColor =
            state === "complete" ? "bg-green-500 text-white"
            : state === "partial" ? "bg-orange-400 text-white"
            : state === "none"    ? "bg-red-400 text-white"
            : "bg-gray-100 text-gray-300";
          const ring = d.isToday ? "ring-2 ring-[#0B1E4B] ring-offset-1" : "";
          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[10px] font-medium text-gray-400 uppercase">{d.label}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${dotColor} ${ring}`}>
                {state === "complete" ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : state === "partial" ? (
                  <span className="text-[10px] font-bold">~</span>
                ) : state === "none" ? (
                  <span className="text-[10px] font-bold">○</span>
                ) : (
                  <span className="text-[10px]">·</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Badges ──────────────────────────────────────────────────── */

function Badges({
  streak,
  allDoneToday,
  perfectWeek,
}: {
  streak: number;
  allDoneToday: boolean;
  perfectWeek: boolean;
}) {
  const badges = [
    streak >= 7 && { icon: "📈", label: `${streak} jours d'affilée` },
    streak > 0 && { icon: "🔥", label: `Série de ${streak} jour${streak > 1 ? "s" : ""}` },
    allDoneToday && { icon: "⭐", label: "100 % aujourd'hui" },
    perfectWeek && { icon: "🏆", label: "Semaine parfaite" },
  ].filter(Boolean) as { icon: string; label: string }[];

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {badges.map((b, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full"
        >
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  );
}

/* ─── Task card (plan view) ───────────────────────────────────── */

function PlanTaskCard({
  task,
  index,
  moduleStatus,
}: {
  task: DailyTask;
  index: number;
  moduleStatus?: { percent: number; statusLabel: string } | null;
}) {
  const percent = moduleStatus?.percent ?? 0;
  const done = percent >= 100;

  return (
    <div className={`rounded-2xl border transition-all ${
      done
        ? "bg-[#00C2C7]/5 border-[#00C2C7]/25"
        : task.required
        ? "bg-white border-gray-200"
        : "bg-gray-50 border-gray-200 border-dashed"
    }`}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Step indicator */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            done ? "bg-[#00C2C7] text-white" : "bg-gray-100 text-gray-400"
          }`}>
            {done ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-xs font-bold">{task.required ? index + 1 : "+"}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-semibold ${done ? "text-gray-400" : "text-[#0B1E4B]"}`}>
                {task.icon} {task.label}
              </span>
              <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {task.duration} min
              </span>
              {!task.required && (
                <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  optionnel
                </span>
              )}
            </div>
            <p className={`text-sm leading-relaxed ${done ? "text-gray-400 line-through" : "text-gray-600"}`}>
              {task.description}
            </p>
            {!done && (
              <Link
                href={task.href}
                className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#009DA1] hover:text-[#007A7E] transition-colors"
              >
                {task.linkLabel}
              </Link>
            )}
          </div>

          {/* Status indicator — only for required modules */}
          {task.required && moduleStatus !== undefined && moduleStatus !== null && (
            <StatusDot percent={moduleStatus.percent} label={moduleStatus.statusLabel} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export default function DailyPracticeClient() {
  const { user, loading: authLoading } = useAuth();
  const userIdRef = useRef<string | null>(null);
  useEffect(() => { userIdRef.current = user?.id ?? null; }, [user?.id]);

  const [hydrated,      setHydrated]      = useState(false);
  const [view,          setView]          = useState<View>("plan");
  const [weekDays,      setWeekDays]      = useState(getLast7Days());
  const [dayStates,     setDayStates]     = useState<DayCompletion[]>(Array(7).fill("future"));
  const [appState,      setAppState]      = useState<AppState>({
    speakingPracticed: new Set(), listeningCompleted: new Set(),
    writingCompleted: new Set(), vocabReviewCount: 0,
    vocabKnownCount: 0, level: null, vocabStreak: 0,
  });
  const [dailyCompletion, setDailyCompletion] = useState<DailyCompletion>({
    vocabulary: { completed: false, percent: 0, statusLabel: "Aucune carte révisée" },
    listening:  { completed: false, percent: 0, statusLabel: "Aucune question répondue" },
    speaking:   { completed: false, percent: 0, statusLabel: "Aucun enregistrement" },
    writing:    { completed: false, percent: 0, statusLabel: "Aucune lettre rédigée" },
    overallPercent: 0, overallState: "none", completedTaskIds: [],
  });

  // Last synced task IDs — avoid pushing to Supabase when nothing changed
  const lastSyncedRef = useRef<string>("");

  /* ── Read & refresh all localStorage state ── */
  const refresh = useCallback(() => {
    const s: AppState = {
      speakingPracticed: new Set(), listeningCompleted: new Set(),
      writingCompleted: new Set(), vocabReviewCount: 0,
      vocabKnownCount: 0, level: null, vocabStreak: 0,
    };
    try {
      const r = localStorage.getItem("oet_speaking_practiced");
      if (r) s.speakingPracticed = new Set(JSON.parse(r) as string[]);
    } catch {}
    try {
      const r = localStorage.getItem("oet_listening_completed");
      if (r) s.listeningCompleted = new Set((JSON.parse(r) as { completed: string[] }).completed ?? []);
    } catch {}
    try {
      const r = localStorage.getItem("oet_writing_completed");
      if (r) s.writingCompleted = new Set(JSON.parse(r) as string[]);
    } catch {}
    try {
      const r = localStorage.getItem("oet_vocab_review");
      if (r) s.vocabReviewCount = (JSON.parse(r) as string[]).length;
    } catch {}
    try {
      const r = localStorage.getItem("oet_vocab_known");
      if (r) s.vocabKnownCount = (JSON.parse(r) as string[]).length;
    } catch {}
    try {
      const r = localStorage.getItem("oet_assessment_result");
      if (r) s.level = (JSON.parse(r) as { level: string }).level;
    } catch {}
    try {
      const r = localStorage.getItem("oet_vocab_streak");
      if (r) s.vocabStreak = (JSON.parse(r) as { count?: number }).count ?? 0;
    } catch {}
    setAppState(s);

    const dc = getDailyCompletion();
    setDailyCompletion(dc);

    // Write auto-detected completions back to daily storage key (localStorage fallback)
    try {
      localStorage.setItem(STORAGE_KEY(TODAY_DATE), JSON.stringify(dc.completedTaskIds));
    } catch {}

    // Push to Supabase if completions changed
    const key = dc.completedTaskIds.slice().sort().join(",");
    if (key !== lastSyncedRef.current && userIdRef.current) {
      lastSyncedRef.current = key;
      pushDailyProgress(userIdRef.current, TODAY_DATE, dc.completedTaskIds).catch(err => {
        console.error("[OET Daily] auto-push error:", err);
      });
    }

    // Build week day states from localStorage for past days
    const days = getLast7Days();
    setWeekDays(days);
    const states: DayCompletion[] = days.map((d) => {
      if (d.isToday) {
        return dc.completedTaskIds.length >= 4 ? "complete"
          : dc.completedTaskIds.length > 0  ? "partial"
          : "none";
      }
      try {
        const r = localStorage.getItem(STORAGE_KEY(d.date));
        if (!r) return "none";
        const ids = JSON.parse(r) as string[];
        return ids.length >= 4 ? "complete" : ids.length > 0 ? "partial" : "none";
      } catch { return "none"; }
    });
    setDayStates(states);
  }, []);

  /* ── Initial load ── */
  useEffect(() => {
    refresh();
    setHydrated(true);
  }, [refresh]);

  /* ── Re-read when user returns to tab ── */
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    const onFocus   = () => refresh();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  /* ── Supabase sync: fetch remote on login ── */
  useEffect(() => {
    if (authLoading || !user) return;

    const days  = getLast7Days();
    const dates = days.map(d => d.date);

    fetchRemoteDailyProgress(user.id, dates).then(remote => {
      console.log("[OET Daily] remote data:", remote);

      // Update past day states from Supabase (more authoritative than localStorage for past days)
      setDayStates(prev => {
        const next = [...prev];
        dates.forEach((date, i) => {
          if (days[i].isToday) return; // today is driven by auto-detection
          const ids = remote[date] ?? [];
          next[i] = ids.length >= 4 ? "complete" : ids.length > 0 ? "partial" : "none";
        });
        return next;
      });

      // Merge today's remote tasks — if remote has more, sync down
      const todayDate    = dates[dates.length - 1];
      const remoteTodayIds = remote[todayDate] ?? [];
      if (remoteTodayIds.length > 0) {
        console.log("[OET Daily] remote today IDs:", remoteTodayIds);
        // Re-run getDailyCompletion after a brief tick to make sure local is fresh
        // No action needed — auto-detection drives local state
        // But update the local daily storage key to reflect any remote data
        try {
          const local = JSON.parse(localStorage.getItem(STORAGE_KEY(TODAY_DATE)) ?? "[]") as string[];
          const merged = [...new Set([...local, ...remoteTodayIds])];
          localStorage.setItem(STORAGE_KEY(TODAY_DATE), JSON.stringify(merged));
        } catch {}
      }
    }).catch(err => {
      console.error("[OET Daily] fetch error:", err);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  /* ── Derived ── */
  const plan        = hydrated ? generatePlan(appState) : [];
  const required    = plan.filter(t => t.required);
  const optional    = plan.filter(t => !t.required);

  const completedIds = dailyCompletion.completedTaskIds;
  const doneTodayCount  = required.filter(t => completedIds.includes(t.id)).length;
  const allRequiredDone = doneTodayCount === required.length && required.length > 0;
  const totalRequired   = required.reduce((s, t) => s + t.duration, 0);
  const doneMinutes     = required.filter(t => completedIds.includes(t.id)).reduce((s, t) => s + t.duration, 0);
  const weekDoneCount   = dayStates.filter(s => s === "complete").length;
  const perfectWeek     = dayStates.slice(0, 7).every(s => s === "complete");

  // Next incomplete required task (for session mode)
  const nextTask = required.find(t => !completedIds.includes(t.id)) ?? null;

  const moduleStatusMap: Record<string, { percent: number; statusLabel: string }> = {
    vocab:     { percent: dailyCompletion.vocabulary.percent, statusLabel: dailyCompletion.vocabulary.statusLabel },
    listening: { percent: dailyCompletion.listening.percent, statusLabel: dailyCompletion.listening.statusLabel },
    speaking:  { percent: dailyCompletion.speaking.percent, statusLabel: dailyCompletion.speaking.statusLabel },
    writing:   { percent: dailyCompletion.writing.percent, statusLabel: dailyCompletion.writing.statusLabel },
  };

  /* ── Loading ── */
  if (!hydrated) {
    return (
      <Shell>
        <div className="w-full max-w-lg mx-auto space-y-4 animate-pulse pt-4">
          <div className="h-8 w-48 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}
        </div>
      </Shell>
    );
  }

  /* ════════════════════════════════════════════════════════════
     PLAN VIEW
  ════════════════════════════════════════════════════════════ */

  if (view === "plan") {
    return (
      <Shell>
        <div className="w-full max-w-lg mx-auto">

          {/* Title */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 capitalize mb-1">{formatDate()}</p>
            <div className="flex items-end justify-between gap-2">
              <h1 className="text-2xl font-bold text-[#0B1E4B]">Session du jour</h1>
              {appState.level && (
                <span className="text-xs font-semibold text-[#009DA1] bg-[#00C2C7]/10 px-3 py-1 rounded-full">
                  Niveau {appState.level}
                </span>
              )}
            </div>
          </div>

          {/* Badges */}
          <Badges
            streak={appState.vocabStreak}
            allDoneToday={allRequiredDone}
            perfectWeek={perfectWeek}
          />

          {/* Progress card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">

            {/* Week calendar */}
            <WeekCalendar days={weekDays} dayStates={dayStates} doneCount={weekDoneCount} />

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Today progress */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#0B1E4B]">
                {allRequiredDone
                  ? "Session complétée !"
                  : `Aujourd'hui · ${doneTodayCount} / ${required.length} unités`}
              </p>
              <p className="text-xs text-gray-400">{doneMinutes} / {totalRequired} min</p>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${required.length ? (doneTodayCount / required.length) * 100 : 0}%`,
                  background: allRequiredDone ? "#22c55e" : "#0B1E4B",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>{required.length ? Math.round((doneTodayCount / required.length) * 100) : 0} %</span>
              <span>{required.length - doneTodayCount > 0 ? `${totalRequired - doneMinutes} min restantes` : "Tout est fait 🎉"}</span>
            </div>

            {allRequiredDone && (
              <p className="text-xs text-green-600 font-medium mt-3 text-center">
                Excellent travail ! Revenez demain pour votre prochaine session.
              </p>
            )}
          </div>

          {/* No assessment nudge */}
          {!appState.level && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex gap-3 items-start">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-amber-800 font-medium mb-1">Plan par défaut</p>
                <p className="text-xs text-amber-700 mb-2">Passez le test de niveau pour adapter votre plan à votre profil.</p>
                <Link href="/assessment" className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2">
                  Passer le test →
                </Link>
              </div>
            </div>
          )}

          {/* Required tasks */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tâches requises</p>
              <p className="text-xs text-gray-400">{totalRequired} min</p>
            </div>
            <div className="space-y-3">
              {required.map((task, i) => (
                <PlanTaskCard
                  key={task.id}
                  task={task}
                  index={i}
                  moduleStatus={moduleStatusMap[task.id] ?? null}
                />
              ))}
            </div>
          </div>

          {/* Optional tasks */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tâche optionnelle</p>
            <div className="space-y-3">
              {optional.map((task, i) => (
                <PlanTaskCard key={task.id} task={task} index={i} moduleStatus={null} />
              ))}
            </div>
          </div>

          {/* Start button */}
          {!allRequiredDone ? (
            <button
              onClick={() => setView("session")}
              className="w-full flex items-center justify-center gap-3 bg-[#0B1E4B] hover:bg-[#152960] text-white font-bold py-4 rounded-2xl text-base transition-all shadow-lg shadow-[#0B1E4B]/20 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Commencer ma session
              <span className="text-[#00C2C7] text-sm font-normal">· {totalRequired - doneMinutes} min</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="w-full flex items-center justify-center gap-2 bg-green-50 border-2 border-green-200 text-green-700 font-semibold py-4 rounded-2xl text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Session du jour complétée !
              </div>
              <Link
                href="/progress"
                className="block w-full text-center bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                Voir ma progression →
              </Link>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  /* ════════════════════════════════════════════════════════════
     SESSION VIEW — guided step-by-step, auto-detection
  ════════════════════════════════════════════════════════════ */

  if (view === "session") {
    // If everything is done, go to done view
    if (allRequiredDone) {
      return (
        <Shell>
          <DoneView
            required={required}
            completedIds={completedIds}
            weekDays={weekDays}
            dayStates={dayStates}
            onBack={() => setView("plan")}
          />
        </Shell>
      );
    }

    if (!nextTask) {
      setView("done");
      return null;
    }

    const taskModule = moduleStatusMap[nextTask.id];
    const isAutoDetected = taskModule && taskModule.percent >= 100;
    const stepIndex   = required.findIndex(t => t.id === nextTask.id);
    const totalSteps  = required.length;
    const doneSteps   = required.filter(t => completedIds.includes(t.id)).length;
    const pct         = Math.round((doneSteps / totalSteps) * 100);

    function handleContinue() {
      // completedTaskIds already reflect auto-detected state via refresh()
      // Just advance: re-read to confirm, then check if all done
      refresh();
      const remaining = required.filter(t => !completedIds.includes(t.id));
      if (remaining.length <= 1) {
        setView("done");
      }
      // nextTask will update naturally on re-render since it derives from completedIds
    }

    return (
      <Shell>
        <div className="w-full max-w-lg mx-auto">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setView("plan")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0B1E4B] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Revenir au plan
            </button>
            <span className="text-sm font-semibold text-[#0B1E4B]">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>

          {/* Progress segments */}
          <div className="flex items-center gap-2 mb-8">
            {required.map((t, i) => {
              const isDone = completedIds.includes(t.id);
              const isCurrent = t.id === nextTask.id;
              return (
                <div
                  key={i}
                  className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                    isDone    ? "bg-[#22c55e]"
                    : isCurrent ? "bg-[#0B1E4B]"
                    : "bg-gray-200"
                  }`}
                />
              );
            })}
          </div>

          {/* Task card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-5 shadow-sm">
            <div className="bg-[#0B1E4B] px-6 py-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Tâche {stepIndex + 1}
                </span>
                <span className="text-white/60 text-xs">{nextTask.duration} min</span>
              </div>
              <h2 className="text-xl font-bold text-white">{nextTask.icon} {nextTask.label}</h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-base text-[#0B1E4B] font-medium leading-relaxed mb-4">
                {nextTask.description}
              </p>
              <div className="bg-[#F7F9FC] rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-600">💡 Conseil — </span>
                  {nextTask.tip}
                </p>
              </div>

              {/* Auto-detection status */}
              {isAutoDetected ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">Complété automatiquement</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-500">En attente de complétion…</span>
                </div>
              )}

              <Link
                href={nextTask.href}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#0B1E4B]/15 hover:border-[#0B1E4B]/40 text-[#0B1E4B] font-semibold rounded-xl text-sm transition-all hover:bg-[#0B1E4B]/5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {nextTask.linkLabel}
              </Link>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">{pct}% accompli</span>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              disabled={!isAutoDetected}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl text-base transition-all active:scale-[0.98] ${
                isAutoDetected
                  ? "bg-[#00C2C7] hover:bg-[#009DA1] text-white shadow-lg shadow-[#00C2C7]/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {doneSteps + 1 < totalSteps ? "Tâche complétée → suivante" : "Terminer la session"}
            </button>

            <button
              onClick={() => {
                // Skip: advance without auto-detection; mark task as done manually
                refresh();
                const remaining = required.filter(t => !completedIds.includes(t.id));
                if (remaining.length <= 1) setView("done");
                // nextTask updates on re-render
              }}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
            >
              Passer cette tâche
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  /* ════════════════════════════════════════════════════════════
     DONE VIEW
  ════════════════════════════════════════════════════════════ */

  return (
    <Shell>
      <DoneView
        required={required}
        completedIds={completedIds}
        weekDays={weekDays}
        dayStates={dayStates}
        onBack={() => setView("plan")}
      />
    </Shell>
  );
}

/* ─── Done view ───────────────────────────────────────────────── */

function DoneView({
  required,
  completedIds,
  weekDays,
  dayStates,
  onBack,
}: {
  required: DailyTask[];
  completedIds: string[];
  weekDays: { label: string; isToday: boolean }[];
  dayStates: DayCompletion[];
  onBack: () => void;
}) {
  const finalDone   = required.filter(t => completedIds.includes(t.id)).length;
  const weekDone    = dayStates.filter(s => s === "complete").length;

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-[#0B1E4B] mb-2">
        {finalDone === required.length ? "Session complétée !" : "Bonne session !"}
      </h1>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
        {finalDone === required.length
          ? `Vous avez terminé les ${required.length} tâches requises. Revenez demain pour continuer.`
          : `Vous avez complété ${finalDone} tâche${finalDone > 1 ? "s" : ""} sur ${required.length}.`}
      </p>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 text-left">
        <WeekCalendar days={weekDays} dayStates={dayStates} doneCount={weekDone} />
      </div>
      <div className="space-y-3">
        <Link
          href="/progress"
          className="block w-full text-center bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          Voir ma progression →
        </Link>
        <button
          onClick={onBack}
          className="block w-full text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          ← Retour au plan du jour
        </button>
      </div>
    </div>
  );
}

/* ─── Shell ───────────────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-[#0B1E4B] transition-colors">Tableau de bord</Link>
          <Link href="/plan" className="hover:text-[#0B1E4B] transition-colors">Mon plan</Link>
          <Link href="/readiness" className="hover:text-[#0B1E4B] transition-colors">Mon score</Link>
          <Link href="/progress" className="hover:text-[#0B1E4B] transition-colors">Progression</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
