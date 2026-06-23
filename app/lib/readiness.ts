/* ─── OET Readiness Score ─────────────────────────────────────
 *
 * Estimated readiness based on signals stored in localStorage:
 *
 *   Assessment score        50 pts   (core English level)
 *   Vocabulary learned      15 pts   (30 cards)
 *   Speaking practiced      10 pts   (5 scenarios)
 *   Listening completed     10 pts   (10 scenarios)
 *   Writing completion       5 pts   (5 letters in target word count)
 *   Writing self-evaluation 10 pts   (6-criteria self-eval, avg across letters)
 *
 *   Total: 0 – 100. NOT an official OET score.
 */

export type ReadinessLevel = {
  label: string;
  color: string;
  bg: string;
  border: string;
  badge: string;
  description: string;
  recs: string[];
  targetScores: { skill: string; target: string; note?: string }[];
};

export type ReadinessData = {
  score: number;
  breakdown: {
    assessment: number;      // max 50
    vocabulary: number;      // max 15
    speaking: number;        // max 10
    listening: number;       // max 10
    writingCompletion: number; // max 5
    writingEval: number;     // max 10
    writing: number;         // = writingCompletion + writingEval (max 15)
  };
  level: ReadinessLevel;
};

export const SCORE_EXPLANATION = [
  { label: "Évaluation de niveau",     max: 50,  note: "Basé sur votre score au test de niveau initial" },
  { label: "Vocabulaire médical",       max: 15,  note: "30 fiches à apprendre" },
  { label: "Speaking",                  max: 10,  note: "5 scénarios de consultation" },
  { label: "Listening",                 max: 10,  note: "10 scénarios cliniques" },
  { label: "Writing — lettres rédigées",max:  5,  note: "5 lettres dans la plage 180–200 mots" },
  { label: "Writing — auto-évaluation", max: 10,  note: "Qualité moyenne sur 6 critères OET" },
] as const;

const READINESS_LEVELS: Record<string, ReadinessLevel> = {
  "not-ready": {
    label: "Pas encore prêt(e)",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
    description:
      "Votre niveau actuel nécessite un travail de fond avant de viser l'OET. Commencez par les bases médicales et grammaticales.",
    recs: [
      "Complétez toutes les fiches de vocabulaire médical (/vocabulary)",
      "Refaites l'évaluation après 4 à 6 semaines de travail intensif",
      "Consacrez au moins 45 minutes par jour à l'anglais médical",
      "Rejoignez notre programme intensif pour accélérer votre progression",
    ],
    targetScores: [
      { skill: "Listening", target: "350+", note: "Score B minimum requis" },
      { skill: "Reading",   target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking",  target: "350+", note: "Score B minimum requis" },
      { skill: "Writing",   target: "300+", note: "Minimum — viser 350+ idéalement" },
    ],
  },
  "foundation": {
    label: "Niveau fondation",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    description:
      "Vous avez des bases solides mais il reste du chemin. Concentrez-vous sur les compétences productives (Writing et Speaking).",
    recs: [
      "Pratiquez les 5 scénarios Speaking (/speaking) chaque semaine",
      "Rédigez au moins 2 lettres de référence OET par semaine (/writing)",
      "Augmentez votre score de vocabulaire à 20/30 fiches apprises",
      "Ciblez une amélioration de 15 points sur votre score d'évaluation",
    ],
    targetScores: [
      { skill: "Listening", target: "350+", note: "Score B minimum requis" },
      { skill: "Reading",   target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking",  target: "350+", note: "Score B minimum requis" },
      { skill: "Writing",   target: "300+", note: "Minimum — viser 350+ idéalement" },
    ],
  },
  "almost-ready": {
    label: "Presque prêt(e)",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    description:
      "Bon niveau général. Quelques semaines de travail ciblé suffisent pour atteindre un score B sur les 4 compétences.",
    recs: [
      "Terminez les 5 scénarios Speaking et les 5 lettres de référence",
      "Apprenez les 30 fiches de vocabulaire en priorité",
      "Faites un examen blanc OET complet pour identifier vos lacunes",
      "Concentrez-vous sur Writing : c'est la compétence la plus discriminante",
    ],
    targetScores: [
      { skill: "Listening", target: "350+", note: "Score B minimum requis" },
      { skill: "Reading",   target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking",  target: "350+", note: "Score B minimum requis" },
      { skill: "Writing",   target: "350+", note: "Viser 350+ idéalement" },
    ],
  },
  "oet-ready": {
    label: "Prêt(e) pour l'OET",
    color: "text-[#009DA1]",
    bg: "bg-[#00C2C7]/10",
    border: "border-[#00C2C7]/30",
    badge: "bg-[#00C2C7]/15 text-[#009DA1]",
    description:
      "Votre profil indique que vous êtes prêt(e) à passer l'OET. Finalisez votre préparation et inscrivez-vous à la prochaine session.",
    recs: [
      "Inscrivez-vous à l'OET sur oet.com dès maintenant",
      "Effectuez 2 à 3 examens blancs chronométrés avant la date",
      "Révisez les critères d'évaluation OET pour chaque épreuve",
      "Maintenez votre routine quotidienne de 20 minutes jusqu'au jour J",
    ],
    targetScores: [
      { skill: "Listening", target: "350+", note: "Score B minimum requis" },
      { skill: "Reading",   target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking",  target: "350+", note: "Score B minimum requis" },
      { skill: "Writing",   target: "350+", note: "Viser 350+ idéalement" },
    ],
  },
  "strong-candidate": {
    label: "Candidat(e) solide",
    color: "text-[#0B1E4B]",
    bg: "bg-[#0B1E4B]/5",
    border: "border-[#0B1E4B]/20",
    badge: "bg-[#0B1E4B]/10 text-[#0B1E4B]",
    description:
      "Excellent profil OET. Vous avez toutes les clés pour obtenir un grade A ou B+ sur l'ensemble des compétences.",
    recs: [
      "Réservez votre date d'examen OET immédiatement",
      "Ciblez un grade A sur Listening et Reading pour maximiser votre profil",
      "Peaufinez la structure et le registre de vos lettres de transfert",
      "Préparez vos documents de candidature pour les États-Unis en parallèle",
    ],
    targetScores: [
      { skill: "Listening", target: "350–450+", note: "Viser grade A" },
      { skill: "Reading",   target: "350–450+", note: "Viser grade A" },
      { skill: "Speaking",  target: "350+",     note: "Score B minimum requis" },
      { skill: "Writing",   target: "350+",     note: "Score B minimum requis" },
    ],
  },
};

function getLevelKey(score: number): string {
  if (score >= 90) return "strong-candidate";
  if (score >= 75) return "oet-ready";
  if (score >= 60) return "almost-ready";
  if (score >= 40) return "foundation";
  return "not-ready";
}

export function computeReadiness(): ReadinessData {
  // Assessment — max 50 pts
  let assessmentPts = 0;
  try {
    const raw = localStorage.getItem("oet_assessment_result");
    if (raw) {
      const { score } = JSON.parse(raw) as { score: number };
      assessmentPts = Math.round((score / 100) * 50);
    }
  } catch {}

  // Vocabulary — max 15 pts (30 cards)
  let vocabPts = 0;
  try {
    const raw = localStorage.getItem("oet_vocabulary_learned");
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      vocabPts = Math.round(Math.min(ids.length, 30) / 30 * 15);
    }
  } catch {}

  // Speaking — max 10 pts (5 scenarios)
  let speakingPts = 0;
  try {
    const raw = localStorage.getItem("oet_speaking_practiced");
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      speakingPts = Math.round(Math.min(ids.length, 5) / 5 * 10);
    }
  } catch {}

  // Listening — max 10 pts (10 scenarios)
  let listeningPts = 0;
  try {
    const raw = localStorage.getItem("oet_listening_completed");
    if (raw) {
      const parsed = JSON.parse(raw) as { completed: string[] };
      const count = (parsed.completed ?? []).length;
      listeningPts = Math.round(Math.min(count, 10) / 10 * 10);
    }
  } catch {}

  // Writing completion — max 5 pts (5 letters in word-count target)
  let writingCompletionPts = 0;
  try {
    const raw = localStorage.getItem("oet_writing_completed");
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      writingCompletionPts = Math.round(Math.min(ids.length, 5) / 5 * 5);
    }
  } catch {}

  // Writing quality evaluation — max 10 pts
  // Prefer AI eval score if available; fall back to manual self-eval.
  let writingEvalPts = 0;
  try {
    const rawCompleted = localStorage.getItem("oet_writing_completed");
    const completed = rawCompleted ? (JSON.parse(rawCompleted) as string[]) : [];

    // Try AI evals first (each letter's breakdown avg scaled to 0–1)
    const rawAiEvals = localStorage.getItem("oet_writing_ai_evals");
    if (rawAiEvals && completed.length > 0) {
      type AIEntry = { breakdown: Record<string, number> };
      const aiEvals = JSON.parse(rawAiEvals) as Record<string, AIEntry>;
      const scores: number[] = [];
      for (const id of completed) {
        const ev = aiEvals[id];
        if (!ev?.breakdown) continue;
        const vals = Object.values(ev.breakdown) as number[];
        if (vals.length === 0) continue;
        scores.push(vals.reduce((a, b) => a + b, 0) / (vals.length * 10)); // 0–1
      }
      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        writingEvalPts = Math.round(avg * 10);
      }
    }

    // Fall back to manual self-eval if no AI scores found
    if (writingEvalPts === 0) {
      const rawEvals = localStorage.getItem("oet_writing_evals");
      if (rawEvals && completed.length > 0) {
        const evals = JSON.parse(rawEvals) as Record<string, Record<string, string>>;
        const RATING_SCORE: Record<string, number> = { "needs-work": 0, "acceptable": 1, "good": 2 };
        const CATEGORIES = ["purpose", "clinical", "organisation", "tone", "grammar", "wordcount"];
        const scores: number[] = [];
        for (const id of completed) {
          const ev = evals[id];
          if (!ev) continue;
          const filled = CATEGORIES.filter((c) => ev[c]);
          if (filled.length === 0) continue;
          const sum = filled.reduce((s, c) => s + (RATING_SCORE[ev[c]] ?? 0), 0);
          scores.push(sum / (filled.length * 2)); // 0–1
        }
        if (scores.length > 0) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          writingEvalPts = Math.round(avg * 10);
        }
      }
    }
  } catch {}

  const writingPts = writingCompletionPts + writingEvalPts;
  const total = assessmentPts + vocabPts + speakingPts + listeningPts + writingPts;

  return {
    score: total,
    breakdown: {
      assessment: assessmentPts,
      vocabulary: vocabPts,
      speaking: speakingPts,
      listening: listeningPts,
      writingCompletion: writingCompletionPts,
      writingEval: writingEvalPts,
      writing: writingPts,
    },
    level: READINESS_LEVELS[getLevelKey(total)],
  };
}
