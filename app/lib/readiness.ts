/* ─── OET Readiness Score ─────────────────────────────────────
 *
 * Estimated readiness based on four signals stored in localStorage:
 *   - Assessment score      → 50 pts  (core English level)
 *   - Vocabulary learned    → 20 pts  (30 cards total)
 *   - Speaking practiced    → 15 pts  (5 scenarios)
 *   - Writing completed     → 15 pts  (5 letters)
 *
 * Total: 0 – 100. This is NOT an official OET score.
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
    assessment: number;
    vocabulary: number;
    speaking: number;
    writing: number;
  };
  level: ReadinessLevel;
};

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
      { skill: "Reading", target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking", target: "350+", note: "Score B minimum requis" },
      { skill: "Writing", target: "300+", note: "Minimum — viser 350+ idéalement" },
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
      { skill: "Reading", target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking", target: "350+", note: "Score B minimum requis" },
      { skill: "Writing", target: "300+", note: "Minimum — viser 350+ idéalement" },
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
      { skill: "Reading", target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking", target: "350+", note: "Score B minimum requis" },
      { skill: "Writing", target: "350+", note: "Viser 350+ idéalement" },
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
      { skill: "Reading", target: "350+", note: "Score B minimum requis" },
      { skill: "Speaking", target: "350+", note: "Score B minimum requis" },
      { skill: "Writing", target: "350+", note: "Viser 350+ idéalement" },
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
      { skill: "Reading", target: "350–450+", note: "Viser grade A" },
      { skill: "Speaking", target: "350+", note: "Score B minimum requis" },
      { skill: "Writing", target: "350+", note: "Score B minimum requis" },
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
  // Assessment (max 50 pts)
  let assessmentPts = 0;
  try {
    const raw = localStorage.getItem("oet_assessment_result");
    if (raw) {
      const { score } = JSON.parse(raw) as { score: number };
      assessmentPts = Math.round((score / 100) * 50);
    }
  } catch {}

  // Vocabulary (max 20 pts — 30 cards total)
  let vocabPts = 0;
  try {
    const raw = localStorage.getItem("oet_vocabulary_learned");
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      vocabPts = Math.round(Math.min(ids.length, 30) / 30 * 20);
    }
  } catch {}

  // Speaking (max 15 pts — 5 scenarios)
  let speakingPts = 0;
  try {
    const raw = localStorage.getItem("oet_speaking_practiced");
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      speakingPts = Math.round(Math.min(ids.length, 5) / 5 * 15);
    }
  } catch {}

  // Writing (max 15 pts — 5 letters)
  let writingPts = 0;
  try {
    const raw = localStorage.getItem("oet_writing_completed");
    if (raw) {
      const ids = JSON.parse(raw) as string[];
      writingPts = Math.round(Math.min(ids.length, 5) / 5 * 15);
    }
  } catch {}

  const total = assessmentPts + vocabPts + speakingPts + writingPts;
  return {
    score: total,
    breakdown: {
      assessment: assessmentPts,
      vocabulary: vocabPts,
      speaking: speakingPts,
      writing: writingPts,
    },
    level: READINESS_LEVELS[getLevelKey(total)],
  };
}
