"use client";

import { useState } from "react";
import Link from "next/link";

/* ─── Storage ─────────────────────────────────────────────────── */

type AssessmentResult = {
  score: number;
  level: string;
  breakdown: { vocabulary: string; reading: string; grammar: string };
  completedAt: string;
};

const STORAGE_KEY = "oet_assessment_result";

function saveToStorage(result: AssessmentResult) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    return true;
  } catch {
    return false;
  }
}

/* ─── Data ────────────────────────────────────────────────────── */

type Question = {
  id: number;
  category: "vocabulary" | "reading" | "grammar";
  question: string;
  options: string[];
  correct: number;
  context?: string;
};

const READING_PASSAGE = `Mr. Chen, 68 ans, a été admis en unité cardiaque suite à un épisode de douleur thoracique et d'essoufflement. Son ECG a révélé une fibrillation auriculaire avec réponse ventriculaire rapide. Un traitement anticoagulant et un contrôle de la fréquence cardiaque ont été initiés. Sa tension artérielle à l'admission était de 145/90 mmHg. L'équipe infirmière a pour instruction de surveiller ses constantes toutes les deux heures et de signaler immédiatement tout changement de son état.`;

const READING_PASSAGE_EN = `Mr. Chen, 68, was admitted to the cardiac unit following an episode of chest pain and shortness of breath. His ECG revealed atrial fibrillation with a rapid ventricular response. Anticoagulation therapy and rate control medication were initiated. His blood pressure on admission was 145/90 mmHg. The nursing team was instructed to monitor his vital signs every two hours and report any changes in his condition immediately.`;

const QUESTIONS: Question[] = [
  // ── Vocabulary (10) ──────────────────────────────────────────
  {
    id: 1,
    category: "vocabulary",
    question: "What does \"tachycardia\" mean?",
    options: ["Slow heart rate", "Fast heart rate", "Irregular heart rate", "Low blood pressure"],
    correct: 1,
  },
  {
    id: 2,
    category: "vocabulary",
    question: "A \"laceration\" is best described as:",
    options: ["A bruise caused by impact", "A clean surgical cut", "A tear or jagged wound in the skin", "A bone fracture"],
    correct: 2,
  },
  {
    id: 3,
    category: "vocabulary",
    question: "\"NPO\" (nil per os) means the patient:",
    options: ["Needs pain medication", "Must not eat or drink", "Is ready for discharge", "Has a known allergy"],
    correct: 1,
  },
  {
    id: 4,
    category: "vocabulary",
    question: "\"Dyspnea\" refers to:",
    options: ["Chest pain", "Difficulty swallowing", "Shortness of breath", "Abnormal heart rhythm"],
    correct: 2,
  },
  {
    id: 5,
    category: "vocabulary",
    question: "The term \"subcutaneous\" describes an injection given:",
    options: ["Into a vein", "Into a muscle", "Under the skin", "Through the lungs"],
    correct: 2,
  },
  {
    id: 6,
    category: "vocabulary",
    question: "\"Edema\" is best described as:",
    options: ["Abnormal fluid accumulation in tissues", "Reduced red blood cell count", "Rapid, shallow breathing", "Low blood glucose"],
    correct: 0,
  },
  {
    id: 7,
    category: "vocabulary",
    question: "An \"analgesic\" is a medication that:",
    options: ["Reduces fever", "Relieves pain", "Fights bacterial infection", "Lowers blood pressure"],
    correct: 1,
  },
  {
    id: 8,
    category: "vocabulary",
    question: "\"Contraindicated\" means a treatment:",
    options: ["Is highly recommended", "Requires close monitoring", "Should not be used in a given situation", "Is still under clinical trial"],
    correct: 2,
  },
  {
    id: 9,
    category: "vocabulary",
    question: "\"Diuresis\" refers to:",
    options: ["Increased urine production", "Decreased blood pressure", "Tissue swelling", "Difficulty breathing"],
    correct: 0,
  },
  {
    id: 10,
    category: "vocabulary",
    question: "What does \"prognosis\" mean?",
    options: ["The cause of a disease", "A list of current symptoms", "The likely outcome of a disease", "A treatment plan"],
    correct: 2,
  },

  // ── Reading comprehension (5) ─────────────────────────────────
  {
    id: 11,
    category: "reading",
    question: "Why was Mr. Chen admitted to hospital?",
    options: [
      "Abdominal pain and nausea",
      "Chest pain and shortness of breath",
      "Dizziness and vomiting",
      "Headache and confusion",
    ],
    correct: 1,
  },
  {
    id: 12,
    category: "reading",
    question: "What cardiac condition was identified on his ECG?",
    options: ["Myocardial infarction", "Ventricular tachycardia", "Atrial fibrillation", "Cardiac arrest"],
    correct: 2,
  },
  {
    id: 13,
    category: "reading",
    question: "Which treatments were started for Mr. Chen?",
    options: [
      "Surgery and physiotherapy",
      "Anticoagulation and rate control medication",
      "Oxygen therapy and diuretics",
      "Antibiotics and steroids",
    ],
    correct: 1,
  },
  {
    id: 14,
    category: "reading",
    question: "How often should the nursing team monitor his vital signs?",
    options: ["Every hour", "Every four hours", "Every two hours", "Every six hours"],
    correct: 2,
  },
  {
    id: 15,
    category: "reading",
    question: "According to the passage, nurses should report:",
    options: [
      "All conversations with the patient",
      "Medication administration times only",
      "Any changes in his condition",
      "Visitor information",
    ],
    correct: 2,
  },

  // ── Grammar (5) ───────────────────────────────────────────────
  {
    id: 16,
    category: "grammar",
    question: "Choose the grammatically correct sentence:",
    options: [
      "The patient will discharged tomorrow.",
      "The patient will be discharged tomorrow.",
      "The patient will being discharged tomorrow.",
      "The patient is discharge tomorrow.",
    ],
    correct: 1,
  },
  {
    id: 17,
    category: "grammar",
    question: "Fill in the blank: \"The medication ___ administered intravenously.\"",
    options: ["were", "was", "be", "being"],
    correct: 1,
  },
  {
    id: 18,
    category: "grammar",
    question: "Which sentence is correct?",
    options: [
      "Please ensure the patient take his medication.",
      "Please ensure the patient is take his medication.",
      "Please ensure the patient takes his medication.",
      "Please ensure the patient taking his medication.",
    ],
    correct: 2,
  },
  {
    id: 19,
    category: "grammar",
    question: "Choose the correct word: \"The doctor asked ___ the patient had any allergies.\"",
    options: ["that", "what", "whether", "who"],
    correct: 2,
  },
  {
    id: 20,
    category: "grammar",
    question: "Which is the most appropriate way to document in a patient chart?",
    options: [
      "He was complaining about pain a lot last night.",
      "I think he might be maybe in pain.",
      "Pain is bad, needs medicine ASAP.",
      "Patient reports pain rated 7/10. Analgesic administered as prescribed.",
    ],
    correct: 3,
  },
];

/* ─── Scoring ─────────────────────────────────────────────────── */

type Level = "A2" | "B1" | "B1+" | "B2";

function getLevel(score: number): Level {
  if (score >= 80) return "B2";
  if (score >= 60) return "B1+";
  if (score >= 40) return "B1";
  return "A2";
}

const LEVEL_CONFIG: Record<Level, { color: string; bg: string; border: string; label: string; desc: string; recs: string[] }> = {
  A2: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    label: "Débutant — A2",
    desc: "Vous avez les bases, mais un renforcement solide est nécessaire avant d'envisager l'OET.",
    recs: [
      "Commencez par consolider le vocabulaire médical de base (corps humain, symptômes courants, traitements)",
      "Travaillez la grammaire anglaise fondamentale : temps, voix passive, modaux",
      "Écoutez des podcasts médicaux en anglais 20 min par jour",
      "Visez le niveau B1 en 3 à 4 mois avec notre programme intensif",
    ],
  },
  B1: {
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    label: "Intermédiaire — B1",
    desc: "Bon niveau de départ. Avec un travail ciblé, le grade B est accessible.",
    recs: [
      "Approfondissez le vocabulaire clinique spécifique aux soins infirmiers",
      "Entraînez-vous à la lecture de cas cliniques et de lettres de transfert",
      "Pratiquez les jeux de rôle patient/soignant en anglais",
      "Planifiez votre OET dans 4 à 6 mois",
    ],
  },
  "B1+": {
    color: "text-[#009DA1]",
    bg: "bg-[#00C2C7]/10",
    border: "border-[#00C2C7]/30",
    label: "Intermédiaire avancé — B1+",
    desc: "Très bon niveau. Vous êtes proche du grade B requis pour l'OET.",
    recs: [
      "Concentrez-vous sur la production écrite : lettres de transfert et de référence",
      "Perfectionnez votre Speaking avec des simulations de consultations",
      "Travaillez la vitesse de lecture pour la partie Reading",
      "L'OET est envisageable dans 2 à 3 mois",
    ],
  },
  B2: {
    color: "text-[#0B1E4B]",
    bg: "bg-[#0B1E4B]/5",
    border: "border-[#0B1E4B]/20",
    label: "Avancé — B2",
    desc: "Excellent niveau. Vous avez le profil pour passer l'OET rapidement.",
    recs: [
      "Familiarisez-vous avec le format exact de chaque épreuve OET",
      "Faites des examens blancs chronométrés pour vous habituer aux conditions réelles",
      "Affinez votre style de rédaction pour la lettre de transfert",
      "Vous pouvez envisager l'OET dans les 4 à 8 semaines",
    ],
  },
};

/* ─── Component ───────────────────────────────────────────────── */

type Screen = "intro" | "quiz" | "results";

export default function AssessmentClient() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saved, setSaved] = useState(false);

  const question = QUESTIONS[current];
  const isReading = question?.category === "reading";
  const totalQuestions = QUESTIONS.length;
  const progress = ((current) / totalQuestions) * 100;

  function handleSelect(idx: number) {
    if (confirmed) return;
    setSelected(idx);
  }

  function handleConfirm() {
    if (selected === null) return;
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    setConfirmed(true);
  }

  function handleNext() {
    if (current + 1 >= totalQuestions) {
      setScreen("results");
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setConfirmed(false);
    }
  }

  function restart() {
    setScreen("intro");
    setCurrent(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSelected(null);
    setConfirmed(false);
    setSaved(false);
  }

  function handleSave() {
    const vocabCorrect = answers.slice(0, 10).filter((a, i) => a === QUESTIONS[i].correct).length;
    const readCorrect = answers.slice(10, 15).filter((a, i) => a === QUESTIONS[10 + i].correct).length;
    const gramCorrect = answers.slice(15, 20).filter((a, i) => a === QUESTIONS[15 + i].correct).length;
    const result: AssessmentResult = {
      score,
      level,
      breakdown: {
        vocabulary: `${vocabCorrect}/10`,
        reading: `${readCorrect}/5`,
        grammar: `${gramCorrect}/5`,
      },
      completedAt: new Date().toISOString(),
    };
    const ok = saveToStorage(result);
    if (ok) setSaved(true);
  }

  const score = Math.round(
    (answers.filter((a, i) => a === QUESTIONS[i].correct).length / totalQuestions) * 100
  );
  const level = getLevel(score);
  const cfg = LEVEL_CONFIG[level];

  /* ── Intro ── */
  if (screen === "intro") {
    return (
      <div className="min-h-screen bg-[#0B1E4B] flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-xl w-full text-center">
            <div className="inline-flex items-center gap-2 bg-[#00C2C7]/15 border border-[#00C2C7]/30 text-[#00C2C7] text-sm font-medium px-4 py-2 rounded-full mb-8">
              Gratuit · 10 minutes · 20 questions
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Évaluez votre niveau<br />
              <span className="text-[#00C2C7]">d&apos;anglais médical</span>
            </h1>
            <p className="text-white/70 leading-relaxed mb-10">
              Ce test évalue votre vocabulaire clinique, votre compréhension écrite
              et votre grammaire en contexte infirmier. Vous recevrez un niveau (A2 → B2)
              et des recommandations personnalisées.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { n: "10", label: "Vocabulaire médical" },
                { n: "5", label: "Compréhension écrite" },
                { n: "5", label: "Grammaire soins" },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-2xl font-bold text-[#00C2C7]">{item.n}</p>
                  <p className="text-xs text-white/60 mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setScreen("quiz")}
              className="w-full bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-4 rounded-full transition-colors text-base"
            >
              Commencer le test →
            </button>
            <p className="text-white/40 text-xs mt-4">
              Questions originales — aucun contenu officiel OET
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz ── */
  if (screen === "quiz") {
    const categoryLabel: Record<Question["category"], string> = {
      vocabulary: "Vocabulaire médical",
      reading: "Compréhension écrite",
      grammar: "Grammaire",
    };

    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <TopBar light />

        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-[#00C2C7] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <div className="w-full max-w-2xl">
            {/* Counter + category */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-[#00C2C7] bg-[#00C2C7]/10 px-3 py-1 rounded-full">
                {categoryLabel[question.category]}
              </span>
              <span className="text-sm text-gray-400">
                {current + 1} / {totalQuestions}
              </span>
            </div>

            {/* Reading passage */}
            {isReading && current === 10 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-sm leading-relaxed text-gray-700">
                <p className="text-xs font-semibold text-[#00C2C7] uppercase tracking-wider mb-3">
                  Texte de référence (questions 11 à 15)
                </p>
                <p className="italic text-gray-500 mb-2 text-xs">Traduction du passage :</p>
                <p className="mb-3">{READING_PASSAGE}</p>
                <hr className="my-3 border-gray-100" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Texte original en anglais :
                </p>
                <p className="text-[#0B1E4B] font-medium">{READING_PASSAGE_EN}</p>
              </div>
            )}
            {isReading && current > 10 && (
              <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 text-sm text-[#0B1E4B]">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Passage (EN)
                </p>
                <p>{READING_PASSAGE_EN}</p>
              </div>
            )}

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-lg font-semibold text-[#0B1E4B] mb-6 leading-snug">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  let cls =
                    "w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ";
                  if (!confirmed) {
                    cls +=
                      selected === idx
                        ? "border-[#00C2C7] bg-[#00C2C7]/10 text-[#0B1E4B]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#00C2C7]/50 hover:bg-gray-50";
                  } else {
                    if (idx === question.correct) {
                      cls += "border-green-400 bg-green-50 text-green-800";
                    } else if (idx === selected && selected !== question.correct) {
                      cls += "border-red-300 bg-red-50 text-red-700";
                    } else {
                      cls += "border-gray-100 bg-white text-gray-400";
                    }
                  }
                  return (
                    <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center flex-shrink-0 text-xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                        {confirmed && idx === question.correct && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                        {confirmed && idx === selected && selected !== question.correct && (
                          <span className="ml-auto text-red-500">✗</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3">
                {!confirmed ? (
                  <button
                    onClick={handleConfirm}
                    disabled={selected === null}
                    className="flex-1 bg-[#0B1E4B] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3.5 rounded-xl transition-colors hover:bg-[#152960]"
                  >
                    Valider
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    {current + 1 >= totalQuestions ? "Voir mes résultats →" : "Question suivante →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Results ── */
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <TopBar light />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          {/* Score card */}
          <div className={`rounded-2xl border p-8 mb-6 text-center ${cfg.bg} ${cfg.border}`}>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Résultat
            </p>
            <div className="relative inline-block mb-4">
              <svg className="w-32 h-32" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#00C2C7"
                  strokeWidth="2.5"
                  strokeDasharray={`${score} 100`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-[#0B1E4B]">{score}</span>
                <span className="text-xs text-gray-400">/ 100</span>
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${cfg.color}`}>{cfg.label}</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">{cfg.desc}</p>
          </div>

          {/* Score breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-[#0B1E4B] mb-4">Détail par compétence</h3>
            {(
              [
                { cat: "vocabulary", label: "Vocabulaire médical", total: 10, start: 0 },
                { cat: "reading", label: "Compréhension écrite", total: 5, start: 10 },
                { cat: "grammar", label: "Grammaire", total: 5, start: 15 },
              ] as const
            ).map(({ cat, label, total, start }) => {
              const correct = answers
                .slice(start, start + total)
                .filter((a, i) => a === QUESTIONS[start + i].correct).length;
              const pct = Math.round((correct / total) * 100);
              return (
                <div key={cat} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">{label}</span>
                    <span className="text-[#0B1E4B] font-semibold">
                      {correct}/{total}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00C2C7] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-[#0B1E4B] mb-4">Recommandations</h3>
            <ul className="space-y-3">
              {cfg.recs.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-[#00C2C7]/15 text-[#00C2C7] flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs">
                    {i + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Save result */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-[#0B1E4B] text-sm">Sauvegarder mon résultat</p>
                <p className="text-xs text-gray-400 mt-0.5">Enregistré localement sur cet appareil</p>
              </div>
              {saved ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Résultat sauvegardé
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-[#0B1E4B] hover:bg-[#152960] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Sauvegarder
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/daily-practice"
              className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-4 rounded-xl transition-colors"
            >
              Démarrer ma formation →
            </Link>
            <button
              onClick={restart}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-4 rounded-xl transition-colors"
            >
              Refaire le test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared ──────────────────────────────────────────────────── */

function TopBar({ light }: { light?: boolean }) {
  return (
    <header className={`${light ? "bg-white border-b border-gray-200" : "bg-[#0B1E4B]/95"} px-6 h-16 flex items-center justify-between`}>
      <Link href="/" className="flex items-center gap-2">
        <span className="text-[#00C2C7] text-xl font-bold">OET</span>
        <span className={`text-sm font-medium ${light ? "text-[#0B1E4B]" : "text-white"}`}>
          Nursing Academy
        </span>
      </Link>
      <span className={`text-sm ${light ? "text-gray-500" : "text-white/60"}`}>
        Évaluation de niveau
      </span>
    </header>
  );
}
