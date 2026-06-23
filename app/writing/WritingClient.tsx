"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── Data ────────────────────────────────────────────────────── */

type Scenario = {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  patientSummary: string;
  task: string;
  keyPoints: string[];
  modelAnswer: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "wr-1",
    title: "Cardiac Referral",
    tag: "Cardiologie",
    tagColor: "bg-rose-100 text-rose-700",
    patientSummary:
      "Mr. Henri Dupont, 62 years old, admitted on 14 June with chest pain and shortness of breath. ECG showed atrial fibrillation. BP on admission: 158/94 mmHg. Started on bisoprolol 5 mg daily and warfarin. Stable at discharge. No known drug allergies. Referred to outpatient cardiology for ongoing management.",
    task:
      "Write a referral letter from the ward nurse to the outpatient cardiology clinic. Use the patient notes above. Your letter should be approximately 180–200 words.",
    keyPoints: [
      "Reason for admission and presenting symptoms",
      "Diagnosis confirmed on ECG (atrial fibrillation)",
      "Blood pressure on admission",
      "Medications commenced (bisoprolol, warfarin)",
      "Current status at discharge (stable)",
      "Purpose of referral (ongoing cardiology management)",
    ],
    modelAnswer: `Dear Cardiology Team,

Re: Mr. Henri Dupont, DOB: 12/03/1962

I am writing to refer Mr. Dupont, who was admitted to our ward on 14 June following an episode of chest pain and shortness of breath. On assessment, his blood pressure was 158/94 mmHg and his ECG confirmed a diagnosis of atrial fibrillation with a rapid ventricular response.

Mr. Dupont was commenced on bisoprolol 5 mg once daily for rate control and warfarin for anticoagulation. He responded well to treatment and his condition stabilised over the course of his admission. He has no known drug allergies.

He was discharged home in a stable condition and requires ongoing management and monitoring of his cardiac function and anticoagulation levels. I would be grateful if you could arrange a follow-up appointment at your earliest convenience.

Please do not hesitate to contact the ward should you require any further information.

Yours sincerely,
[Nurse's Name]
Ward Nurse, Cardiology Unit`,
  },
  {
    id: "wr-2",
    title: "Diabetic Foot Referral",
    tag: "Endocrinologie",
    tagColor: "bg-amber-100 text-amber-700",
    patientSummary:
      "Mrs. Claire Bernard, 71 years old, type 2 diabetic, admitted on 8 June with a non-healing wound on her left foot (grade 2 diabetic ulcer). Blood glucose poorly controlled (HbA1c 9.2%). On metformin 1 g twice daily and insulin glargine 20 units nocte. Wound cleaned and dressed daily. Referred to the diabetic foot clinic for specialist assessment and wound management.",
    task:
      "Write a referral letter from the ward nurse to the diabetic foot clinic. Use the patient notes above. Your letter should be approximately 180–200 words.",
    keyPoints: [
      "Diagnosis: type 2 diabetes with grade 2 diabetic foot ulcer",
      "Location of wound (left foot) and poor healing",
      "Blood glucose control — HbA1c level",
      "Current medications (metformin, insulin glargine)",
      "Wound care provided on the ward",
      "Reason for referral to specialist clinic",
    ],
    modelAnswer: `Dear Diabetic Foot Clinic Team,

Re: Mrs. Claire Bernard, DOB: 05/09/1952

I am writing to refer Mrs. Bernard, a 71-year-old patient with a known history of type 2 diabetes mellitus, who was admitted to our ward on 8 June with a non-healing wound on her left foot. The wound has been classified as a grade 2 diabetic ulcer and has shown limited improvement despite daily cleaning and dressing.

Her diabetes remains poorly controlled, with a recent HbA1c of 9.2%. She is currently prescribed metformin 1 g twice daily and insulin glargine 20 units at night. No drug allergies are documented.

During her admission, wound care has been carried out daily by the nursing team; however, specialist input is now required to optimise wound management and review her glycaemic control. I would be grateful if you could arrange a prompt assessment to prevent further deterioration and reduce the risk of complications.

Please find enclosed copies of her recent blood results and wound assessment charts.

Yours sincerely,
[Nurse's Name]
Ward Nurse, Medical Unit`,
  },
  {
    id: "wr-3",
    title: "Post-Surgical Physiotherapy",
    tag: "Rééducation",
    tagColor: "bg-purple-100 text-purple-700",
    patientSummary:
      "Mr. Luc Martin, 55 years old, underwent a right total knee replacement on 10 June. Post-operative course uncomplicated. Mobilising with a walking frame. Wound site clean and dry. Mild swelling noted around the right knee. Discharged on paracetamol 1 g four times daily and naproxen 500 mg twice daily. Referred to outpatient physiotherapy for rehabilitation.",
    task:
      "Write a referral letter from the ward nurse to the outpatient physiotherapy department. Use the patient notes above. Your letter should be approximately 180–200 words.",
    keyPoints: [
      "Procedure performed and date (right total knee replacement, 10 June)",
      "Post-operative status (uncomplicated, mobilising with frame)",
      "Wound condition (clean, dry, mild swelling)",
      "Current pain management medications",
      "Goal of referral (rehabilitation and improved mobility)",
    ],
    modelAnswer: `Dear Physiotherapy Team,

Re: Mr. Luc Martin, DOB: 22/07/1968

I am writing to refer Mr. Martin for outpatient physiotherapy following his right total knee replacement, performed on 10 June. His post-operative course was uncomplicated, and he is currently mobilising with the assistance of a walking frame.

On discharge, his wound site was clean and dry, with mild swelling noted around the right knee. He is managing his pain with paracetamol 1 g four times daily and naproxen 500 mg twice daily. He has no known drug allergies.

Mr. Martin would greatly benefit from a structured physiotherapy programme to restore range of motion, strengthen the surrounding musculature, and progress his mobility towards independent walking. He is motivated and understands the importance of rehabilitation following this procedure.

I would be grateful if you could arrange an initial assessment at your earliest convenience. Please do not hesitate to contact the ward if you require any further information regarding his admission or surgical notes.

Yours sincerely,
[Nurse's Name]
Ward Nurse, Orthopaedic Unit`,
  },
  {
    id: "wr-4",
    title: "Mental Health Transfer",
    tag: "Santé mentale",
    tagColor: "bg-blue-100 text-blue-700",
    patientSummary:
      "Miss Sophie Garnier, 29 years old, admitted on 3 June following a deliberate self-harm episode. Medically cleared after treatment of superficial lacerations on left forearm. Assessed by the on-call psychiatrist; diagnosed with major depressive disorder. Commenced on sertraline 50 mg daily. Patient consented to transfer to inpatient psychiatric unit for further assessment and stabilisation.",
    task:
      "Write a transfer letter from the ward nurse to the receiving psychiatric unit. Use the patient notes above. Your letter should be approximately 180–200 words.",
    keyPoints: [
      "Reason for admission (deliberate self-harm)",
      "Medical treatment provided (lacerations treated)",
      "Psychiatric assessment and diagnosis (major depressive disorder)",
      "Medication commenced (sertraline 50 mg)",
      "Patient consent to transfer",
      "Reason for transfer (further assessment and stabilisation)",
    ],
    modelAnswer: `Dear Psychiatric Unit Team,

Re: Miss Sophie Garnier, DOB: 17/02/1995

I am writing to arrange the transfer of Miss Garnier, who was admitted to our ward on 3 June following a deliberate self-harm episode involving superficial lacerations to her left forearm. Her wounds were assessed and treated appropriately, and she has been medically cleared for transfer.

Miss Garnier was reviewed by the on-call psychiatrist during her admission, who confirmed a diagnosis of major depressive disorder. She has been commenced on sertraline 50 mg once daily. She has given her informed consent to transfer to your unit for further psychiatric assessment and stabilisation of her mental health.

She is currently calm and cooperative. She has no known drug allergies and no significant past medical history. Her mood remains low, and she continues to require close monitoring and specialist support beyond what can be provided in an acute medical ward.

Please find enclosed her psychiatry assessment, medication chart, and nursing notes. We are available to discuss her care further should you require additional information.

Yours sincerely,
[Nurse's Name]
Ward Nurse, Acute Medical Unit`,
  },
  {
    id: "wr-5",
    title: "Respiratory Discharge",
    tag: "Pneumologie",
    tagColor: "bg-[#00C2C7]/15 text-[#009DA1]",
    patientSummary:
      "Mr. Paul Lefevre, 48 years old, admitted on 17 June with an acute exacerbation of COPD. Treated with nebulised salbutamol, prednisolone 30 mg daily (5-day course), and antibiotics (amoxicillin 500 mg three times daily). Oxygen saturation improved to 96% on room air. Discharged with new prescription for tiotropium inhaler. Referred to respiratory outpatient clinic for spirometry and ongoing COPD management.",
    task:
      "Write a referral letter from the ward nurse to the respiratory outpatient clinic. Use the patient notes above. Your letter should be approximately 180–200 words.",
    keyPoints: [
      "Admission diagnosis (acute exacerbation of COPD)",
      "Treatments given during admission (salbutamol, prednisolone, amoxicillin)",
      "Oxygen saturation on discharge",
      "New medication prescribed at discharge (tiotropium inhaler)",
      "Reason for referral (spirometry and ongoing COPD management)",
    ],
    modelAnswer: `Dear Respiratory Outpatient Team,

Re: Mr. Paul Lefevre, DOB: 09/11/1975

I am writing to refer Mr. Lefevre, who was admitted to our ward on 17 June with an acute exacerbation of chronic obstructive pulmonary disease (COPD). During his admission, he was treated with nebulised salbutamol, a five-day course of prednisolone 30 mg daily, and amoxicillin 500 mg three times daily to address a suspected infective component.

Mr. Lefevre responded well to treatment. His oxygen saturation improved to 96% on room air prior to discharge. He has been prescribed a tiotropium inhaler as a new addition to his regular regimen and has been educated on its correct use. He has no known drug allergies.

He would benefit from a full respiratory review including spirometry to formally assess the severity of his COPD and to optimise his long-term management plan. I would be grateful if you could arrange an appointment at your earliest convenience.

Enclosed are his discharge summary, medication chart, and most recent chest X-ray report.

Yours sincerely,
[Nurse's Name]
Ward Nurse, Respiratory Unit`,
  },
];

const STORAGE_KEY  = "oet_writing_completed";
const DRAFT_KEY    = "oet_writing_drafts";
const EVAL_KEY     = "oet_writing_evals";
const MIN_WORDS    = 180;
const MAX_WORDS    = 200;

/* ─── Self-evaluation data ────────────────────────────────────── */

type Rating = "needs-work" | "acceptable" | "good";
type EvalState = Record<string, Rating>; // categoryId → rating

const EVAL_CATEGORIES = [
  {
    id: "purpose",
    label: "Purpose achieved",
    fr: "Objectif atteint",
    desc: "La lettre remplit clairement son objectif (référence, transfert, etc.).",
    advice: {
      "needs-work": "Relisez la tâche et assurez-vous que votre ouverture indique explicitement le but de la lettre dès la première phrase.",
      "acceptable": "L'objectif est présent mais pourrait être plus direct. Essayez d'ouvrir avec : « I am writing to refer / transfer / inform… »",
      "good": "Objectif clairement exprimé. Continuez à structurer ainsi.",
    },
  },
  {
    id: "clinical",
    label: "Relevant clinical information",
    fr: "Informations cliniques pertinentes",
    desc: "Les données clés du dossier patient sont incluses et correctement rapportées.",
    advice: {
      "needs-work": "Comparez point par point avec la liste « Points clés à inclure ». Chaque élément du dossier doit apparaître dans votre lettre.",
      "acceptable": "La plupart des informations cliniques sont présentes, mais certains détails importants (médicaments, résultats) manquent ou sont imprécis.",
      "good": "Toutes les informations cliniques pertinentes sont présentes et précises.",
    },
  },
  {
    id: "organisation",
    label: "Organisation and structure",
    fr: "Organisation et structure",
    desc: "La lettre suit la structure OET : en-tête, objet, antécédents, traitement, recommandation, formule de politesse.",
    advice: {
      "needs-work": "Structurez votre lettre en paragraphes distincts : (1) raison de la référence, (2) antécédents et traitement, (3) statut actuel, (4) demande et formule de politesse.",
      "acceptable": "La structure est reconnaissable mais les paragraphes se mélangent. Séparez clairement chaque section.",
      "good": "Structure claire et logique, conforme aux attentes OET.",
    },
  },
  {
    id: "tone",
    label: "Formal professional tone",
    fr: "Ton formel et professionnel",
    desc: "Le registre est formel, les formules de politesse sont appropriées, aucun langage familier.",
    advice: {
      "needs-work": "Évitez les contractions (I'm → I am), les expressions familières et les abréviations non médicales. Utilisez des formules comme « I would be grateful if… », « Please do not hesitate to… »",
      "acceptable": "Le ton est généralement correct mais quelques tournures sont trop informelles. Revisez les formules d'ouverture et de clôture.",
      "good": "Ton parfaitement adapté à une communication professionnelle médicale.",
    },
  },
  {
    id: "grammar",
    label: "Grammar and accuracy",
    fr: "Grammaire et précision",
    desc: "Les phrases sont correctes, les temps verbaux cohérents, la ponctuation appropriée.",
    advice: {
      "needs-work": "Relisez phrase par phrase. Vérifiez les accords sujet-verbe, les temps (passé pour les antécédents, présent pour le statut actuel) et la ponctuation.",
      "acceptable": "Quelques erreurs grammaticales ou de ponctuation. Portez attention aux constructions passives (« was commenced on », « was referred to »), très courantes en rédaction médicale.",
      "good": "Grammaire solide et langage médical précis.",
    },
  },
  {
    id: "wordcount",
    label: "Word count target",
    fr: "Respect de la cible de mots",
    desc: "La lettre se situe dans la plage cible de 180 à 200 mots.",
    advice: {
      "needs-work": "Vérifiez le compteur de mots ci-dessus. Une lettre trop courte manque d'informations ; une lettre trop longue dépasse le temps imparti en examen.",
      "acceptable": "Vous êtes proche de la cible. Ajustez en ajoutant un détail clinique ou en reformulant une phrase pour rester dans la plage.",
      "good": "Parfait — la lettre respecte la contrainte de longueur OET.",
    },
  },
] as const;

type CategoryId = typeof EVAL_CATEGORIES[number]["id"];

const RATING_SCORE: Record<Rating, number> = { "needs-work": 0, "acceptable": 1, "good": 2 };

function calcOETScore(eval_: EvalState): { score: number; grade: string; label: string } {
  const filled = EVAL_CATEGORIES.filter((c) => eval_[c.id]);
  if (filled.length === 0) return { score: 0, grade: "—", label: "Complétez l'auto-évaluation" };
  const total = filled.reduce((s, c) => s + RATING_SCORE[eval_[c.id] as Rating], 0);
  const max = filled.length * 2;
  const pct = total / max;
  if (pct >= 0.85) return { score: Math.round(pct * 100), grade: "A", label: "Excellent — prêt(e) pour l'OET" };
  if (pct >= 0.65) return { score: Math.round(pct * 100), grade: "B", label: "Bon niveau — objectif atteint" };
  if (pct >= 0.45) return { score: Math.round(pct * 100), grade: "C", label: "En progression — à consolider" };
  return { score: Math.round(pct * 100), grade: "D", label: "À retravailler en priorité" };
}

/* ─── SelfEvalChecklist component ────────────────────────────── */

function SelfEvalChecklist({
  scenarioId,
  initialEval,
  onEvalChange,
}: {
  scenarioId: string;
  initialEval: EvalState;
  onEvalChange: (id: string, eval_: EvalState) => void;
}) {
  const [eval_, setEval] = useState<EvalState>(initialEval);
  const { score, grade, label } = calcOETScore(eval_);
  const filledCount = EVAL_CATEGORIES.filter((c) => eval_[c.id]).length;
  const allFilled = filledCount === EVAL_CATEGORIES.length;

  function pick(catId: CategoryId, rating: Rating) {
    const next = { ...eval_, [catId]: rating };
    setEval(next);
    onEvalChange(scenarioId, next);
  }

  const gradeColor =
    grade === "A" ? { pill: "bg-green-100 text-green-700", bar: "bg-green-500" } :
    grade === "B" ? { pill: "bg-[#00C2C7]/15 text-[#009DA1]", bar: "bg-[#00C2C7]" } :
    grade === "C" ? { pill: "bg-amber-100 text-amber-700", bar: "bg-amber-400" } :
    grade === "D" ? { pill: "bg-red-100 text-red-600", bar: "bg-red-400" } :
                    { pill: "bg-gray-100 text-gray-500", bar: "bg-gray-300" };

  const RATING_OPTIONS: { value: Rating; label: string; active: string }[] = [
    { value: "needs-work", label: "À améliorer", active: "border-red-400 bg-red-50 text-red-700" },
    { value: "acceptable", label: "Acceptable",  active: "border-amber-400 bg-amber-50 text-amber-700" },
    { value: "good",       label: "Bien",        active: "border-green-400 bg-green-50 text-green-700" },
  ];

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#F7F9FC] px-5 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Auto-évaluation
        </p>
        <p className="text-xs text-gray-500">
          Évaluez honnêtement votre lettre sur chaque critère OET.
        </p>
      </div>

      {/* Categories */}
      <div className="divide-y divide-gray-100">
        {EVAL_CATEGORIES.map((cat) => {
          const selected = eval_[cat.id] as Rating | undefined;
          return (
            <div key={cat.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div>
                  <p className="text-sm font-semibold text-[#0B1E4B]">{cat.fr}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
                </div>
              </div>
              {/* Rating buttons */}
              <div className="grid grid-cols-3 gap-2">
                {RATING_OPTIONS.map((opt) => {
                  const isActive = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => pick(cat.id as CategoryId, opt.value)}
                      className={`py-2 px-1 rounded-lg border text-xs font-semibold transition-all ${
                        isActive ? opt.active : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {/* Personalised advice */}
              {selected && (
                <p className="mt-2.5 text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-3 py-2">
                  {cat.advice[selected]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Score summary */}
      <div className="bg-[#0B1E4B] px-5 py-5">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <p className="text-white/60 text-xs mb-0.5">Score OET estimé</p>
            <p className="text-white font-semibold text-sm">{label}</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${gradeColor.pill}`}>
            {allFilled ? `Grade ${grade}` : `${filledCount}/${EVAL_CATEGORIES.length} critères`}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${gradeColor.bar}`}
            style={{ width: allFilled ? `${score}%` : `${(filledCount / EVAL_CATEGORIES.length) * 100}%` }}
          />
        </div>
        {!allFilled && (
          <p className="text-white/40 text-xs mt-2">
            Évaluez tous les critères pour obtenir votre grade estimé.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function wordCountColor(n: number): string {
  if (n === 0) return "text-gray-400";
  if (n < MIN_WORDS) return "text-amber-600";
  if (n <= MAX_WORDS) return "text-green-600";
  return "text-red-500";
}

function completionLabel(n: number): { label: string; pct: number } {
  if (n === 0) return { label: "Non commencée", pct: 0 };
  if (n < MIN_WORDS) {
    const pct = Math.round((n / MIN_WORDS) * 90);
    return { label: `${n} mots — encore ${MIN_WORDS - n} à écrire`, pct };
  }
  if (n <= MAX_WORDS) return { label: `${n} mots — dans la cible ✓`, pct: 100 };
  return { label: `${n} mots — trop long (max ${MAX_WORDS})`, pct: 100 };
}

/* ─── WritingArea component ───────────────────────────────────── */

function WritingArea({
  scenarioId,
  initialDraft,
  onDraftChange,
}: {
  scenarioId: string;
  initialDraft: string;
  onDraftChange: (id: string, text: string) => void;
}) {
  const [text, setText] = useState(initialDraft);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const wordCount = countWords(text);
  const { label: compLabel, pct: compPct } = completionLabel(wordCount);
  const inTarget = wordCount >= MIN_WORDS && wordCount <= MAX_WORDS;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    // Debounce autosave 800 ms
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onDraftChange(scenarioId, val);
      setSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    }, 800);
  }

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Commencez à rédiger votre lettre ici…"
        spellCheck
        className="w-full min-h-[320px] resize-y rounded-xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-800 leading-relaxed focus:outline-none focus:border-[#00C2C7] focus:ring-2 focus:ring-[#00C2C7]/20 transition-all placeholder-gray-300 font-[inherit]"
      />

      {/* Word counter + progress */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Progress bar */}
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                inTarget ? "bg-green-500" : wordCount > MAX_WORDS ? "bg-red-400" : "bg-amber-400"
              }`}
              style={{ width: `${Math.min(compPct, 100)}%` }}
            />
          </div>
          <span className={`text-xs font-medium whitespace-nowrap ${wordCountColor(wordCount)}`}>
            {compLabel}
          </span>
        </div>

        {/* Live word count badge */}
        <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
          inTarget
            ? "bg-green-100 text-green-700"
            : wordCount > MAX_WORDS
            ? "bg-red-100 text-red-600"
            : wordCount === 0
            ? "bg-gray-100 text-gray-400"
            : "bg-amber-100 text-amber-700"
        }`}>
          {wordCount} / {MIN_WORDS}–{MAX_WORDS} mots
        </span>
      </div>

      {/* Autosave indicator */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Cible : {MIN_WORDS}–{MAX_WORDS} mots · 45 minutes</span>
        {savedAt && <span>Brouillon sauvegardé à {savedAt}</span>}
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export default function WritingClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [evals, setEvals] = useState<Record<string, EvalState>>({});
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(SCENARIOS[0].id);
  const [shownAnswers, setShownAnswers] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
      const rawDrafts = localStorage.getItem(DRAFT_KEY);
      if (rawDrafts) setDrafts(JSON.parse(rawDrafts) as Record<string, string>);
      const rawEvals = localStorage.getItem(EVAL_KEY);
      if (rawEvals) setEvals(JSON.parse(rawEvals) as Record<string, EvalState>);
    } catch {}
    setHydrated(true);
  }, []);

  function saveDraft(id: string, text: string) {
    setDrafts((prev) => {
      const next = { ...prev, [id]: text };
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function saveEval(id: string, eval_: EvalState) {
    setEvals((prev) => {
      const next = { ...prev, [id]: eval_ };
      try { localStorage.setItem(EVAL_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function markCompleted(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  function toggleAnswer(id: string) {
    setShownAnswers((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const completedCount = hydrated ? completed.size : 0;
  const total = SCENARIOS.length;
  const progressPct = Math.round((completedCount / total) * 100);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Header */}
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
          <Link href="/progress" className="hover:text-[#0B1E4B] transition-colors">Progression</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Title + progress */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Writing OET</p>
            <div className="flex items-end justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-[#0B1E4B]">Lettres de référence</h1>
              <span className="text-sm font-semibold text-[#0B1E4B] flex-shrink-0">
                {completedCount} / {total} rédigées
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {completedCount === total && hydrated && (
              <p className="text-sm text-[#009DA1] font-medium mt-2">
                🎉 Toutes les lettres sont rédigées !
              </p>
            )}
          </div>

          {/* Tip banner */}
          <div className="bg-[#0B1E4B]/5 border border-[#0B1E4B]/10 rounded-xl px-5 py-4 mb-6 flex gap-3 items-start">
            <span className="text-lg flex-shrink-0">💡</span>
            <p className="text-sm text-gray-600 leading-relaxed">
              Rédigez directement dans la zone de texte. Respectez la structure OET : objet, antécédents, traitement, recommandation. Votre brouillon est sauvegardé automatiquement. Visez 180–200 mots en 45 minutes.
            </p>
          </div>

          {/* Scenarios */}
          <div className="space-y-4">
            {SCENARIOS.map((scenario, index) => {
              const isDone = hydrated && completed.has(scenario.id);
              const isExpanded = expanded === scenario.id;
              const isAnswerShown = shownAnswers.has(scenario.id);
              const draft = drafts[scenario.id] ?? "";
              const wc = countWords(draft);
              const inTarget = wc >= MIN_WORDS && wc <= MAX_WORDS;
              const evalState = evals[scenario.id] ?? {};

              return (
                <div
                  key={scenario.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                    isDone ? "border-green-200" : "border-gray-200"
                  }`}
                >
                  {/* Accordion header */}
                  <button
                    className="w-full text-left px-6 py-5 flex items-center gap-4"
                    onClick={() => setExpanded(isExpanded ? null : scenario.id)}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                      isDone
                        ? "bg-green-400 text-white"
                        : "bg-[#0B1E4B]/10 text-[#0B1E4B]"
                    }`}>
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-[#0B1E4B] text-sm">{scenario.title}</span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${scenario.tagColor}`}>
                          {scenario.tag}
                        </span>
                        {/* Draft word count pill in header */}
                        {hydrated && wc > 0 && !isDone && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            inTarget ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {wc} mots
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{scenario.patientSummary.slice(0, 80)}…</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-100">

                      {/* Patient summary */}
                      <div className="mt-5 mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Résumé du dossier patient
                        </p>
                        <div className="bg-[#F7F9FC] border border-gray-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                          {scenario.patientSummary}
                        </div>
                      </div>

                      {/* Writing task */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-[#00C2C7] uppercase tracking-wider mb-2">
                          Tâche de rédaction
                        </p>
                        <div className="bg-[#0B1E4B]/5 rounded-xl p-4 text-sm text-[#0B1E4B] font-medium leading-relaxed">
                          {scenario.task}
                        </div>
                      </div>

                      {/* Key points */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Points clés à inclure
                        </p>
                        <ul className="space-y-2">
                          {scenario.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <span className="w-5 h-5 rounded-full bg-[#00C2C7]/15 text-[#00C2C7] flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-xs">
                                {i + 1}
                              </span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Writing area */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Votre lettre
                        </p>
                        <WritingArea
                          scenarioId={scenario.id}
                          initialDraft={draft}
                          onDraftChange={saveDraft}
                        />
                      </div>

                      {/* Self-evaluation checklist */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Auto-évaluation
                        </p>
                        <SelfEvalChecklist
                          scenarioId={scenario.id}
                          initialEval={evalState}
                          onEvalChange={saveEval}
                        />
                      </div>

                      {/* Model answer toggle */}
                      <div className="mb-5">
                        <button
                          onClick={() => toggleAnswer(scenario.id)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors text-sm"
                        >
                          <span className="font-medium text-[#0B1E4B]">
                            {isAnswerShown ? "Masquer la lettre modèle" : "Voir la lettre modèle"}
                          </span>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${isAnswerShown ? "rotate-180" : ""}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isAnswerShown && (
                          <div className="mt-2 border border-[#00C2C7]/30 bg-[#00C2C7]/5 rounded-xl p-5">
                            <p className="text-xs font-semibold text-[#009DA1] uppercase tracking-wider mb-3">
                              Lettre modèle
                            </p>
                            <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                              {scenario.modelAnswer}
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Mark as completed */}
                      <button
                        onClick={() => markCompleted(scenario.id)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                          isDone
                            ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                            : inTarget
                            ? "border-[#0B1E4B] bg-[#0B1E4B] text-white hover:bg-[#152960]"
                            : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!isDone && !inTarget}
                        title={!inTarget && !isDone ? `Atteignez ${MIN_WORDS}–${MAX_WORDS} mots pour valider` : undefined}
                      >
                        {isDone ? (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Rédigée — cliquer pour annuler
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {inTarget ? "Marquer comme rédigée" : `Écrivez encore ${Math.max(0, MIN_WORDS - wc)} mots pour valider`}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer nav */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              href="/speaking"
              className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              ← Speaking OET
            </Link>
            <Link
              href="/mock-exam"
              className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              Examen blanc →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
