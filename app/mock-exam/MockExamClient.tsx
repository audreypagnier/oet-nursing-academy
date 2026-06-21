"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────── */

type Screen = "intro" | "reading" | "vocabulary" | "speaking" | "writing" | "results";
type SelfRating = "difficulty" | "well" | "very-well";
type Grade = "A" | "B" | "C" | "D";

/* ─── Reading — clinical passage + 10 questions ──────────────── */

const READING_PASSAGE = `Mr. Gerald Hartley, 71 years old, was admitted to the respiratory ward on 14 March with a four-day history of productive cough, fever, and increasing breathlessness. He reported bringing up yellow-green sputum and rated his dyspnoea as 7/10 at rest. His past medical history includes type 2 diabetes mellitus, hypertension, and a 35 pack-year smoking history. His regular medications on admission were metformin 1 g twice daily, amlodipine 10 mg once daily, and atorvastatin 40 mg at night.

On assessment, his temperature was 38.9°C, HR 102 bpm, BP 136/84 mmHg, RR 24 breaths/min, and SpO2 91% on room air. Chest auscultation revealed decreased air entry and coarse crackles over the right lower lobe. A chest X-ray confirmed consolidation in the right lower lobe, consistent with community-acquired pneumonia (CAP).

Blood results showed: WBC 15.4 × 10⁹/L, CRP 148 mg/L, serum creatinine 112 µmol/L (baseline 88 µmol/L), and blood glucose 14.2 mmol/L. A sputum sample was sent for culture and sensitivity. The CURB-65 score was calculated as 3, indicating severe CAP requiring hospital admission.

Mr. Hartley was commenced on supplemental oxygen at 2 L/min via nasal cannula to target SpO2 94–98%, IV co-amoxiclav 1.2 g three times daily and clarithromycin 500 mg twice daily as per CAP protocol. His blood glucose was monitored four times daily given his diabetes and the likely steroid-induced hyperglycaemia risk if corticosteroids were required. A fluid balance chart was initiated. He was encouraged to use an incentive spirometer hourly while awake.

By day 3, his temperature had normalised to 37.2°C and his WBC had decreased to 10.8 × 10⁹/L. However, a repeat serum creatinine of 138 µmol/L raised concern for worsening acute kidney injury (AKI), and the nephrology team was consulted. Antibiotics were changed to oral co-amoxiclav and clarithromycin once he was tolerating diet and fluids. Physiotherapy was involved to assist with sputum clearance and early mobilisation.

On day 6, Mr. Hartley was clinically improved with SpO2 95% on room air, RR 16 breaths/min, and no fever for 48 hours. His creatinine had improved to 101 µmol/L following IV fluid resuscitation. He was discharged home with a 5-day course of oral antibiotics, a smoking cessation referral, a follow-up chest X-ray in six weeks, and a letter to his GP summarising the admission.`;

const READING_QUESTIONS = [
  {
    id: "rq1",
    question: "What was Mr. Hartley's SpO2 on room air at admission?",
    options: ["94%", "91%", "88%", "95%"],
    correct: 1,
  },
  {
    id: "rq2",
    question: "Which investigation confirmed the diagnosis of pneumonia?",
    options: ["CT scan of the thorax", "Sputum culture result", "Chest X-ray showing right lower lobe consolidation", "Blood gas analysis"],
    correct: 2,
  },
  {
    id: "rq3",
    question: "What does a CURB-65 score of 3 indicate?",
    options: ["Mild CAP suitable for home treatment", "Moderate CAP requiring GP review", "Severe CAP requiring hospital admission", "Critical CAP requiring ICU admission"],
    correct: 2,
  },
  {
    id: "rq4",
    question: "Why was blood glucose monitored four times daily?",
    options: [
      "Mr. Hartley had poor compliance with metformin",
      "His admission glucose of 14.2 mmol/L indicated new-onset type 1 diabetes",
      "Due to his diabetes and the risk of hyperglycaemia if corticosteroids were required",
      "IV co-amoxiclav causes hypoglycaemia",
    ],
    correct: 2,
  },
  {
    id: "rq5",
    question: "What finding on day 3 prompted a nephrology consultation?",
    options: [
      "His WBC remained elevated above 15",
      "His creatinine had risen from 112 to 138 µmol/L, suggesting worsening AKI",
      "He developed a new fever",
      "His oxygen requirements increased",
    ],
    correct: 1,
  },
  {
    id: "rq6",
    question: "What criterion was used to switch Mr. Hartley from IV to oral antibiotics?",
    options: [
      "His creatinine returned to baseline",
      "He had been afebrile for 48 hours",
      "He was tolerating diet and fluids",
      "His WBC normalised completely",
    ],
    correct: 2,
  },
  {
    id: "rq7",
    question: "What is the purpose of the incentive spirometer?",
    options: [
      "To measure oxygen saturation continuously",
      "To encourage deep breathing and prevent atelectasis",
      "To deliver nebulised medication",
      "To monitor respiratory rate automatically",
    ],
    correct: 1,
  },
  {
    id: "rq8",
    question: "Which of Mr. Hartley's pre-existing conditions is most directly relevant to his pneumonia risk?",
    options: [
      "Hypertension",
      "Atorvastatin use",
      "35 pack-year smoking history",
      "Amlodipine use",
    ],
    correct: 2,
  },
  {
    id: "rq9",
    question: "What does the CRP result of 148 mg/L indicate?",
    options: [
      "Normal inflammatory response",
      "Significant systemic inflammation consistent with infection",
      "Chronic inflammatory disease",
      "Autoimmune condition",
    ],
    correct: 1,
  },
  {
    id: "rq10",
    question: "What was included in Mr. Hartley's discharge plan? Select the most complete answer.",
    options: [
      "Oral antibiotics and a follow-up chest X-ray only",
      "Oral antibiotics, smoking cessation referral, 6-week chest X-ray, and a GP summary letter",
      "IV antibiotics to continue at home via district nursing",
      "Physiotherapy referral and a repeat blood test in two weeks",
    ],
    correct: 1,
  },
];

/* ─── Vocabulary — 10 MCQs ────────────────────────────────────── */

const VOCAB_QUESTIONS = [
  {
    id: "vq1",
    question: "A patient is described as 'diaphoretic'. What does this mean?",
    options: ["Confused and disoriented", "Sweating profusely", "Unable to speak clearly", "Experiencing chest pain"],
    correct: 1,
  },
  {
    id: "vq2",
    question: "What does 'dysphagia' refer to?",
    options: ["Difficulty breathing", "Difficulty swallowing", "Difficulty walking", "Difficulty speaking"],
    correct: 1,
  },
  {
    id: "vq3",
    question: "Which term describes an abnormally low level of sodium in the blood?",
    options: ["Hyperkalaemia", "Hypocalcaemia", "Hyponatraemia", "Hyperglycaemia"],
    correct: 2,
  },
  {
    id: "vq4",
    question: "A wound is described as showing 'erythema'. What is present?",
    options: ["Bleeding", "Redness", "Swelling filled with fluid", "A foul odour"],
    correct: 1,
  },
  {
    id: "vq5",
    question: "What does 'nil by mouth' (NBM) mean in a clinical context?",
    options: [
      "The patient may drink water only",
      "The patient should not eat or drink anything",
      "The patient is on a liquid diet",
      "The patient cannot speak",
    ],
    correct: 1,
  },
  {
    id: "vq6",
    question: "A patient's notes mention 'bilateral oedema of the lower limbs'. What does this describe?",
    options: [
      "Pain in both legs",
      "Weakness in both legs",
      "Swelling in both legs due to fluid accumulation",
      "Numbness in both feet",
    ],
    correct: 2,
  },
  {
    id: "vq7",
    question: "What does 'PRN' mean when written on a medication chart?",
    options: [
      "Administer at night only",
      "Administer immediately",
      "Administer as required / when needed",
      "Administer twice daily",
    ],
    correct: 2,
  },
  {
    id: "vq8",
    question: "What is 'haemoptysis'?",
    options: [
      "Vomiting blood",
      "Coughing up blood",
      "Blood in the urine",
      "Bleeding from a wound",
    ],
    correct: 1,
  },
  {
    id: "vq9",
    question: "Which term describes a heart rate below 60 beats per minute?",
    options: ["Tachycardia", "Bradycardia", "Arrhythmia", "Atrial fibrillation"],
    correct: 1,
  },
  {
    id: "vq10",
    question: "In nursing documentation, what does 'c/o' stand for?",
    options: ["Care of", "Complains of", "Checked on", "Course of"],
    correct: 1,
  },
];

/* ─── Speaking scenario ───────────────────────────────────────── */

const SPEAKING_SCENARIO = {
  title: "Patient Concerns About Discharge",
  context:
    "You are a registered nurse on a surgical ward. Mrs. Amara Diallo, 58, had an appendectomy two days ago. She is medically fit for discharge today, but she has expressed anxiety about going home. She lives alone and is concerned about managing her pain and wound care independently.",
  task: "Speak with Mrs. Diallo for approximately 5 minutes. You should:\n• Acknowledge her concerns empathetically\n• Explain her discharge medications and pain management plan\n• Provide clear instructions for wound care at home\n• Explain which symptoms should prompt her to seek urgent help\n• Confirm she has contact numbers for the ward and her GP",
  keyPhrases: [
    "I understand you're feeling worried about going home — that's completely normal.",
    "I'd like to go through your discharge medications with you now.",
    "The wound dressing should be changed every two to three days.",
    "If you notice increased redness, swelling, or any discharge from the wound, please contact us or your GP.",
    "Is there anything you'd like me to go over again before you leave?",
  ],
};

/* ─── Writing scenario ────────────────────────────────────────── */

const WRITING_SCENARIO = {
  title: "Referral Letter — Hypertension Management",
  patientSummary:
    "Mr. John Ellsworth, 64 years old. Admitted 18 March following a hypertensive urgency (BP 198/112 mmHg on arrival). No end-organ damage identified. Currently managed with amlodipine 10 mg OD and ramipril 5 mg OD (started on admission). Discharged today, 21 March. BP at discharge: 154/88 mmHg. Advised to monitor BP at home daily. No known drug allergies. Non-smoker. No known diabetes. Follow-up required with community hypertension nurse.",
  task: "Write a referral letter from the hospital ward nurse to the community hypertension nurse. Your letter should be approximately 180–200 words and include all relevant clinical information from the patient notes above.",
  keyPoints: [
    "Patient's age, diagnosis, and presenting BP",
    "Investigations performed and findings (no end-organ damage)",
    "Current antihypertensive medications and doses",
    "BP at discharge",
    "Home monitoring advice given",
    "Action required: follow-up appointment with community hypertension nurse",
  ],
  modelOpening:
    "Dear Hypertension Nurse,\n\nRe: Mr. John Ellsworth, DOB [XX/XX/XXXX]\n\nI am writing to refer the above patient who was recently discharged from our ward following a hypertensive urgency...",
};

/* ─── Grade helpers ───────────────────────────────────────────── */

const GRADE_CONFIG: Record<Grade, { label: string; color: string; bg: string; border: string; badge: string; oet: string; desc: string }> = {
  A: { label: "A", color: "text-[#0B1E4B]", bg: "bg-[#0B1E4B]/5", border: "border-[#0B1E4B]/20", badge: "bg-[#0B1E4B]/10 text-[#0B1E4B]", oet: "450+ / 500", desc: "Excellent — au-dessus du seuil requis" },
  B: { label: "B", color: "text-[#009DA1]", bg: "bg-[#00C2C7]/10", border: "border-[#00C2C7]/30", badge: "bg-[#00C2C7]/15 text-[#009DA1]", oet: "350–449 / 500", desc: "Bien — seuil minimum atteint" },
  C: { label: "C", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", badge: "bg-yellow-100 text-yellow-700", oet: "300–349 / 500", desc: "En dessous du seuil — progression requise" },
  D: { label: "< C", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", oet: "< 300 / 500", desc: "Travail de fond nécessaire" },
};

function scoreToGrade(correct: number, total: number): Grade {
  const pct = correct / total;
  if (pct >= 0.9) return "A";
  if (pct >= 0.7) return "B";
  if (pct >= 0.5) return "C";
  return "D";
}

function ratingToGrade(r: SelfRating): Grade {
  if (r === "very-well") return "A";
  if (r === "well") return "B";
  return "C";
}

function overallGrade(grades: Grade[]): Grade {
  const map: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1 };
  const avg = grades.reduce((s, g) => s + map[g], 0) / grades.length;
  if (avg >= 3.5) return "A";
  if (avg >= 2.5) return "B";
  if (avg >= 1.5) return "C";
  return "D";
}

/* ─── Component ───────────────────────────────────────────────── */

export default function MockExamClient() {
  const [screen, setScreen] = useState<Screen>("intro");

  // Reading
  const [readingAnswers, setReadingAnswers] = useState<Record<string, number>>({});
  const [readingSubmitted, setReadingSubmitted] = useState(false);

  // Vocabulary
  const [vocabAnswers, setVocabAnswers] = useState<Record<string, number>>({});
  const [vocabSubmitted, setVocabSubmitted] = useState(false);

  // Speaking / Writing self-rating
  const [speakingRating, setSpeakingRating] = useState<SelfRating | null>(null);
  const [writingRating, setWritingRating] = useState<SelfRating | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Compute grades (only after results screen)
  const readingCorrect = READING_QUESTIONS.filter((q) => readingAnswers[q.id] === q.correct).length;
  const vocabCorrect = VOCAB_QUESTIONS.filter((q) => vocabAnswers[q.id] === q.correct).length;
  const readingGrade = scoreToGrade(readingCorrect, READING_QUESTIONS.length);
  const vocabGrade = scoreToGrade(vocabCorrect, VOCAB_QUESTIONS.length);
  const speakingGrade = ratingToGrade(speakingRating ?? "well");
  const writingGrade = ratingToGrade(writingRating ?? "well");
  const overall = overallGrade([readingGrade, vocabGrade, speakingGrade, writingGrade]);

  function saveResult() {
    try {
      localStorage.setItem(
        "oet_mock_exam_result",
        JSON.stringify({
          date: new Date().toISOString(),
          readingScore: readingCorrect,
          vocabScore: vocabCorrect,
          readingGrade,
          vocabGrade,
          speakingGrade,
          writingGrade,
          overall,
        })
      );
    } catch {}
  }

  /* ── INTRO ───────────────────────────────────────────────────── */
  if (screen === "intro") {
    return (
      <Shell step={null}>
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Mini Examen Blanc</p>
            <h1 className="text-2xl font-bold text-[#0B1E4B] mb-3">Simulation OET Nursing</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Testez votre niveau sur 4 compétences OET. À la fin, vous recevrez un résultat estimé avec des grades par compétence.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {[
              { icon: "📄", label: "Reading", detail: "10 questions sur un texte clinique", time: "15 min" },
              { icon: "📖", label: "Vocabulaire", detail: "10 questions à choix multiples", time: "10 min" },
              { icon: "🎙️", label: "Speaking", detail: "1 scénario de consultation à simuler", time: "5 min" },
              { icon: "✍️", label: "Writing", detail: "1 lettre de référence à rédiger", time: "15 min" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center gap-4">
                <span className="text-2xl w-8 text-center flex-shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-[#0B1E4B] text-sm">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.detail}</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full flex-shrink-0">{s.time}</span>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 flex gap-3 items-start">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-700 leading-relaxed">
              Prenez le temps de lire chaque texte attentivement. Le Speaking et le Writing sont auto-évalués — soyez honnête sur votre niveau.
            </p>
          </div>

          <button
            onClick={() => setScreen("reading")}
            className="w-full bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-4 rounded-2xl transition-colors text-sm"
          >
            Commencer l'examen blanc →
          </button>
        </div>
      </Shell>
    );
  }

  /* ── READING ─────────────────────────────────────────────────── */
  if (screen === "reading") {
    const allAnswered = READING_QUESTIONS.every((q) => readingAnswers[q.id] !== undefined);

    return (
      <Shell step={1}>
        <div className="w-full max-w-2xl mx-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#009DA1] uppercase tracking-wider mb-1">Section 1 — Reading</p>
            <h2 className="text-xl font-bold text-[#0B1E4B]">Compréhension d'un texte clinique</h2>
            <p className="text-sm text-gray-400 mt-1">Lisez attentivement le texte, puis répondez aux 10 questions.</p>
          </div>

          {/* Passage */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Texte clinique</p>
            {READING_PASSAGE.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">{para}</p>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-5 mb-6">
            {READING_QUESTIONS.map((q, qi) => {
              const chosen = readingAnswers[q.id];
              const answered = readingSubmitted && chosen !== undefined;

              return (
                <div key={q.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-[#0B1E4B] mb-3">
                    {qi + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      let style = "border border-gray-200 text-gray-700 hover:border-[#00C2C7] hover:bg-[#00C2C7]/5";
                      if (readingSubmitted) {
                        if (oi === q.correct) style = "border border-[#00C2C7] bg-[#00C2C7]/10 text-[#007A7E] font-medium";
                        else if (oi === chosen && chosen !== q.correct) style = "border border-red-300 bg-red-50 text-red-600";
                        else style = "border border-gray-100 text-gray-400";
                      } else if (chosen === oi) {
                        style = "border border-[#0B1E4B] bg-[#0B1E4B]/5 text-[#0B1E4B] font-medium";
                      }
                      return (
                        <button
                          key={oi}
                          disabled={readingSubmitted}
                          onClick={() => setReadingAnswers((p) => ({ ...p, [q.id]: oi }))}
                          className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all ${style}`}
                        >
                          <span className="font-semibold mr-2 text-gray-400">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <p className={`mt-2 text-xs px-3 py-2 rounded-xl ${chosen === q.correct ? "bg-[#00C2C7]/10 text-[#007A7E]" : "bg-red-50 text-red-600"}`}>
                      {chosen === q.correct ? "✓ Correct" : `✗ Incorrect — bonne réponse : ${String.fromCharCode(65 + q.correct)}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!readingSubmitted ? (
            <button
              disabled={!allAnswered}
              onClick={() => setReadingSubmitted(true)}
              className={`w-full font-semibold py-4 rounded-2xl transition-colors text-sm ${
                allAnswered
                  ? "bg-[#0B1E4B] hover:bg-[#152960] text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {allAnswered ? "Soumettre Reading →" : `${Object.keys(readingAnswers).length} / 10 réponses`}
            </button>
          ) : (
            <div className="space-y-3">
              <div className={`rounded-2xl border px-5 py-4 text-center ${GRADE_CONFIG[readingGrade].bg} ${GRADE_CONFIG[readingGrade].border}`}>
                <p className="text-xs text-gray-500 mb-1">Score Reading</p>
                <p className={`text-3xl font-bold ${GRADE_CONFIG[readingGrade].color}`}>{readingCorrect} / 10</p>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${GRADE_CONFIG[readingGrade].badge}`}>
                  Grade estimé : {GRADE_CONFIG[readingGrade].label}
                </span>
              </div>
              <button
                onClick={() => setScreen("vocabulary")}
                className="w-full bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-4 rounded-2xl transition-colors text-sm"
              >
                Section suivante : Vocabulaire →
              </button>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  /* ── VOCABULARY ──────────────────────────────────────────────── */
  if (screen === "vocabulary") {
    const allAnswered = VOCAB_QUESTIONS.every((q) => vocabAnswers[q.id] !== undefined);

    return (
      <Shell step={2}>
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#009DA1] uppercase tracking-wider mb-1">Section 2 — Vocabulaire</p>
            <h2 className="text-xl font-bold text-[#0B1E4B]">Terminologie médicale</h2>
            <p className="text-sm text-gray-400 mt-1">10 questions sur le vocabulaire clinique OET.</p>
          </div>

          <div className="space-y-4 mb-6">
            {VOCAB_QUESTIONS.map((q, qi) => {
              const chosen = vocabAnswers[q.id];
              const submitted = vocabSubmitted;

              return (
                <div key={q.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-[#0B1E4B] mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      let style = "border border-gray-200 text-gray-700 hover:border-[#00C2C7] hover:bg-[#00C2C7]/5";
                      if (submitted) {
                        if (oi === q.correct) style = "border border-[#00C2C7] bg-[#00C2C7]/10 text-[#007A7E] font-medium";
                        else if (oi === chosen && chosen !== q.correct) style = "border border-red-300 bg-red-50 text-red-600";
                        else style = "border border-gray-100 text-gray-400";
                      } else if (chosen === oi) {
                        style = "border border-[#0B1E4B] bg-[#0B1E4B]/5 text-[#0B1E4B] font-medium";
                      }
                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() => setVocabAnswers((p) => ({ ...p, [q.id]: oi }))}
                          className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all ${style}`}
                        >
                          <span className="font-semibold mr-2 text-gray-400">{String.fromCharCode(65 + oi)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p className={`mt-2 text-xs px-3 py-2 rounded-xl ${chosen === q.correct ? "bg-[#00C2C7]/10 text-[#007A7E]" : "bg-red-50 text-red-600"}`}>
                      {chosen === q.correct ? "✓ Correct" : `✗ Incorrect — bonne réponse : ${String.fromCharCode(65 + q.correct)}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!vocabSubmitted ? (
            <button
              disabled={!allAnswered}
              onClick={() => setVocabSubmitted(true)}
              className={`w-full font-semibold py-4 rounded-2xl transition-colors text-sm ${
                allAnswered
                  ? "bg-[#0B1E4B] hover:bg-[#152960] text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {allAnswered ? "Soumettre Vocabulaire →" : `${Object.keys(vocabAnswers).length} / 10 réponses`}
            </button>
          ) : (
            <div className="space-y-3">
              <div className={`rounded-2xl border px-5 py-4 text-center ${GRADE_CONFIG[vocabGrade].bg} ${GRADE_CONFIG[vocabGrade].border}`}>
                <p className="text-xs text-gray-500 mb-1">Score Vocabulaire</p>
                <p className={`text-3xl font-bold ${GRADE_CONFIG[vocabGrade].color}`}>{vocabCorrect} / 10</p>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${GRADE_CONFIG[vocabGrade].badge}`}>
                  Grade estimé : {GRADE_CONFIG[vocabGrade].label}
                </span>
              </div>
              <button
                onClick={() => setScreen("speaking")}
                className="w-full bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-4 rounded-2xl transition-colors text-sm"
              >
                Section suivante : Speaking →
              </button>
            </div>
          )}
        </div>
      </Shell>
    );
  }

  /* ── SPEAKING ────────────────────────────────────────────────── */
  if (screen === "speaking") {
    return (
      <Shell step={3}>
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#009DA1] uppercase tracking-wider mb-1">Section 3 — Speaking</p>
            <h2 className="text-xl font-bold text-[#0B1E4B]">{SPEAKING_SCENARIO.title}</h2>
            <p className="text-sm text-gray-400 mt-1">Lisez le scénario, pratiquez oralement, puis évaluez votre performance.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contexte</p>
            <p className="text-sm text-gray-700 leading-relaxed">{SPEAKING_SCENARIO.context}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tâche</p>
            {SPEAKING_SCENARIO.task.split("\n").map((line, i) => (
              <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>
            ))}
          </div>

          <div className="bg-[#F7F9FC] border border-gray-100 rounded-2xl p-5 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Phrases utiles</p>
            <ul className="space-y-2">
              {SPEAKING_SCENARIO.keyPhrases.map((phrase, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-[#00C2C7] mt-0.5 flex-shrink-0">›</span>
                  <span className="italic">&ldquo;{phrase}&rdquo;</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <p className="text-sm font-semibold text-[#0B1E4B] mb-4">Comment évaluez-vous votre performance ?</p>
            <div className="space-y-2">
              {([
                ["difficulty", "Difficultés — le vocabulaire ou la structure manquaient"],
                ["well", "Bien — j'ai couvert les points principaux avec quelques hésitations"],
                ["very-well", "Très bien — fluide, professionnel et complet"],
              ] as [SelfRating, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSpeakingRating(val)}
                  className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all ${
                    speakingRating === val
                      ? "border-[#0B1E4B] bg-[#0B1E4B]/5 text-[#0B1E4B] font-medium"
                      : "border-gray-200 text-gray-600 hover:border-[#00C2C7]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!speakingRating}
            onClick={() => setScreen("writing")}
            className={`w-full font-semibold py-4 rounded-2xl transition-colors text-sm ${
              speakingRating
                ? "bg-[#0B1E4B] hover:bg-[#152960] text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Section suivante : Writing →
          </button>
        </div>
      </Shell>
    );
  }

  /* ── WRITING ─────────────────────────────────────────────────── */
  if (screen === "writing") {
    return (
      <Shell step={4}>
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#009DA1] uppercase tracking-wider mb-1">Section 4 — Writing</p>
            <h2 className="text-xl font-bold text-[#0B1E4B]">{WRITING_SCENARIO.title}</h2>
            <p className="text-sm text-gray-400 mt-1">Rédigez votre lettre sur papier ou dans un éditeur, puis évaluez-vous.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Dossier patient</p>
            <p className="text-sm text-gray-700 leading-relaxed">{WRITING_SCENARIO.patientSummary}</p>
          </div>

          <div className="bg-[#0B1E4B] rounded-2xl p-5 mb-4">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Tâche de rédaction</p>
            <p className="text-sm text-white leading-relaxed">{WRITING_SCENARIO.task}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Points clés à inclure</p>
            <ul className="space-y-1.5">
              {WRITING_SCENARIO.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-[#00C2C7]/20 text-[#009DA1] flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setShowModelAnswer(!showModelAnswer)}
            className="w-full text-sm text-[#009DA1] font-semibold border border-[#00C2C7]/40 rounded-2xl py-3 mb-4 hover:bg-[#00C2C7]/5 transition-colors"
          >
            {showModelAnswer ? "Masquer" : "Voir"} l'amorce de lettre modèle
          </button>

          {showModelAnswer && (
            <div className="bg-[#F7F9FC] border border-gray-100 rounded-2xl p-5 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Amorce modèle</p>
              {WRITING_SCENARIO.modelOpening.split("\n").map((line, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed font-mono">{line}</p>
              ))}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <p className="text-sm font-semibold text-[#0B1E4B] mb-4">Comment évaluez-vous votre lettre ?</p>
            <div className="space-y-2">
              {([
                ["difficulty", "Difficultés — structure incomplète ou registre inadapté"],
                ["well", "Bien — tous les points couverts avec quelques imperfections"],
                ["very-well", "Très bien — lettre complète, formelle et bien structurée"],
              ] as [SelfRating, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setWritingRating(val)}
                  className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all ${
                    writingRating === val
                      ? "border-[#0B1E4B] bg-[#0B1E4B]/5 text-[#0B1E4B] font-medium"
                      : "border-gray-200 text-gray-600 hover:border-[#00C2C7]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!writingRating}
            onClick={() => { saveResult(); setScreen("results"); }}
            className={`w-full font-semibold py-4 rounded-2xl transition-colors text-sm ${
              writingRating
                ? "bg-[#00C2C7] hover:bg-[#009DA1] text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Voir mes résultats →
          </button>
        </div>
      </Shell>
    );
  }

  /* ── RESULTS ─────────────────────────────────────────────────── */
  const sections = [
    { label: "Reading", grade: readingGrade, detail: `${readingCorrect}/10 bonnes réponses` },
    { label: "Vocabulaire (Listening proxy)", grade: vocabGrade, detail: `${vocabCorrect}/10 bonnes réponses` },
    { label: "Speaking", grade: speakingGrade, detail: "Auto-évaluation" },
    { label: "Writing", grade: writingGrade, detail: "Auto-évaluation" },
  ];

  return (
    <Shell step={null}>
      <div className="w-full max-w-xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Résultats</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Votre résultat estimé</h1>
        </div>

        {/* Overall */}
        <div className={`rounded-2xl border p-6 mb-5 text-center ${GRADE_CONFIG[overall].bg} ${GRADE_CONFIG[overall].border}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Score global estimé</p>
          <p className={`text-6xl font-bold mb-2 ${GRADE_CONFIG[overall].color}`}>
            {GRADE_CONFIG[overall].label}
          </p>
          <p className="text-sm text-gray-500">{GRADE_CONFIG[overall].oet}</p>
          <p className="text-xs text-gray-400 mt-1">{GRADE_CONFIG[overall].desc}</p>
        </div>

        {/* Per-skill grades */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {sections.map((s) => {
            const cfg = GRADE_CONFIG[s.grade];
            return (
              <div key={s.label} className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border}`}>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold mb-1 ${cfg.color}`}>{cfg.label}</p>
                <p className="text-xs text-gray-400">{cfg.oet}</p>
                <p className="text-xs text-gray-300 mt-0.5">{s.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-5">
          <p className="text-sm font-semibold text-[#0B1E4B] mb-3">Prochaines étapes recommandées</p>
          <ul className="space-y-2">
            {sections
              .filter((s) => s.grade === "C" || s.grade === "D")
              .map((s) => (
                <li key={s.label} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-amber-500 mt-0.5">→</span>
                  <span>Renforcez votre <strong>{s.label}</strong> — c'est votre compétence prioritaire.</span>
                </li>
              ))}
            {sections.every((s) => s.grade === "A" || s.grade === "B") && (
              <li className="text-sm text-[#009DA1] font-medium">
                Excellent résultat ! Inscrivez-vous à l'OET officiel pour valider votre niveau.
              </li>
            )}
            <li className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-[#00C2C7] mt-0.5">→</span>
              <span>Consultez votre <Link href="/readiness" className="text-[#009DA1] font-semibold hover:underline">score de préparation global</Link> pour un bilan complet.</span>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 mb-6 flex gap-3 items-start">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-600">Résultat d'entraînement indicatif.</strong> Ce score est calculé à partir d'un mini-examen d'entraînement. Il ne constitue pas un résultat officiel OET et ne prédit pas avec certitude votre performance à l'examen réel.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setScreen("intro");
              setReadingAnswers({});
              setReadingSubmitted(false);
              setVocabAnswers({});
              setVocabSubmitted(false);
              setSpeakingRating(null);
              setWritingRating(null);
              setShowModelAnswer(false);
            }}
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Recommencer
          </button>
          <Link
            href="/dashboard"
            className="flex-1 text-center bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Tableau de bord →
          </Link>
        </div>
      </div>
    </Shell>
  );
}

/* ─── Shell ───────────────────────────────────────────────────── */

const STEPS = ["Reading", "Vocabulaire", "Speaking", "Writing"];

function Shell({ children, step }: { children: React.ReactNode; step: number | null }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        {step !== null ? (
          <div className="hidden sm:flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                    i + 1 === step
                      ? "bg-[#0B1E4B] text-white"
                      : i + 1 < step
                      ? "bg-[#00C2C7]/20 text-[#009DA1]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s}
                </div>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        ) : (
          <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-500">
            <Link href="/dashboard" className="hover:text-[#0B1E4B] transition-colors">Tableau de bord</Link>
            <Link href="/readiness" className="hover:text-[#0B1E4B] transition-colors">Mon score</Link>
          </nav>
        )}
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
