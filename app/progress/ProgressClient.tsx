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

type MockResult = {
  date: string;
  readingScore: number;
  vocabScore: number;
  readingGrade: string;
  vocabGrade: string;
  speakingGrade: string;
  writingGrade: string;
  overall: string;
};

type ProgressData = {
  readiness: ReadinessData;
  assessment: AssessmentResult | null;
  vocabCount: number;
  readingCount: number;
  speakingCount: number;
  writingCount: number;
  listeningCount: number;
  writingAiGrades: string[];   // AI-evaluated letter grades e.g. ["A","B"]
  dailyCompleted: number;
  mockResult: MockResult | null;
};

/* ─── Helpers ─────────────────────────────────────────────────── */

const TOTALS = { vocab: 30, reading: 10, speaking: 5, writing: 5, listening: 10, daily: 4 };

function todayKey() {
  return `oet_daily_practice_${new Date().toISOString().slice(0, 10)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function loadProgress(): ProgressData {
  const readiness = computeReadiness();

  let assessment: AssessmentResult | null = null;
  try {
    const r = localStorage.getItem("oet_assessment_result");
    if (r) assessment = JSON.parse(r);
  } catch {}

  let vocabCount = 0;
  try {
    const r = localStorage.getItem("oet_vocabulary_learned");
    if (r) vocabCount = Math.min((JSON.parse(r) as string[]).length, TOTALS.vocab);
  } catch {}

  let readingCount = 0;
  try {
    const r = localStorage.getItem("oet_reading_completed");
    if (r) readingCount = Math.min((JSON.parse(r) as string[]).length, TOTALS.reading);
  } catch {}

  let speakingCount = 0;
  try {
    const r = localStorage.getItem("oet_speaking_practiced");
    if (r) speakingCount = Math.min((JSON.parse(r) as string[]).length, TOTALS.speaking);
  } catch {}

  let writingCount = 0;
  try {
    const r = localStorage.getItem("oet_writing_completed");
    if (r) writingCount = Math.min((JSON.parse(r) as string[]).length, TOTALS.writing);
  } catch {}

  let dailyCompleted = 0;
  try {
    const r = localStorage.getItem(todayKey());
    if (r) dailyCompleted = Math.min((JSON.parse(r) as string[]).length, TOTALS.daily);
  } catch {}

  let listeningCount = 0;
  try {
    const r = localStorage.getItem("oet_listening_completed");
    if (r) {
      const parsed = JSON.parse(r) as { completed: string[] };
      listeningCount = Math.min((parsed.completed ?? []).length, TOTALS.listening);
    }
  } catch {}

  let writingAiGrades: string[] = [];
  try {
    const rawAi = localStorage.getItem("oet_writing_ai_evals");
    const rawCompleted = localStorage.getItem("oet_writing_completed");
    if (rawAi && rawCompleted) {
      const aiEvals = JSON.parse(rawAi) as Record<string, { grade: string }>;
      const completed = JSON.parse(rawCompleted) as string[];
      writingAiGrades = completed.filter((id) => aiEvals[id]?.grade).map((id) => aiEvals[id].grade);
    }
  } catch {}

  let mockResult: MockResult | null = null;
  try {
    const r = localStorage.getItem("oet_mock_exam_result");
    if (r) mockResult = JSON.parse(r);
  } catch {}

  return { readiness, assessment, vocabCount, readingCount, speakingCount, writingCount, listeningCount, writingAiGrades, dailyCompleted, mockResult };
}

function oetLevelFromScore(score: number): string {
  if (score >= 90) return "Niveau B2+ — prêt pour l'OET";
  if (score >= 75) return "Niveau B2 — prêt pour l'OET";
  if (score >= 60) return "Niveau B1+ — presque prêt";
  if (score >= 40) return "Niveau B1 — fondation solide";
  return "Niveau A2–B1 — préparation en cours";
}

/* ─── Mini ring SVG ───────────────────────────────────────────── */

function Ring({ pct, size = 64, stroke = 5, color = "#00C2C7", children }: {
  pct: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const cx = size / 2;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={stroke} />
        <circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ─── Grade badge ─────────────────────────────────────────────── */

const GRADE_STYLE: Record<string, string> = {
  A: "bg-[#0B1E4B]/10 text-[#0B1E4B]",
  B: "bg-[#00C2C7]/15 text-[#009DA1]",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-red-100 text-red-600",
};

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${GRADE_STYLE[grade] ?? GRADE_STYLE["D"]}`}>
      {grade}
    </span>
  );
}

/* ─── Progress bar ────────────────────────────────────────────── */

function Bar({ pct, color = "#00C2C7" }: { pct: number; color?: string }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────── */

export default function ProgressClient() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    setData(loadProgress());
  }, []);

  if (!data) {
    return (
      <Shell>
        <div className="w-full max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="h-10 w-48 bg-gray-200 rounded-xl" />
          <div className="h-44 bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
          </div>
          <div className="h-36 bg-gray-200 rounded-2xl" />
        </div>
      </Shell>
    );
  }

  const { readiness, assessment, vocabCount, readingCount, speakingCount, writingCount, listeningCount, writingAiGrades, dailyCompleted, mockResult } = data;
  const { score, level } = readiness;

  const barColor = score >= 75 ? "#00C2C7" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444";

  const skills = [
    {
      label: "Vocabulaire",
      icon: "📖",
      count: vocabCount,
      total: TOTALS.vocab,
      href: "/vocabulary",
      color: "#00C2C7",
    },
    {
      label: "Reading",
      icon: "📄",
      count: readingCount,
      total: TOTALS.reading,
      href: "/reading",
      color: "#0B1E4B",
    },
    {
      label: "Speaking",
      icon: "🎙️",
      count: speakingCount,
      total: TOTALS.speaking,
      href: "/speaking",
      color: "#009DA1",
    },
    {
      label: "Writing",
      icon: "✍️",
      count: writingCount,
      total: TOTALS.writing,
      href: "/writing",
      color: "#7C3AED",
    },
    {
      label: "Listening",
      icon: "🎧",
      count: listeningCount,
      total: TOTALS.listening,
      href: "/listening",
      color: "#059669",
    },
  ];

  const totalActivities = TOTALS.vocab + TOTALS.reading + TOTALS.speaking + TOTALS.writing + TOTALS.listening;
  const completedActivities = vocabCount + readingCount + speakingCount + writingCount + listeningCount;
  const overallPct = Math.round((completedActivities / totalActivities) * 100);

  return (
    <Shell>
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-7">
          <p className="text-sm text-gray-500 mb-1">Tableau de progression</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Ma progression OET</h1>
        </div>

        {/* ── Readiness hero ── */}
        <div className={`rounded-2xl border p-6 mb-4 ${level.bg} ${level.border}`}>
          <div className="flex items-center gap-6">
            {/* Big ring */}
            <Ring pct={score} size={96} stroke={7} color={barColor}>
              <div className="text-center">
                <p className={`text-2xl font-bold leading-none ${level.color}`}>{score}</p>
                <p className="text-[10px] text-gray-400 leading-none mt-0.5">/ 100</p>
              </div>
            </Ring>

            <div className="flex-1 min-w-0">
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${level.badge}`}>
                {level.label}
              </span>
              <p className="font-bold text-[#0B1E4B] text-base leading-snug mb-1">Score de préparation OET</p>
              <p className="text-xs text-gray-500 leading-relaxed">{oetLevelFromScore(score)}</p>
            </div>
          </div>

          {/* Breakdown mini bars */}
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              { label: "Évaluation", pts: readiness.breakdown.assessment, max: 50 },
              { label: "Vocabulaire", pts: readiness.breakdown.vocabulary, max: 15 },
              { label: "Speaking", pts: readiness.breakdown.speaking, max: 10 },
              { label: "Listening", pts: readiness.breakdown.listening, max: 10 },
              { label: "Writing", pts: readiness.breakdown.writing, max: 15 },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{b.label}</span>
                  <span className="font-semibold text-[#0B1E4B]">{b.pts}/{b.max}</span>
                </div>
                <Bar pct={Math.round((b.pts / b.max) * 100)} color={barColor} />
              </div>
            ))}
          </div>

          <Link
            href="/readiness"
            className="mt-4 inline-block text-xs font-semibold text-[#009DA1] hover:underline"
          >
            Voir le détail complet →
          </Link>
        </div>

        {/* ── Overall content progress ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-[#0B1E4B] text-sm">Avancement global du contenu</p>
            <span className="text-sm font-bold text-[#0B1E4B]">{completedActivities} / {totalActivities}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallPct}%`, background: overallPct >= 75 ? "#00C2C7" : overallPct >= 40 ? "#f59e0b" : "#f97316" }}
            />
          </div>
          <p className="text-xs text-gray-400">{overallPct}% des exercices complétés</p>
        </div>

        {/* ── Skill cards ── */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {skills.map((s) => {
            const pct = Math.round((s.count / s.total) * 100);
            const done = s.count === s.total;
            return (
              <Link
                key={s.label}
                href={s.href}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-[#00C2C7]/50 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm font-semibold text-[#0B1E4B]">{s.label}</span>
                  </div>
                  {done && (
                    <div className="w-5 h-5 rounded-full bg-[#00C2C7] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <Ring pct={pct} size={56} stroke={4.5} color={done ? "#00C2C7" : s.color}>
                  <span className="text-[10px] font-bold text-[#0B1E4B]">{pct}%</span>
                </Ring>

                <div className="mt-3">
                  <p className={`text-xl font-bold ${done ? "text-[#009DA1]" : "text-[#0B1E4B]"}`}>
                    {s.count}<span className="text-xs font-normal text-gray-400"> / {s.total}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 group-hover:text-[#009DA1] transition-colors">
                    {done ? "Complété ✓" : "Continuer →"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Writing AI grades ── */}
        {writingAiGrades.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🤖</span>
                <p className="font-semibold text-[#0B1E4B] text-sm">Évaluations AI Writing</p>
              </div>
              <span className="text-xs text-gray-400">{writingAiGrades.length} lettre{writingAiGrades.length > 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {writingAiGrades.map((grade, i) => {
                const colors: Record<string, string> = {
                  A: "bg-[#0B1E4B] text-white", B: "bg-[#00C2C7]/15 text-[#009DA1] border border-[#00C2C7]/30",
                  "C+": "bg-yellow-50 text-yellow-700 border border-yellow-200",
                  C: "bg-orange-50 text-orange-700 border border-orange-200",
                  D: "bg-red-50 text-red-600 border border-red-200",
                };
                return (
                  <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-full ${colors[grade] ?? "bg-gray-100 text-gray-500"}`}>
                    Lettre {i + 1} — Grade {grade}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Daily practice ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-[#0B1E4B] text-sm">Routine du jour</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#0B1E4B]">{dailyCompleted}</span>
              <span className="text-gray-400 text-sm"> / {TOTALS.daily}</span>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            {["Vocabulaire", "Reading", "Speaking", "Writing"].map((task, i) => {
              const done = i < dailyCompleted;
              return (
                <div
                  key={task}
                  className={`flex-1 rounded-xl py-2 text-center text-xs font-medium transition-colors ${
                    done ? "bg-[#00C2C7]/15 text-[#009DA1]" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {done ? "✓" : "·"}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <Bar pct={Math.round((dailyCompleted / TOTALS.daily) * 100)} />
            <Link href="/daily-practice" className="text-xs text-[#009DA1] font-semibold hover:underline ml-4 flex-shrink-0">
              {dailyCompleted === TOTALS.daily ? "Session complète ✓" : "Commencer →"}
            </Link>
          </div>
        </div>

        {/* ── Mock exam result ── */}
        {mockResult ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-[#0B1E4B] text-sm">Dernier examen blanc</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(mockResult.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Score global</span>
                <GradeBadge grade={mockResult.overall} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Reading", grade: mockResult.readingGrade, detail: `${mockResult.readingScore}/10` },
                { label: "Vocabulaire", grade: mockResult.vocabGrade, detail: `${mockResult.vocabScore}/10` },
                { label: "Speaking", grade: mockResult.speakingGrade, detail: "Auto-éval." },
                { label: "Writing", grade: mockResult.writingGrade, detail: "Auto-éval." },
              ].map((s) => (
                <div key={s.label} className="bg-[#F7F9FC] rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.detail}</p>
                  </div>
                  <GradeBadge grade={s.grade} />
                </div>
              ))}
            </div>

            <Link
              href="/mock-exam"
              className="text-xs font-semibold text-[#009DA1] hover:underline"
            >
              Refaire l'examen blanc →
            </Link>
          </div>
        ) : (
          <div className="bg-[#F7F9FC] border border-dashed border-gray-300 rounded-2xl p-5 mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#0B1E4B] text-sm mb-0.5">Examen blanc OET</p>
              <p className="text-xs text-gray-400">Testez vos 4 compétences en conditions d'examen</p>
            </div>
            <Link
              href="/mock-exam"
              className="flex-shrink-0 bg-[#0B1E4B] hover:bg-[#152960] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              Commencer →
            </Link>
          </div>
        )}

        {/* ── Assessment ── */}
        {assessment ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-[#0B1E4B] text-sm">Évaluation de niveau</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(assessment.completedAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#009DA1]">{assessment.level}</p>
                <p className="text-xs text-gray-400">{assessment.score}/100</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {(Object.entries(assessment.breakdown) as [string, string][]).map(([key, val]) => {
                const [num, den] = val.split("/").map(Number);
                const pct = Math.round((num / den) * 100);
                const labels: Record<string, string> = { vocabulary: "Vocabulaire médical", reading: "Compréhension écrite", grammar: "Grammaire" };
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{labels[key] ?? key}</span>
                      <span className="font-semibold text-[#0B1E4B]">{val}</span>
                    </div>
                    <Bar pct={pct} />
                  </div>
                );
              })}
            </div>
            <Link href="/assessment" className="mt-3 inline-block text-xs font-semibold text-[#009DA1] hover:underline">
              Refaire l'évaluation →
            </Link>
          </div>
        ) : (
          <div className="bg-[#F7F9FC] border border-dashed border-gray-300 rounded-2xl p-5 mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#0B1E4B] text-sm mb-0.5">Évaluation de niveau</p>
              <p className="text-xs text-gray-400">Connaissez votre niveau A2 / B1 / B2 pour personnaliser votre plan</p>
            </div>
            <Link
              href="/assessment"
              className="flex-shrink-0 bg-[#00C2C7] hover:bg-[#009DA1] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              Passer le test →
            </Link>
          </div>
        )}

        {/* ── Recommendations ── */}
        <div className="bg-[#0B1E4B] rounded-2xl p-5 mb-6">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Priorités recommandées</p>
          <ul className="space-y-2">
            {skills
              .filter((s) => s.count < s.total)
              .slice(0, 3)
              .map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{s.icon}</span>
                    <span className="text-sm text-white/80 truncate">
                      {s.label} — {s.total - s.count} exercice{s.total - s.count > 1 ? "s" : ""} restant{s.total - s.count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <Link
                    href={s.href}
                    className="flex-shrink-0 text-xs font-semibold text-[#00C2C7] hover:text-white transition-colors whitespace-nowrap"
                  >
                    Continuer →
                  </Link>
                </li>
              ))}
            {skills.every((s) => s.count === s.total) && (
              <li className="text-sm text-[#00C2C7] font-semibold">
                Tout le contenu est complété — inscrivez-vous à l'OET officiel !
              </li>
            )}
          </ul>
        </div>

        {/* Footer nav */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/plan"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Mon plan OET
          </Link>
          <Link
            href="/readiness"
            className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Score de préparation →
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
          <Link href="/readiness" className="hover:text-[#0B1E4B] transition-colors">Mon score</Link>
          <Link href="/daily-practice" className="hover:text-[#0B1E4B] transition-colors">Routine du jour</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
