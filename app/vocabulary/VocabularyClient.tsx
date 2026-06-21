"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Data ────────────────────────────────────────────────────── */

type Card = {
  id: string;
  word: string;
  translation: string;
  example: string;
};

type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  accent: string;
  cards: Card[];
};

const CATEGORIES: Category[] = [
  {
    id: "symptoms",
    label: "Symptômes",
    icon: "🩺",
    color: "border-rose-200 bg-rose-50",
    accent: "bg-rose-100 text-rose-700",
    cards: [
      {
        id: "sym-1",
        word: "Dyspnea",
        translation: "Dyspnée",
        example: "The patient presented with acute dyspnea and required immediate oxygen therapy.",
      },
      {
        id: "sym-2",
        word: "Palpitations",
        translation: "Palpitations",
        example: "She reported intermittent palpitations over the past three days.",
      },
      {
        id: "sym-3",
        word: "Diaphoresis",
        translation: "Diaphorèse (sueurs froides)",
        example: "On assessment, the patient was pale and showed signs of diaphoresis.",
      },
      {
        id: "sym-4",
        word: "Nausea",
        translation: "Nausée",
        example: "Post-operative nausea was managed with antiemetic medication.",
      },
      {
        id: "sym-5",
        word: "Lethargy",
        translation: "Léthargie",
        example: "The child displayed lethargy and was unresponsive to verbal stimuli.",
      },
      {
        id: "sym-6",
        word: "Haemoptysis",
        translation: "Hémoptysie (crachat de sang)",
        example: "The patient reported haemoptysis, prompting an urgent chest X-ray.",
      },
    ],
  },
  {
    id: "medication",
    label: "Médicaments",
    icon: "💊",
    color: "border-blue-200 bg-blue-50",
    accent: "bg-blue-100 text-blue-700",
    cards: [
      {
        id: "med-1",
        word: "Anticoagulant",
        translation: "Anticoagulant",
        example: "The patient was commenced on an anticoagulant to prevent further clot formation.",
      },
      {
        id: "med-2",
        word: "Analgesic",
        translation: "Analgésique",
        example: "A mild analgesic was prescribed to manage the patient's post-operative pain.",
      },
      {
        id: "med-3",
        word: "Diuretic",
        translation: "Diurétique",
        example: "The diuretic was administered to reduce fluid overload in the cardiac patient.",
      },
      {
        id: "med-4",
        word: "Bronchodilator",
        translation: "Bronchodilatateur",
        example: "The nurse administered a bronchodilator via nebuliser during the asthma attack.",
      },
      {
        id: "med-5",
        word: "Antiemetic",
        translation: "Antiémétique",
        example: "An antiemetic was given prior to chemotherapy to reduce nausea.",
      },
      {
        id: "med-6",
        word: "Sedative",
        translation: "Sédatif",
        example: "A low-dose sedative was prescribed to help the patient sleep before surgery.",
      },
    ],
  },
  {
    id: "surgery",
    label: "Chirurgie",
    icon: "🔬",
    color: "border-purple-200 bg-purple-50",
    accent: "bg-purple-100 text-purple-700",
    cards: [
      {
        id: "sur-1",
        word: "Incision",
        translation: "Incision",
        example: "The surgeon made a clean incision along the midline of the abdomen.",
      },
      {
        id: "sur-2",
        word: "Suture",
        translation: "Suture / Point de suture",
        example: "The wound was closed with absorbable sutures and dressed with a sterile bandage.",
      },
      {
        id: "sur-3",
        word: "Anaesthesia",
        translation: "Anesthésie",
        example: "General anaesthesia was induced before the procedure began.",
      },
      {
        id: "sur-4",
        word: "Haemostasis",
        translation: "Hémostase",
        example: "Haemostasis was achieved using electrocautery during the operation.",
      },
      {
        id: "sur-5",
        word: "Debridement",
        translation: "Débridement",
        example: "Surgical debridement was performed to remove necrotic tissue from the wound.",
      },
      {
        id: "sur-6",
        word: "Laparotomy",
        translation: "Laparotomie",
        example: "An emergency laparotomy was performed following abdominal trauma.",
      },
    ],
  },
  {
    id: "cardiology",
    label: "Cardiologie",
    icon: "❤️",
    color: "border-[#00C2C7]/30 bg-[#00C2C7]/5",
    accent: "bg-[#00C2C7]/15 text-[#009DA1]",
    cards: [
      {
        id: "car-1",
        word: "Arrhythmia",
        translation: "Arythmie",
        example: "The ECG confirmed a ventricular arrhythmia requiring immediate intervention.",
      },
      {
        id: "car-2",
        word: "Tachycardia",
        translation: "Tachycardie",
        example: "The patient developed tachycardia with a heart rate of 130 beats per minute.",
      },
      {
        id: "car-3",
        word: "Bradycardia",
        translation: "Bradycardie",
        example: "Severe bradycardia was noted and atropine was administered promptly.",
      },
      {
        id: "car-4",
        word: "Myocardial infarction",
        translation: "Infarctus du myocarde",
        example: "The patient was transferred to the coronary unit following a myocardial infarction.",
      },
      {
        id: "car-5",
        word: "Atrial fibrillation",
        translation: "Fibrillation auriculaire",
        example: "Atrial fibrillation was identified on the monitor and rate control was initiated.",
      },
      {
        id: "car-6",
        word: "Peripheral oedema",
        translation: "Œdème périphérique",
        example: "Bilateral peripheral oedema was present, suggesting heart failure.",
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: "💬",
    color: "border-amber-200 bg-amber-50",
    accent: "bg-amber-100 text-amber-700",
    cards: [
      {
        id: "com-1",
        word: "To reassure",
        translation: "Rassurer",
        example: "The nurse took time to reassure the patient before explaining the procedure.",
      },
      {
        id: "com-2",
        word: "To consent",
        translation: "Consentir / Donner son accord",
        example: "The patient was asked to consent to the treatment after receiving full information.",
      },
      {
        id: "com-3",
        word: "To refer",
        translation: "Orienter / Adresser",
        example: "The GP decided to refer the patient to a specialist for further assessment.",
      },
      {
        id: "com-4",
        word: "To discharge",
        translation: "Sortir / Libérer (de l'hôpital)",
        example: "The patient was ready to be discharged with a detailed care plan.",
      },
      {
        id: "com-5",
        word: "To clarify",
        translation: "Clarifier / Préciser",
        example: "The nurse asked the patient to clarify which symptoms had started first.",
      },
      {
        id: "com-6",
        word: "To comply",
        translation: "Se conformer / Respecter (le traitement)",
        example: "It is essential that the patient complies with the prescribed medication schedule.",
      },
    ],
  },
];

const STORAGE_KEY = "oet_vocabulary_learned";
const TOTAL_CARDS = CATEGORIES.reduce((sum, c) => sum + c.cards.length, 0);

/* ─── Component ───────────────────────────────────────────────── */

export default function VocabularyClient() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLearned(new Set(JSON.parse(raw) as string[]));
    } catch {}
    setHydrated(true);
  }, []);

  function toggleLearned(id: string) {
    setLearned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  const category = CATEGORIES.find((c) => c.id === activeCategory)!;
  const learnedCount = hydrated ? learned.size : 0;
  const progressPct = Math.round((learnedCount / TOTAL_CARDS) * 100);
  const categoryLearned = category.cards.filter((c) => learned.has(c.id)).length;

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-gray-500">
          <Link href="/plan" className="hover:text-[#0B1E4B] transition-colors">Mon plan</Link>
          <Link href="/dashboard" className="hover:text-[#0B1E4B] transition-colors">Tableau de bord</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl">

          {/* Page title + global progress */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Vocabulaire médical</p>
            <div className="flex items-end justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-[#0B1E4B]">Fiches de vocabulaire</h1>
              <span className="text-sm font-semibold text-[#0B1E4B] flex-shrink-0">
                {learnedCount} / {TOTAL_CARDS} appris
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {learnedCount === TOTAL_CARDS && hydrated && (
              <p className="text-sm text-[#009DA1] font-medium mt-2">
                🎉 Toutes les fiches sont apprises !
              </p>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map((cat) => {
              const catLearned = cat.cards.filter((c) => learned.has(c.id)).length;
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    isActive
                      ? "bg-[#0B1E4B] text-white border-[#0B1E4B]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#0B1E4B]/40"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {hydrated && catLearned > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive ? "bg-white/20 text-white" : "bg-[#00C2C7]/15 text-[#009DA1]"
                    }`}>
                      {catLearned}/{cat.cards.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              <h2 className="font-semibold text-[#0B1E4B]">{category.label}</h2>
            </div>
            <span className="text-xs text-gray-400">
              {categoryLearned} / {category.cards.length} appris
            </span>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {category.cards.map((card) => {
              const isLearned = hydrated && learned.has(card.id);
              return (
                <div
                  key={card.id}
                  className={`bg-white border rounded-2xl p-5 transition-all ${
                    isLearned
                      ? "border-green-200 bg-green-50/40"
                      : "border-gray-200 hover:border-[#00C2C7]/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Word + translation */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span className="text-base font-bold text-[#0B1E4B]">{card.word}</span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-sm font-medium text-gray-600 italic">{card.translation}</span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        <span className="text-[#00C2C7] font-medium not-italic">Ex. </span>
                        {card.example}
                      </p>
                    </div>

                    {/* Mark as learned button */}
                    <button
                      onClick={() => toggleLearned(card.id)}
                      title={isLearned ? "Marquer comme non appris" : "Marquer comme appris"}
                      className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                        isLearned
                          ? "border-green-400 bg-green-400 text-white"
                          : "border-gray-300 text-transparent hover:border-[#00C2C7]"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset category */}
          {hydrated && categoryLearned > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setLearned((prev) => {
                    const next = new Set(prev);
                    category.cards.forEach((c) => next.delete(c.id));
                    try {
                      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
                    } catch {}
                    return next;
                  });
                }}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors underline underline-offset-2"
              >
                Réinitialiser cette catégorie
              </button>
            </div>
          )}

          {/* Footer nav */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              href="/plan"
              className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              ← Mon plan OET
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
