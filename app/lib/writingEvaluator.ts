/* ─── OET Writing AI Evaluator ──────────────────────────────────
 *
 * Client-side helper that calls /api/evaluate-writing.
 * All AI work happens server-side; this file only handles types
 * and the fetch call so WritingClient stays clean.
 */

export const AI_EVAL_STORAGE_KEY = "oet_writing_ai_evals";

export type OETGrade = "A" | "B" | "C+" | "C" | "D";

export type ScoreBreakdown = {
  purpose: number;            // 0–10
  contentSelection: number;   // 0–10
  conciseness: number;        // 0–10
  genreStyle: number;         // 0–10
  organisation: number;       // 0–10
  languageAccuracy: number;   // 0–10
};

export type GrammarMistake = {
  original: string;
  correction: string;
  explanation: string;
};

export type AIWritingEval = {
  grade: OETGrade;
  breakdown: ScoreBreakdown;
  strengths: string[];
  improvements: string[];
  grammarMistakes: GrammarMistake[];
  improvedVersion: string;
  evaluatedAt: string;  // ISO timestamp
};

export type EvalRequest = {
  scenarioId: string;
  patientNotes: string;
  task: string;
  draft: string;
};

export type EvalResponse =
  | { configured: false }
  | { configured: true; result: AIWritingEval }
  | { configured: true; error: string };

export const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, string> = {
  purpose:          "Objectif de la lettre",
  contentSelection: "Sélection du contenu",
  conciseness:      "Concision et clarté",
  genreStyle:       "Genre et style",
  organisation:     "Organisation et mise en page",
  languageAccuracy: "Précision linguistique",
};

export const GRADE_COLOR: Record<OETGrade, { bg: string; text: string; border: string }> = {
  A:   { bg: "bg-[#0B1E4B]",    text: "text-white",        border: "border-[#0B1E4B]" },
  B:   { bg: "bg-[#00C2C7]/15", text: "text-[#009DA1]",    border: "border-[#00C2C7]/40" },
  "C+":{ bg: "bg-yellow-50",    text: "text-yellow-700",   border: "border-yellow-200" },
  C:   { bg: "bg-orange-50",    text: "text-orange-700",   border: "border-orange-200" },
  D:   { bg: "bg-red-50",       text: "text-red-600",      border: "border-red-200" },
};

export async function evaluateWriting(req: EvalRequest): Promise<EvalResponse> {
  const res = await fetch("/api/evaluate-writing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const text = await res.text();
    return { configured: true, error: `Server error (${res.status}): ${text.slice(0, 200)}` };
  }
  return res.json() as Promise<EvalResponse>;
}

/** Derive a 0–100 quality score from an AI eval for readiness scoring */
export function aiEvalQualityScore(eval_: AIWritingEval): number {
  const { breakdown } = eval_;
  const values = Object.values(breakdown);
  const avg = values.reduce((a, b) => a + b, 0) / values.length; // 0–10
  return Math.round(avg * 10); // 0–100
}
