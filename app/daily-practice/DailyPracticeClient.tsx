"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Module data ─────────────────────────────────────────────── */

const SPEAKING = [
  { id: "sp-1", title: "Pain Assessment" },
  { id: "sp-2", title: "Medication Explanation" },
  { id: "sp-3", title: "Pre-operative Preparation" },
  { id: "sp-4", title: "Breaking Difficult News" },
  { id: "sp-5", title: "Discharge Instructions" },
];

const LISTENING = [
  { id: "sc1",  title: "Post-Cardiac Surgery Handover" },
  { id: "sc2",  title: "Chest Pain Assessment" },
  { id: "sc3",  title: "Fluid Balance Ward Round" },
  { id: "sc4",  title: "Medication Phone Consultation" },
  { id: "sc5",  title: "Hip Replacement Discharge" },
  { id: "sc6",  title: "Deteriorating Paediatric Patient" },
  { id: "sc7",  title: "Pre-operative Consent Briefing" },
  { id: "sc8",  title: "Mental Health Anxiety Assessment" },
  { id: "sc9",  title: "Sepsis Protocol Briefing" },
  { id: "sc10", title: "Diabetes Self-Management" },
];

const WRITING = [
  { id: "wr-1", title: "Cardiac Referral" },
  { id: "wr-2", title: "Diabetic Foot Referral" },
  { id: "wr-3", title: "Post-Surgical Physiotherapy" },
  { id: "wr-4", title: "Mental Health Transfer" },
  { id: "wr-5", title: "Respiratory Discharge" },
];

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
  speakingPracticed: Set<string>;
  listeningCompleted: Set<string>;
  writingCompleted: Set<string>;
  vocabReviewCount: number;
  vocabKnownCount: number;
  level: string | null;
};

type View = "plan" | "session" | "done";

/* ─── Helpers ─────────────────────────────────────────────────── */

const STORAGE_KEY = (date: string) => `oet_daily_practice_${date}`;
const TODAY_DATE  = new Date().toISOString().slice(0, 10);

function getDayOfYear(): number {
  const d = new Date();
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
}

function pick<T>(arr: T[]): T {
  return arr[getDayOfYear() % arr.length];
}

function formatDate(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function getLast7Days(): { key: string; label: string; isToday: boolean }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      key: STORAGE_KEY(d.toISOString().slice(0, 10)),
      label: d.toLocaleDateString("fr-FR", { weekday: "short" })[0].toUpperCase(),
      isToday: i === 6,
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

/* ─── Week calendar ───────────────────────────────────────────── */

function WeekCalendar({ days, completedDays }: {
  days: { label: string; isToday: boolean }[];
  completedDays: boolean[];
}) {
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2">
      {days.map((d, i) => {
        const done    = completedDays[i];
        const future  = !d.isToday && i > days.findIndex(x => x.isToday);
        return (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[10px] font-medium text-gray-400 uppercase">{d.label}</span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              future
                ? "bg-gray-100 text-gray-300"
                : done
                ? "bg-[#00C2C7] text-white shadow-sm"
                : d.isToday
                ? "border-2 border-dashed border-[#00C2C7] text-[#009DA1] bg-[#00C2C7]/5"
                : "bg-gray-100 text-gray-300"
            }`}>
              {done ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : future ? (
                <span className="text-[10px]">·</span>
              ) : d.isToday ? (
                <span className="text-[10px] font-bold">!</span>
              ) : (
                <span className="text-[10px]">○</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Task card (plan view) ───────────────────────────────────── */

function PlanTaskCard({ task, done, index }: { task: DailyTask; done: boolean; index: number }) {
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
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export default function DailyPracticeClient() {
  const [hydrated,      setHydrated]      = useState(false);
  const [view,          setView]          = useState<View>("plan");
  const [sessionQueue,  setSessionQueue]  = useState<DailyTask[]>([]);
  const [sessionStep,   setSessionStep]   = useState(0);
  const [completed,     setCompleted]     = useState<Set<string>>(new Set());
  const [weekDays,      setWeekDays]      = useState(getLast7Days());
  const [weekCompleted, setWeekCompleted] = useState<boolean[]>(Array(7).fill(false));
  const [appState,      setAppState]      = useState<AppState>({
    speakingPracticed: new Set(),
    listeningCompleted: new Set(),
    writingCompleted: new Set(),
    vocabReviewCount: 0,
    vocabKnownCount: 0,
    level: null,
  });

  useEffect(() => {
    const s: AppState = {
      speakingPracticed: new Set(),
      listeningCompleted: new Set(),
      writingCompleted: new Set(),
      vocabReviewCount: 0,
      vocabKnownCount: 0,
      level: null,
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

    setAppState(s);

    try {
      const r = localStorage.getItem(STORAGE_KEY(TODAY_DATE));
      if (r) setCompleted(new Set(JSON.parse(r) as string[]));
    } catch {}

    const days = getLast7Days();
    setWeekDays(days);
    setWeekCompleted(days.map(d => {
      try {
        const r = localStorage.getItem(d.key);
        return r ? (JSON.parse(r) as string[]).length > 0 : false;
      } catch { return false; }
    }));

    setHydrated(true);
  }, []);

  /* ── Derived ── */

  const plan          = hydrated ? generatePlan(appState) : [];
  const required      = plan.filter(t => t.required);
  const optional      = plan.filter(t => !t.required);
  const doneTodayCount  = required.filter(t => completed.has(t.id)).length;
  const allRequiredDone = doneTodayCount === required.length && required.length > 0;
  const totalRequired   = required.reduce((s, t) => s + t.duration, 0);
  const doneMinutes     = required.filter(t => completed.has(t.id)).reduce((s, t) => s + t.duration, 0);
  const weekDoneCount   = weekCompleted.filter(Boolean).length;

  /* ── Actions ── */

  function save(next: Set<string>) {
    setCompleted(next);
    try { localStorage.setItem(STORAGE_KEY(TODAY_DATE), JSON.stringify([...next])); } catch {}
    setWeekCompleted(prev => { const n = [...prev]; n[6] = next.size > 0; return n; });
  }

  function startSession() {
    const queue = required.filter(t => !completed.has(t.id));
    if (queue.length === 0) {
      setView("done");
      return;
    }
    setSessionQueue(queue);
    setSessionStep(0);
    setView("session");
  }

  function completeStep() {
    const task = sessionQueue[sessionStep];
    const next = new Set(completed);
    next.add(task.id);
    save(next);
    if (sessionStep + 1 < sessionQueue.length) {
      setSessionStep(sessionStep + 1);
    } else {
      setView("done");
    }
  }

  function skipStep() {
    if (sessionStep + 1 < sessionQueue.length) {
      setSessionStep(sessionStep + 1);
    } else {
      setView("done");
    }
  }

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

          {/* Progress card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">

            {/* Week row */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cette semaine</p>
                <p className="text-xs text-gray-500 font-medium">{weekDoneCount} / 7 jours</p>
              </div>
              <WeekCalendar days={weekDays} completedDays={weekCompleted} />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-4" />

            {/* Today progress */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#0B1E4B]">
                {allRequiredDone ? "Session complétée !" : `Aujourd'hui · ${doneTodayCount}/${required.length} tâches`}
              </p>
              <p className="text-xs text-gray-400">{doneMinutes} / {totalRequired} min</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${required.length ? (doneTodayCount / required.length) * 100 : 0}%`,
                  background: allRequiredDone ? "#00C2C7" : "#0B1E4B",
                }}
              />
            </div>
            {allRequiredDone && (
              <p className="text-xs text-[#009DA1] font-medium mt-2 text-center">
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
                <PlanTaskCard key={task.id} task={task} done={completed.has(task.id)} index={i} />
              ))}
            </div>
          </div>

          {/* Optional tasks */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tâche optionnelle</p>
            <div className="space-y-3">
              {optional.map((task, i) => (
                <PlanTaskCard key={task.id} task={task} done={completed.has(task.id)} index={i} />
              ))}
            </div>
          </div>

          {/* Start button */}
          {!allRequiredDone ? (
            <button
              onClick={startSession}
              className="w-full flex items-center justify-center gap-3 bg-[#0B1E4B] hover:bg-[#152960] text-white font-bold py-4 rounded-2xl text-base transition-all shadow-lg shadow-[#0B1E4B]/20 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Commencer ma session
              <span className="text-[#00C2C7] text-sm font-normal">· {totalRequired - doneMinutes} min restantes</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="w-full flex items-center justify-center gap-2 bg-[#00C2C7]/10 border-2 border-[#00C2C7]/30 text-[#009DA1] font-semibold py-4 rounded-2xl text-sm">
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
     SESSION VIEW (step-by-step)
  ════════════════════════════════════════════════════════════ */

  if (view === "session") {
    const task        = sessionQueue[sessionStep];
    const totalSteps  = sessionQueue.length;
    const pct         = Math.round((sessionStep / totalSteps) * 100);

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
              {sessionStep + 1} / {totalSteps}
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-8">
            {sessionQueue.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                  i < sessionStep
                    ? "bg-[#00C2C7]"
                    : i === sessionStep
                    ? "bg-[#0B1E4B]"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Task card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-5 shadow-sm">

            {/* Header */}
            <div className="bg-[#0B1E4B] px-6 py-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Tâche {sessionStep + 1}
                </span>
                <span className="text-white/60 text-xs">{task.duration} min</span>
              </div>
              <h2 className="text-xl font-bold text-white">{task.icon} {task.label}</h2>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-base text-[#0B1E4B] font-medium leading-relaxed mb-4">
                {task.description}
              </p>

              {/* Tip */}
              <div className="bg-[#F7F9FC] rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="font-semibold text-gray-600">💡 Conseil — </span>
                  {task.tip}
                </p>
              </div>

              {/* Open module link */}
              <Link
                href={task.href}
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#0B1E4B]/15 hover:border-[#0B1E4B]/40 text-[#0B1E4B] font-semibold rounded-xl text-sm transition-all hover:bg-[#0B1E4B]/5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {task.linkLabel}
              </Link>
            </div>
          </div>

          {/* Progress bar */}
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
              onClick={completeStep}
              className="w-full flex items-center justify-center gap-2 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-bold py-4 rounded-2xl text-base transition-all shadow-lg shadow-[#00C2C7]/25 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {sessionStep + 1 < totalSteps ? "Tâche accomplie → suivante" : "Terminer la session"}
            </button>

            <button
              onClick={skipStep}
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

  const finalDone = required.filter(t => completed.has(t.id)).length;

  return (
    <Shell>
      <div className="w-full max-w-lg mx-auto text-center">

        {/* Celebration */}
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-[#0B1E4B] mb-2">
          {finalDone === required.length ? "Session complétée !" : "Bonne session !"}
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
          {finalDone === required.length
            ? `Vous avez terminé les ${required.length} tâches requises. Revenez demain pour continuer votre progression.`
            : `Vous avez complété ${finalDone} tâche${finalDone > 1 ? "s" : ""} sur ${required.length}. Continuez demain pour avancer régulièrement.`}
        </p>

        {/* Week summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cette semaine</p>
          <WeekCalendar days={weekDays} completedDays={weekCompleted} />
          <p className="text-center text-sm text-gray-600 font-medium mt-4">
            {weekCompleted.filter(Boolean).length} jour{weekCompleted.filter(Boolean).length > 1 ? "s" : ""} de pratique cette semaine
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link
            href="/progress"
            className="block w-full text-center bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Voir ma progression →
          </Link>
          <button
            onClick={() => setView("plan")}
            className="block w-full text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            ← Retour au plan du jour
          </button>
        </div>
      </div>
    </Shell>
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
