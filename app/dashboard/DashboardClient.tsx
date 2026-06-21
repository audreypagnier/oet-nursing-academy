"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { computeReadiness, type ReadinessData } from "../lib/readiness";

/* ─── Types ───────────────────────────────────────────────────── */

type AssessmentResult = {
  score: number;
  level: string;
  breakdown: { vocabulary: string; reading: string; grammar: string };
  completedAt: string;
};

type Level = "A2" | "B1" | "B1+" | "B2";

/* ─── Level config ────────────────────────────────────────────── */

const LEVEL_CONFIG: Record<Level, { color: string; bg: string; border: string; badge: string; next: string }> = {
  A2: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    next: "Objectif : atteindre le niveau B1",
  },
  B1: {
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    next: "Objectif : atteindre le niveau B1+",
  },
  "B1+": {
    color: "text-[#009DA1]",
    bg: "bg-[#00C2C7]/10",
    border: "border-[#00C2C7]/30",
    badge: "bg-[#00C2C7]/15 text-[#009DA1]",
    next: "Objectif : consolider le niveau B2",
  },
  B2: {
    color: "text-[#0B1E4B]",
    bg: "bg-[#0B1E4B]/5",
    border: "border-[#0B1E4B]/20",
    badge: "bg-[#0B1E4B]/10 text-[#0B1E4B]",
    next: "Objectif : passer l'OET dans 4 à 8 semaines",
  },
};

const BREAKDOWN_LABELS: Record<keyof AssessmentResult["breakdown"], string> = {
  vocabulary: "Vocabulaire médical",
  reading: "Compréhension écrite",
  grammar: "Grammaire",
};

/* ─── Helpers ─────────────────────────────────────────────────── */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function scoreToPercent(fraction: string) {
  const [num, den] = fraction.split("/").map(Number);
  return Math.round((num / den) * 100);
}

/* ─── Component ───────────────────────────────────────────────── */

export default function DashboardClient() {
  const [result, setResult] = useState<AssessmentResult | null | "loading">("loading");
  const [readiness, setReadiness] = useState<ReadinessData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("oet_assessment_result");
      setResult(raw ? (JSON.parse(raw) as AssessmentResult) : null);
    } catch {
      setResult(null);
    }
    setReadiness(computeReadiness());
  }, []);

  if (result === "loading") return <Shell><LoadingState /></Shell>;
  if (result === null) return <Shell><EmptyState /></Shell>;

  const cfg = LEVEL_CONFIG[result.level as Level] ?? LEVEL_CONFIG["B1"];

  return (
    <Shell>
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Tableau de bord</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Mon résultat OET</h1>
        </div>

        {/* Score card */}
        <div className={`rounded-2xl border p-8 mb-5 ${cfg.bg} ${cfg.border}`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Circular score */}
            <div className="relative flex-shrink-0">
              <svg className="w-28 h-28" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke="#00C2C7"
                  strokeWidth="2.5"
                  strokeDasharray={`${result.score} 100`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#0B1E4B]">{result.score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>

            {/* Level info */}
            <div className="text-center sm:text-left">
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${cfg.badge}`}>
                Niveau estimé
              </span>
              <h2 className={`text-3xl font-bold mb-1 ${cfg.color}`}>{result.level}</h2>
              <p className="text-sm text-gray-500 mb-3">{cfg.next}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-center sm:justify-start">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Évalué le {formatDate(result.completedAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5">
          <h3 className="font-semibold text-[#0B1E4B] mb-5">Détail par compétence</h3>
          <div className="space-y-4">
            {(Object.entries(result.breakdown) as [keyof AssessmentResult["breakdown"], string][]).map(
              ([key, value]) => {
                const pct = scoreToPercent(value);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-600 font-medium">{BREAKDOWN_LABELS[key]}</span>
                      <span className="text-[#0B1E4B] font-semibold">{value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00C2C7] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Readiness score */}
        {readiness && <ReadinessCard readiness={readiness} />}

        {/* CTA */}
        <div className="bg-[#0B1E4B] rounded-2xl p-6 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold mb-1">Prêt(e) à progresser ?</p>
            <p className="text-white/60 text-sm">Accédez à votre parcours OET personnalisé.</p>
          </div>
          <Link
            href="/#contact"
            className="flex-shrink-0 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            Continuer mon parcours OET →
          </Link>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/assessment"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Refaire l&apos;évaluation
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("oet_assessment_result");
              setResult(null);
            }}
            className="flex-1 text-center border border-red-100 text-red-400 hover:bg-red-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Supprimer mon résultat
          </button>
        </div>
      </div>
    </Shell>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-500">
          <Link href="/plan" className="hover:text-[#0B1E4B] transition-colors">Mon plan</Link>
          <Link href="/readiness" className="hover:text-[#0B1E4B] transition-colors">Mon score</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-[#00C2C7]/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#00C2C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[#0B1E4B] mb-3">Aucun résultat enregistré</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        Vous n&apos;avez pas encore sauvegardé de résultat d&apos;évaluation.
        Passez le test pour connaître votre niveau d&apos;anglais médical.
      </p>
      <Link
        href="/assessment"
        className="inline-block bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
      >
        Passer l&apos;évaluation →
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-pulse">
      <div className="h-10 w-48 bg-gray-200 rounded-xl" />
      <div className="h-40 bg-gray-200 rounded-2xl" />
      <div className="h-48 bg-gray-200 rounded-2xl" />
      <div className="h-20 bg-gray-200 rounded-2xl" />
    </div>
  );
}

function ReadinessCard({ readiness }: { readiness: ReadinessData }) {
  const { score, breakdown, level } = readiness;
  const breakdownItems = [
    { label: "Évaluation", pts: breakdown.assessment, max: 50 },
    { label: "Vocabulaire", pts: breakdown.vocabulary, max: 20 },
    { label: "Speaking", pts: breakdown.speaking, max: 15 },
    { label: "Writing", pts: breakdown.writing, max: 15 },
  ];

  return (
    <div className={`rounded-2xl border p-6 mb-5 ${level.bg} ${level.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${level.badge}`}>
              {level.label}
            </span>
          </div>
          <h3 className="font-bold text-[#0B1E4B] text-lg">Score de préparation OET</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Estimation indicative — pas un résultat officiel OET
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`text-4xl font-bold ${level.color}`}>{score}</span>
          <span className="text-gray-400 text-sm"> / 100</span>
        </div>
      </div>

      {/* Global bar */}
      <div className="h-2.5 bg-white/60 rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: score >= 75 ? "#00C2C7" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444",
          }}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 leading-relaxed mb-5">{level.description}</p>

      {/* Breakdown mini-bars */}
      <div className="bg-white/60 rounded-xl p-4 mb-5 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Détail du score
        </p>
        {breakdownItems.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 font-medium">{item.label}</span>
              <span className="text-[#0B1E4B] font-semibold">
                {item.pts} / {item.max}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C2C7] rounded-full"
                style={{ width: `${Math.round((item.pts / item.max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Target scores */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Scores OET cibles
        </p>
        <div className="grid grid-cols-2 gap-2">
          {level.targetScores.map((ts) => (
            <div key={ts.skill} className="bg-white/60 rounded-xl px-3 py-2.5">
              <p className="text-xs text-gray-500 mb-0.5">{ts.skill}</p>
              <p className="text-sm font-bold text-[#0B1E4B]">{ts.target}</p>
              {ts.note && <p className="text-xs text-gray-400 mt-0.5">{ts.note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Recommandations
        </p>
        <ul className="space-y-2">
          {level.recs.map((rec, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <span className="w-4 h-4 rounded-full bg-[#00C2C7]/20 text-[#009DA1] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                {i + 1}
              </span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
