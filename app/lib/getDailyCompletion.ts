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

/** Compute today's completion status from each module's localStorage data. */
export function getDailyCompletion(): DailyCompletion {
  if (typeof window === "undefined") return EMPTY;

  const todayStr = new Date().toISOString().slice(0, 10);

  /* ── Vocabulary ── */
  const streak = safeRead<{ weeklyActivity?: Record<string, number> }>("oet_vocab_streak", {});
  const vocabActivity = streak.weeklyActivity?.[todayStr] ?? 0;
  const vocabPercent  = Math.min(100, Math.round((vocabActivity / 5) * 100));

  /* ── Speaking ── */
  const practicedArr  = safeRead<string[]>("oet_speaking_practiced", []);
  const practiced     = new Set(practicedArr);
  const todaySpeaking = SPEAKING.find(s => !practiced.has(s.id)) ?? pick(SPEAKING);
  const speakingDone  = practiced.has(todaySpeaking.id);

  /* ── Listening ── */
  const listeningRaw = safeRead<{ completed?: string[]; answers?: Record<string, Record<number, number>> }>(
    "oet_listening_completed", {},
  );
  const listeningDoneSet = new Set(listeningRaw.completed ?? []);
  const listeningAnswers = listeningRaw.answers ?? {};
  const todayListening   = LISTENING.find(s => !listeningDoneSet.has(s.id)) ?? pick(LISTENING);
  let listeningPercent   = 0;
  if (listeningDoneSet.has(todayListening.id)) {
    listeningPercent = 100;
  } else {
    const answered = Object.keys(listeningAnswers[todayListening.id] ?? {}).length;
    listeningPercent = Math.round((answered / 3) * 100);
  }
  const listeningAnsweredCount = listeningDoneSet.has(todayListening.id)
    ? 3
    : Object.keys(listeningAnswers[todayListening.id] ?? {}).length;

  /* ── Writing ── */
  const writingCompletedArr = safeRead<string[]>("oet_writing_completed", []);
  const writingCompleted    = new Set(writingCompletedArr);
  const todayWriting        = WRITING.find(w => !writingCompleted.has(w.id)) ?? pick(WRITING);
  const aiEvals             = safeRead<Record<string, unknown>>("oet_writing_ai_evals", {});
  const writingDone         = writingCompleted.has(todayWriting.id) || (todayWriting.id in aiEvals);

  /* ── Build result ── */
  const completedTaskIds: string[] = [];
  if (vocabPercent   >= 100) completedTaskIds.push("vocab");
  if (listeningPercent >= 100) completedTaskIds.push("listening");
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
      completed: listeningPercent >= 100,
      percent: listeningPercent,
      statusLabel: listeningPercent >= 100
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
