"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { computeReadiness, type ReadinessData } from "../lib/readiness";

/* ─── Derived analysis ────────────────────────────────────────── */

type Signal = {
  key: "assessment" | "vocabulary" | "speaking" | "writing";
  label: string;
  pts: number;
  max: number;
  href: string;
  actionLabel: string;
};

type Strength = { label: string; detail: string };
type Weakness = { label: string; detail: string; href: string; action: string };

function analyse(data: ReadinessData): {
  signals: Signal[];
  strengths: Strength[];
  weaknesses: Weakness[];
  timeline: string;
  timelineDetail: string;
} {
  const { breakdown, score } = data;

  const signals: Signal[] = [
    {
      key: "assessment",
      label: "Évaluation de niveau",
      pts: breakdown.assessment,
      max: 50,
      href: "/assessment",
      actionLabel: "Refaire l'évaluation",
    },
    {
      key: "vocabulary",
      label: "Vocabulaire médical",
      pts: breakdown.vocabulary,
      max: 20,
      href: "/vocabulary",
      actionLabel: "Apprendre les fiches",
    },
    {
      key: "speaking",
      label: "Speaking — jeux de rôle",
      pts: breakdown.speaking,
      max: 15,
      href: "/speaking",
      actionLabel: "Pratiquer les scénarios",
    },
    {
      key: "writing",
      label: "Writing — lettres de référence",
      pts: breakdown.writing,
      max: 15,
      href: "/writing",
      actionLabel: "Rédiger des lettres",
    },
  ];

  const strengths: Strength[] = [];
  const weaknesses: Weakness[] = [];

  // Assessment
  const assessPct = breakdown.assessment / 50;
  if (assessPct >= 0.7) {
    strengths.push({
      label: "Niveau d'anglais médical solide",
      detail: `Votre score d'évaluation (${Math.round(assessPct * 100)}/100) indique une bonne maîtrise du vocabulaire clinique et de la grammaire.`,
    });
  } else {
    weaknesses.push({
      label: "Score d'évaluation à améliorer",
      detail: `Votre évaluation contribue seulement ${breakdown.assessment}/50 pts. Un travail ciblé peut rapidement faire progresser ce score.`,
      href: "/assessment",
      action: "Refaire l'évaluation",
    });
  }

  // Vocabulary
  const vocabPct = breakdown.vocabulary / 20;
  if (vocabPct >= 0.7) {
    strengths.push({
      label: "Vocabulaire médical bien couvert",
      detail: `Vous avez appris ${Math.round(vocabPct * 30)}/30 fiches. Cette base lexicale vous aidera dans les 4 compétences OET.`,
    });
  } else {
    weaknesses.push({
      label: "Vocabulaire médical incomplet",
      detail: `Seulement ${Math.round(vocabPct * 30)}/30 fiches apprises. Le vocabulaire est la base de toutes les épreuves OET.`,
      href: "/vocabulary",
      action: "Continuer les fiches",
    });
  }

  // Speaking
  const speakPct = breakdown.speaking / 15;
  if (speakPct >= 0.6) {
    strengths.push({
      label: "Bonne pratique du Speaking",
      detail: `Vous avez pratiqué ${Math.round(speakPct * 5)}/5 scénarios de consultation. La simulation régulière est clé pour le jeu de rôle OET.`,
    });
  } else {
    weaknesses.push({
      label: "Speaking peu pratiqué",
      detail: `${Math.round(speakPct * 5)}/5 scénarios réalisés. Le Speaking OET s'améliore principalement par la pratique répétée.`,
      href: "/speaking",
      action: "Pratiquer maintenant",
    });
  }

  // Writing
  const writePct = breakdown.writing / 15;
  if (writePct >= 0.6) {
    strengths.push({
      label: "Bonne maîtrise du Writing",
      detail: `Vous avez rédigé ${Math.round(writePct * 5)}/5 lettres de référence. La structure OET est acquise.`,
    });
  } else {
    weaknesses.push({
      label: "Writing insuffisamment pratiqué",
      detail: `${Math.round(writePct * 5)}/5 lettres rédigées. Le Writing est souvent la compétence la plus discriminante à l'OET.`,
      href: "/writing",
      action: "Rédiger une lettre",
    });
  }

  // Timeline
  let timeline: string;
  let timelineDetail: string;
  if (score >= 90) {
    timeline = "2 à 4 semaines";
    timelineDetail = "Vous êtes prêt(e). Inscrivez-vous à la prochaine session OET et faites quelques examens blancs finaux.";
  } else if (score >= 75) {
    timeline = "4 à 8 semaines";
    timelineDetail = "Quelques semaines de révision ciblée suffisent. Concentrez-vous sur vos points faibles identifiés ci-dessus.";
  } else if (score >= 60) {
    timeline = "2 à 3 mois";
    timelineDetail = "Vous êtes sur la bonne voie. Terminez les exercices Speaking et Writing et maintenez votre routine quotidienne.";
  } else if (score >= 40) {
    timeline = "4 à 6 mois";
    timelineDetail = "Un programme structuré est nécessaire. Complétez d'abord le vocabulaire, puis attaquez les compétences productives.";
  } else {
    timeline = "6 à 12 mois";
    timelineDetail = "Une préparation de fond est requise. Commencez par consolider les bases grammaticales et le vocabulaire médical essentiel.";
  }

  return { signals, strengths, weaknesses, timeline, timelineDetail };
}

/* ─── Component ───────────────────────────────────────────────── */

export default function ReadinessClient() {
  const [data, setData] = useState<ReadinessData | null>(null);

  useEffect(() => {
    setData(computeReadiness());
  }, []);

  if (!data) {
    return (
      <Shell>
        <div className="w-full max-w-2xl mx-auto space-y-5 animate-pulse">
          <div className="h-10 w-64 bg-gray-200 rounded-xl" />
          <div className="h-52 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </Shell>
    );
  }

  const { score, breakdown, level } = data;
  const { signals, strengths, weaknesses, timeline, timelineDetail } = analyse(data);
  const barColor =
    score >= 75 ? "#00C2C7" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  return (
    <Shell>
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Préparation OET</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Mon score de préparation</h1>
        </div>

        {/* Score hero card */}
        <div className={`rounded-2xl border p-8 mb-5 ${level.bg} ${level.border}`}>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Big circular score */}
            <div className="relative flex-shrink-0">
              <svg className="w-36 h-36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke={barColor}
                  strokeWidth="2.5"
                  strokeDasharray={`${score} 100`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#0B1E4B]">{score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>

            {/* Level + description */}
            <div className="text-center sm:text-left">
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${level.badge}`}>
                {level.label}
              </span>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-sm">
                {level.description}
              </p>
              {/* Mini score bars */}
              <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                {signals.map((s) => (
                  <div key={s.key} className="text-xs">
                    <span className="text-gray-500">{s.label.split(" ")[0]}</span>
                    <span className="font-semibold text-[#0B1E4B] ml-1">{s.pts}/{s.max}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>0</span>
              <span className="text-gray-500 font-medium">Score de préparation</span>
              <span>100</span>
            </div>
            <div className="h-3 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${score}%`, background: barColor }}
              />
            </div>
            {/* Threshold markers */}
            <div className="relative h-4 mt-0.5">
              {[
                { pos: 40, label: "Fondation" },
                { pos: 60, label: "Presque prêt" },
                { pos: 75, label: "OET-ready" },
                { pos: 90, label: "Solide" },
              ].map((m) => (
                <div
                  key={m.pos}
                  className="absolute top-0 -translate-x-1/2"
                  style={{ left: `${m.pos}%` }}
                >
                  <div className="w-px h-2 bg-gray-400/40 mx-auto" />
                  <span className="text-[9px] text-gray-400 whitespace-nowrap hidden sm:block">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
          <h2 className="font-semibold text-[#0B1E4B] mb-5">Détail par composante</h2>
          <div className="space-y-4">
            {signals.map((s) => {
              const pct = Math.round((s.pts / s.max) * 100);
              const incomplete = s.pts < s.max;
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-sm mb-1.5 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-gray-700 font-medium truncate">{s.label}</span>
                      {incomplete && (
                        <Link
                          href={s.href}
                          className="flex-shrink-0 text-xs text-[#009DA1] hover:underline"
                        >
                          {s.actionLabel} →
                        </Link>
                      )}
                    </div>
                    <span className="flex-shrink-0 font-semibold text-[#0B1E4B]">
                      {s.pts} / {s.max}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 70 ? "#00C2C7" : pct >= 40 ? "#f59e0b" : "#f97316",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">↑</span>
              <h2 className="font-semibold text-[#0B1E4B]">Points forts</h2>
            </div>
            <ul className="space-y-4">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0B1E4B] mb-0.5">{s.label}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">↓</span>
              <h2 className="font-semibold text-[#0B1E4B]">Points à améliorer</h2>
            </div>
            <ul className="space-y-4">
              {weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0B1E4B] mb-0.5">{w.label}</p>
                    <p className="text-sm text-gray-500 leading-relaxed mb-2">{w.detail}</p>
                    <Link
                      href={w.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0B1E4B] hover:bg-[#152960] px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {w.action} →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* OET target scores */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
          <h2 className="font-semibold text-[#0B1E4B] mb-1">Scores OET cibles</h2>
          <p className="text-xs text-gray-400 mb-4">Scores minimums requis pour la majorité des États américains</p>
          <div className="grid grid-cols-2 gap-3">
            {level.targetScores.map((ts) => (
              <div key={ts.skill} className="bg-[#F7F9FC] border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">{ts.skill}</p>
                <p className="text-base font-bold text-[#0B1E4B]">{ts.target}</p>
                {ts.note && <p className="text-xs text-gray-400 mt-0.5">{ts.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Estimated timeline */}
        <div className="bg-[#0B1E4B] rounded-2xl p-6 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#00C2C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Délai estimé avant l&apos;OET</p>
              <p className="text-2xl font-bold text-[#00C2C7] mb-2">{timeline}</p>
              <p className="text-sm text-white/70 leading-relaxed">{timelineDetail}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 mb-6 flex gap-3 items-start">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-600">Score indicatif uniquement.</strong> Ce score de préparation est calculé à partir de vos activités sur cette plateforme. Il ne constitue pas un résultat officiel OET et ne prédit pas avec certitude votre performance à l&apos;examen réel. Seul un test OET officiel peut évaluer votre niveau de manière certifiée.
          </p>
        </div>

        {/* Footer nav */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            ← Tableau de bord
          </Link>
          <Link
            href="/plan"
            className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Voir mon plan OET →
          </Link>
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
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
