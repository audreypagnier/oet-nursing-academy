import { SPEAKING, LISTENING, WRITING, pick } from "./dailyModules";

export type ModuleStatus = {
  completed: boolean;
  percent: number;
  statusLabel: string;
};

export type DailyCompletion = {
  vocabulary: ModuleStatus;
  listening: ModuleStatus;
  speaking: ModuleStatus;
  writing: ModuleStatus;
  overallPercent: number;
  overallState: "complete" | "partial" | "none";
  completedTaskIds: string[];
};

const EMPTY: DailyCompletion = {
  vocabulary: { completed: false, percent: 0, statusLabel: "Aucune carte révisée" },
  listening:  { completed: false, percent: 0, statusLabel: "Aucune question répondue" },
  speaking:   { completed: false, percent: 0, statusLabel: "Aucun enregistrement" },
  writing:    { completed: false, percent: 0, statusLabel: "Aucune lettre rédigée" },
  overallPercent: 0,
  overallState: "none",
  completedTaskIds: [],
};

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

/**
 * Compute today's completion status from each module's localStorage data.
 * Each module is only marked complete if the work was done TODAY.
 *
 * - Vocabulary  : streak weeklyActivity[today] >= 5
 * - Listening   : today's scenario completed today (oet_listening_completed_dates)
 * - Speaking    : today's scenario recorded today (oet_speaking_practiced_dates)
 * - Writing     : today's task has an AI eval with evaluatedAt = today
 */
export function getDailyCompletion(): DailyCompletion {
  if (typeof window === "undefined") return EMPTY;

  const today = new Date().toISOString().slice(0, 10);

  /* ── Vocabulary ── */
  const streak = safeRead<{ weeklyActivity?: Record<string, number> }>("oet_vocab_streak", {});
  const vocabActivity = streak.weeklyActivity?.[today] ?? 0;
  const vocabPercent  = Math.min(100, Math.round((vocabActivity / 5) * 100));

  /* ── Speaking ──
     oet_speaking_practiced_dates: Record<scenarioId, "YYYY-MM-DD">
     Written by SpeakingClient.markPracticed() when a recording is completed.
     We use `find` (same as generatePlan) to determine today's assigned scenario,
     then verify its date equals today. */
  const speakingPracticedArr = safeRead<string[]>("oet_speaking_practiced", []);
  const speakingPracticed    = new Set(speakingPracticedArr);
  const todaySpeaking        = SPEAKING.find(s => !speakingPracticed.has(s.id)) ?? pick(SPEAKING);
  const speakingDates        = safeRead<Record<string, string>>("oet_speaking_practiced_dates", {});
  const speakingDone         = speakingDates[todaySpeaking.id] === today;

  /* ── Listening ──
     oet_listening_completed_dates: Record<scenarioId, "YYYY-MM-DD">
     Written by ListeningClient.handleAnswer() when all questions are answered. */
  const listeningRaw = safeRead<{ completed?: string[]; answers?: Record<string, Record<number, number>> }>(
    "oet_listening_completed", {},
  );
  const listeningDoneSet = new Set(listeningRaw.completed ?? []);
  const listeningAnswers = listeningRaw.answers ?? {};
  const todayListening   = LISTENING.find(s => !listeningDoneSet.has(s.id)) ?? pick(LISTENING);
  const listeningDates   = safeRead<Record<string, string>>("oet_listening_completed_dates", {});
  const listeningDone    = listeningDates[todayListening.id] === today;

  // Partial: count answered questions for today's scenario (only matters if not done)
  const listeningAnsweredCount = listeningDone
    ? 3
    : Object.keys(listeningAnswers[todayListening.id] ?? {}).length;
  const listeningPercent = listeningDone ? 100 : Math.round((listeningAnsweredCount / 3) * 100);

  /* ── Writing ──
     oet_writing_ai_evals: Record<scenarioId, AIWritingEval>
     AIWritingEval.evaluatedAt is an ISO timestamp written when the AI eval is done.
     Only count as complete if evaluatedAt date equals today. */
  const writingCompletedArr = safeRead<string[]>("oet_writing_completed", []);
  const writingCompleted    = new Set(writingCompletedArr);
  const todayWriting        = WRITING.find(w => !writingCompleted.has(w.id)) ?? pick(WRITING);
  const aiEvals             = safeRead<Record<string, { evaluatedAt?: string }>>("oet_writing_ai_evals", {});
  const writingEvalDate     = aiEvals[todayWriting.id]?.evaluatedAt?.slice(0, 10);
  const writingDone         = writingEvalDate === today;

  /* ── Build result ── */
  const completedTaskIds: string[] = [];
  if (vocabPercent   >= 100) completedTaskIds.push("vocab");
  if (listeningDone)         completedTaskIds.push("listening");
  if (speakingDone)          completedTaskIds.push("speaking");
  if (writingDone)           completedTaskIds.push("writing");

  const overallPercent = Math.round(
    (vocabPercent + listeningPercent + (speakingDone ? 100 : 0) + (writingDone ? 100 : 0)) / 4,
  );
  const overallState: DailyCompletion["overallState"] =
    overallPercent >= 100 ? "complete" : overallPercent > 0 ? "partial" : "none";

  return {
    vocabulary: {
      completed: vocabPercent >= 100,
      percent: vocabPercent,
      statusLabel: vocabPercent >= 100
        ? "Terminé"
        : vocabActivity > 0
        ? `${vocabActivity} / 5 cartes`
        : "Aucune carte révisée",
    },
    listening: {
      completed: listeningDone,
      percent: listeningPercent,
      statusLabel: listeningDone
        ? "Terminé"
        : listeningAnsweredCount > 0
        ? `${listeningAnsweredCount} / 3 questions`
        : "Aucune question répondue",
    },
    speaking: {
      completed: speakingDone,
      percent: speakingDone ? 100 : 0,
      statusLabel: speakingDone ? "Enregistrement réalisé" : "Aucun enregistrement",
    },
    writing: {
      completed: writingDone,
      percent: writingDone ? 100 : 0,
      statusLabel: writingDone ? "Lettre complétée" : "Aucune lettre rédigée",
    },
    overallPercent,
    overallState,
    completedTaskIds,
  };
}
