"use client";

import { useEffect, useState } from "react";
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

const STORAGE_KEY = "oet_writing_completed";

/* ─── Component ───────────────────────────────────────────────── */

export default function WritingClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(SCENARIOS[0].id);
  const [shownAnswers, setShownAnswers] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
    } catch {}
    setHydrated(true);
  }, []);

  function toggleCompleted(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
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
              Rédigez votre lettre sur papier ou dans un éditeur de texte avant de consulter la lettre modèle. Respectez la structure OET : objet, antécédents, traitement, recommandation. Visez 180–200 mots en 45 minutes.
            </p>
          </div>

          {/* Scenarios */}
          <div className="space-y-4">
            {SCENARIOS.map((scenario, index) => {
              const isDone = hydrated && completed.has(scenario.id);
              const isExpanded = expanded === scenario.id;
              const isAnswerShown = shownAnswers.has(scenario.id);

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
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-[#0B1E4B] text-sm">{scenario.title}</span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${scenario.tagColor}`}>
                          {scenario.tag}
                        </span>
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
                        onClick={() => toggleCompleted(scenario.id)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                          isDone
                            ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                            : "border-[#0B1E4B] bg-[#0B1E4B] text-white hover:bg-[#152960]"
                        }`}
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
                            Marquer comme rédigée
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
              href="/#contact"
              className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              Démarrer ma formation →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
