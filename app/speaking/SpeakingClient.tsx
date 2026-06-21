"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Data ────────────────────────────────────────────────────── */

type Scenario = {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  situation: string;
  task: string;
  phrases: string[];
  responses: { label: string; text: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "sp-1",
    title: "Pain Assessment",
    tag: "Évaluation",
    tagColor: "bg-rose-100 text-rose-700",
    situation:
      "Mr. Dubois, 54, was admitted two hours ago following abdominal surgery. He is now awake and visibly uncomfortable. He speaks limited English and appears anxious.",
    task:
      "Assess the patient's pain level, reassure him, and explain how you will manage his discomfort.",
    phrases: [
      "Can you show me on this scale how much pain you're feeling?",
      "I'm going to give you something to help with the pain.",
      "Please let me know if the pain gets worse.",
      "On a scale of 0 to 10, how would you rate your pain?",
      "The medication should start working within about 20 minutes.",
    ],
    responses: [
      {
        label: "Ouvrir la consultation",
        text: "Hello Mr. Dubois, my name is Marie and I'm your nurse. I can see you look a little uncomfortable — I'd like to check how you're feeling. Can you show me on this scale how much pain you're experiencing right now?",
      },
      {
        label: "Gérer la douleur",
        text: "I understand you're in pain and I'm going to help you right away. I'm going to administer some pain relief through your drip. It should start working within about 20 minutes. Is there anything else that's making you feel uncomfortable?",
      },
      {
        label: "Rassurer et clôturer",
        text: "I'll check on you again in 30 minutes to see if the medication has helped. If your pain gets worse or you feel unwell at any point, please press this call button and I'll come straight away. You're in good hands.",
      },
    ],
  },
  {
    id: "sp-2",
    title: "Medication Explanation",
    tag: "Éducation thérapeutique",
    tagColor: "bg-blue-100 text-blue-700",
    situation:
      "Mrs. Laurent, 67, has been newly prescribed a blood thinner (warfarin) following a deep vein thrombosis. She is about to be discharged and is worried about taking a new medication.",
    task:
      "Explain the purpose of warfarin, how to take it, and what side effects to watch for.",
    phrases: [
      "This medication helps to prevent new blood clots from forming.",
      "It's important to take it at the same time every day.",
      "You should avoid foods high in vitamin K, such as leafy green vegetables.",
      "Watch out for any unusual bruising or bleeding.",
      "You'll need regular blood tests to make sure the dose is right for you.",
    ],
    responses: [
      {
        label: "Introduire le médicament",
        text: "Mrs. Laurent, before you go home I'd like to talk to you about your new medication, warfarin. It's a blood thinner, which means it helps prevent new clots from forming in your legs. It's very effective, but it does require a little care.",
      },
      {
        label: "Expliquer la prise",
        text: "It's very important to take warfarin at the same time every day — many people find it easiest to take it with their evening meal. You should also be careful with certain foods. Foods that are high in vitamin K, like spinach, kale, and broccoli, can affect how the medication works, so try to keep your intake of those consistent.",
      },
      {
        label: "Signes d'alerte",
        text: "There are a few warning signs I'd like you to be aware of. If you notice any unusual bruising, bleeding gums, blood in your urine, or a cut that won't stop bleeding, please contact your doctor or come to the emergency department straight away. And don't worry — you'll have a blood test next week to check your levels are correct.",
      },
    ],
  },
  {
    id: "sp-3",
    title: "Pre-operative Preparation",
    tag: "Pré-opératoire",
    tagColor: "bg-purple-100 text-purple-700",
    situation:
      "Mr. Renard, 45, is scheduled for a knee replacement surgery tomorrow morning. He has never had an operation before and is very anxious. He asks lots of questions.",
    task:
      "Explain what will happen before, during and after the procedure to reduce his anxiety and obtain informed consent.",
    phrases: [
      "You'll need to fast from midnight — nothing to eat or drink.",
      "The anaesthetist will visit you this evening to explain the anaesthesia.",
      "You'll be awake again in the recovery room before being brought back to the ward.",
      "It's completely normal to feel nervous before surgery.",
      "Please feel free to ask me any questions at any time.",
    ],
    responses: [
      {
        label: "Aborder l'anxiété",
        text: "Mr. Renard, it's completely normal to feel nervous before your first operation. I'm here to walk you through everything so there are no surprises. Please feel free to stop me at any time if you have questions — there are no silly questions when it comes to your health.",
      },
      {
        label: "Expliquer la préparation",
        text: "Tonight, I need to ask you not to eat or drink anything after midnight. This is for your safety during the anaesthesia. The anaesthetist will also come by this evening to explain exactly what type of anaesthesia you'll have and answer any questions you might have about that.",
      },
      {
        label: "Décrire le réveil",
        text: "After the surgery, you'll wake up in the recovery room where a nurse will be monitoring you closely. Once you're stable and comfortable, you'll be brought back to this ward. You may feel a little groggy at first — that's completely normal. We'll manage your pain carefully so you're as comfortable as possible.",
      },
    ],
  },
  {
    id: "sp-4",
    title: "Breaking Difficult News",
    tag: "Communication difficile",
    tagColor: "bg-amber-100 text-amber-700",
    situation:
      "Mrs. Moreau, 72, has just been told by her doctor that her test results show signs of early-stage heart failure. She is upset and confused. The doctor has left and she wants the nurse to explain what this means.",
    task:
      "Provide emotional support, clarify the diagnosis in simple terms, and outline the next steps.",
    phrases: [
      "I understand this is a lot to take in.",
      "Heart failure means your heart isn't pumping as efficiently as it should.",
      "This doesn't mean your heart is about to stop — it means we need to help it work better.",
      "We'll refer you to a heart specialist who will guide your treatment.",
      "Would you like me to stay with you for a little while?",
    ],
    responses: [
      {
        label: "Offrir du soutien",
        text: "Mrs. Moreau, I can see you're upset and I completely understand — this is a lot to hear. Please take your time. I'm here with you and I'm happy to try to explain what the doctor said in simpler terms if that would help.",
      },
      {
        label: "Clarifier le diagnostic",
        text: "When we talk about heart failure, I know the word 'failure' sounds very frightening — but it doesn't mean your heart is about to stop. It means that your heart isn't pumping blood around your body as efficiently as it could be. The good news is that this is something we can treat and manage very well with the right medication and care.",
      },
      {
        label: "Présenter les prochaines étapes",
        text: "The next step is that we'll refer you to a cardiologist — a heart specialist — who will see you soon and create a personalised treatment plan for you. In the meantime, I'd like to check your vital signs and make sure you're comfortable. Would you like me to call a family member to be with you?",
      },
    ],
  },
  {
    id: "sp-5",
    title: "Discharge Instructions",
    tag: "Sortie",
    tagColor: "bg-[#00C2C7]/15 text-[#009DA1]",
    situation:
      "Mr. Petit, 38, is being discharged after a mild asthma attack. He has been given a new inhaler and follow-up appointment. He seems distracted and in a hurry to leave.",
    task:
      "Ensure the patient understands how to use the inhaler correctly and knows when to seek urgent help.",
    phrases: [
      "Before you go, I just need to make sure you know how to use this inhaler.",
      "Shake it well, breathe out fully, then press and breathe in slowly.",
      "If you use it more than twice in 24 hours, please contact your GP.",
      "Avoid your known triggers — smoke, cold air, exercise in cold weather.",
      "If you feel your breathing getting worse, call 999 immediately.",
    ],
    responses: [
      {
        label: "Retenir l'attention du patient",
        text: "Mr. Petit, I know you're keen to get home — I just need five minutes to go over a couple of important things with you. This will make sure you're safe and confident when you leave. Is that okay?",
      },
      {
        label: "Expliquer l'utilisation de l'inhalateur",
        text: "This is your new reliever inhaler. Whenever you feel your breathing getting tight, shake it, breathe out fully, press the canister and breathe in slowly and steadily. Then hold your breath for about 10 seconds. I'd like to see you try it once before you leave so I know you're comfortable with it.",
      },
      {
        label: "Signes d'urgence",
        text: "If you find yourself using the inhaler more than twice in 24 hours, that's a sign that your asthma isn't well controlled and you should contact your GP. And if at any point you feel you can't breathe properly, your lips turn blue, or you feel faint — please call emergency services immediately. Don't wait. Your follow-up appointment is in two weeks — the details are on your discharge letter.",
      },
    ],
  },
];

const STORAGE_KEY = "oet_speaking_practiced";

/* ─── Component ───────────────────────────────────────────────── */

export default function SpeakingClient() {
  const [practiced, setPracticed] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(SCENARIOS[0].id);
  const [openResponse, setOpenResponse] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPracticed(new Set(JSON.parse(raw) as string[]));
    } catch {}
    setHydrated(true);
  }, []);

  function togglePracticed(id: string) {
    setPracticed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  const practicedCount = hydrated ? practiced.size : 0;
  const total = SCENARIOS.length;
  const progressPct = Math.round((practicedCount / total) * 100);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-gray-500">
          <Link href="/vocabulary" className="hover:text-[#0B1E4B] transition-colors">Vocabulaire</Link>
          <Link href="/plan" className="hover:text-[#0B1E4B] transition-colors">Mon plan</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Page title + progress */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Speaking OET</p>
            <div className="flex items-end justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-[#0B1E4B]">Simulations de consultation</h1>
              <span className="text-sm font-semibold text-[#0B1E4B] flex-shrink-0">
                {practicedCount} / {total} pratiqués
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {practicedCount === total && hydrated && (
              <p className="text-sm text-[#009DA1] font-medium mt-2">
                🎉 Tous les scénarios sont pratiqués !
              </p>
            )}
          </div>

          {/* Tip banner */}
          <div className="bg-[#0B1E4B]/5 border border-[#0B1E4B]/10 rounded-xl px-5 py-4 mb-6 flex gap-3 items-start">
            <span className="text-lg flex-shrink-0">💡</span>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pour chaque scénario, lisez la situation, puis essayez de répondre à voix haute avant de consulter les réponses suggérées. Enregistrez-vous si possible pour évaluer votre fluidité.
            </p>
          </div>

          {/* Scenarios */}
          <div className="space-y-4">
            {SCENARIOS.map((scenario, index) => {
              const isPracticed = hydrated && practiced.has(scenario.id);
              const isExpanded = expanded === scenario.id;

              return (
                <div
                  key={scenario.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                    isPracticed ? "border-green-200" : "border-gray-200"
                  }`}
                >
                  {/* Scenario header — always visible */}
                  <button
                    className="w-full text-left px-6 py-5 flex items-center gap-4"
                    onClick={() => setExpanded(isExpanded ? null : scenario.id)}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                      isPracticed
                        ? "bg-green-400 text-white"
                        : "bg-[#0B1E4B]/10 text-[#0B1E4B]"
                    }`}>
                      {isPracticed ? (
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
                      <p className="text-xs text-gray-400 truncate">{scenario.situation.slice(0, 80)}…</p>
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

                      {/* Situation + Task */}
                      <div className="grid sm:grid-cols-2 gap-4 mt-5 mb-5">
                        <div className="bg-[#F7F9FC] rounded-xl p-4">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Situation patient
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">{scenario.situation}</p>
                        </div>
                        <div className="bg-[#0B1E4B]/5 rounded-xl p-4">
                          <p className="text-xs font-semibold text-[#00C2C7] uppercase tracking-wider mb-2">
                            Votre tâche
                          </p>
                          <p className="text-sm text-[#0B1E4B] font-medium leading-relaxed">{scenario.task}</p>
                        </div>
                      </div>

                      {/* Useful phrases */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Phrases utiles
                        </p>
                        <div className="space-y-2">
                          {scenario.phrases.map((phrase, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="text-[#00C2C7] font-bold text-sm flex-shrink-0 mt-0.5">›</span>
                              <p className="text-sm text-gray-700 italic">&ldquo;{phrase}&rdquo;</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Suggested responses */}
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          Réponses suggérées
                        </p>
                        <div className="space-y-2">
                          {scenario.responses.map((r, i) => {
                            const key = `${scenario.id}-r${i}`;
                            const isOpen = openResponse === key;
                            return (
                              <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                                <button
                                  className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                                  onClick={() => setOpenResponse(isOpen ? null : key)}
                                >
                                  <span className="text-sm font-medium text-[#0B1E4B]">{r.label}</span>
                                  <svg
                                    className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                {isOpen && (
                                  <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                                    <p className="text-sm text-gray-700 leading-relaxed pt-3">
                                      &ldquo;{r.text}&rdquo;
                                    </p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mark as practiced */}
                      <button
                        onClick={() => togglePracticed(scenario.id)}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                          isPracticed
                            ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                            : "border-[#0B1E4B] bg-[#0B1E4B] text-white hover:bg-[#152960]"
                        }`}
                      >
                        {isPracticed ? (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Pratiqué — cliquer pour annuler
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            Marquer comme pratiqué
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
              href="/vocabulary"
              className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              ← Vocabulaire médical
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
