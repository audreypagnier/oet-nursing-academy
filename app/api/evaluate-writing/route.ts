import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { AIWritingEval, EvalResponse, OETGrade, ScoreBreakdown, GrammarMistake } from "../../lib/writingEvaluator";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are an expert OET (Occupational English Test) Writing examiner for nurses.
You evaluate referral letters using the six official OET Writing sub-criteria.

IMPORTANT: Respond ONLY with valid JSON. Do not include markdown, code blocks, or any text outside the JSON object.

Return exactly this structure:
{
  "grade": "A" | "B" | "C+" | "C" | "D",
  "breakdown": {
    "purpose": 0-10,
    "contentSelection": 0-10,
    "conciseness": 0-10,
    "genreStyle": 0-10,
    "organisation": 0-10,
    "languageAccuracy": 0-10
  },
  "strengths": ["string", ...],
  "improvements": ["string", ...],
  "grammarMistakes": [
    { "original": "...", "correction": "...", "explanation": "..." }
  ],
  "improvedVersion": "full improved letter text"
}

Grading guide (based on overall quality and breakdown average):
- A: Exceptional — near-perfect across all criteria (avg 8.5–10)
- B: Good — minor issues in one or two areas (avg 7–8.4)
- C+: Adequate — some issues across criteria (avg 5.5–6.9)
- C: Below standard — significant issues (avg 4–5.4)
- D: Poor — major problems throughout (avg 0–3.9)

Evaluate honestly and constructively. Provide 2–4 strengths, 2–4 improvements, and 1–3 grammar mistakes (only real ones — skip if the letter is excellent). The improved version should be a complete, polished referral letter.`;

export async function POST(req: NextRequest): Promise<NextResponse<EvalResponse>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ configured: false });
  }

  let body: { scenarioId?: string; patientNotes?: string; task?: string; draft?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ configured: true, error: "Invalid request body" }, { status: 400 });
  }

  const { patientNotes, task, draft } = body;
  if (!draft || draft.trim().length < 50) {
    return NextResponse.json({ configured: true, error: "Draft is too short to evaluate" }, { status: 400 });
  }

  const userMessage = `Please evaluate this OET Writing submission.

PATIENT NOTES:
${patientNotes ?? "(not provided)"}

WRITING TASK:
${task ?? "(not provided)"}

CANDIDATE'S LETTER:
${draft}

Evaluate the letter against the six OET Writing sub-criteria and return your assessment as JSON.`;

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Strip any markdown code fences if present
    const jsonText = rawText.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    let parsed: {
      grade: OETGrade;
      breakdown: ScoreBreakdown;
      strengths: string[];
      improvements: string[];
      grammarMistakes: GrammarMistake[];
      improvedVersion: string;
    };

    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { configured: true, error: `AI returned non-JSON response: ${rawText.slice(0, 200)}` },
        { status: 500 }
      );
    }

    const result: AIWritingEval = {
      ...parsed,
      evaluatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ configured: true, result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ configured: true, error: msg }, { status: 500 });
  }
}
