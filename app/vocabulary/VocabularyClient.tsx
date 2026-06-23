"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────────────── */

type RawCard = {
  id: string;
  word: string;
  translation: string;
  example: string;
};

type Card = RawCard & {
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;
};

type SRSEntry = {
  interval: number;
  ease: number;
  due: string;    // YYYY-MM-DD
  reps: number;
};

type SRSStore = Record<string, SRSEntry>;
type Rating = "again" | "hard" | "good";
type Mode = "home" | "flashcard" | "quiz" | "browse";

/* ─── Data ───────────────────────────────────────────────────────── */

type Category = {
  id: string;
  label: string;
  icon: string;
  color: string;
  accent: string;
  cards: RawCard[];
};

const CATEGORIES: Category[] = [
  {
    id: "symptoms",
    label: "Symptômes",
    icon: "🩺",
    color: "border-rose-200 bg-rose-50",
    accent: "bg-rose-100 text-rose-700",
    cards: [
      { id: "sym-1", word: "Dyspnea", translation: "Dyspnée", example: "The patient presented with acute dyspnea and required immediate oxygen therapy." },
      { id: "sym-2", word: "Palpitations", translation: "Palpitations", example: "She reported intermittent palpitations over the past three days." },
      { id: "sym-3", word: "Diaphoresis", translation: "Diaphorèse (sueurs froides)", example: "On assessment, the patient was pale and showed signs of diaphoresis." },
      { id: "sym-4", word: "Nausea", translation: "Nausée", example: "Post-operative nausea was managed with antiemetic medication." },
      { id: "sym-5", word: "Lethargy", translation: "Léthargie", example: "The child displayed lethargy and was unresponsive to verbal stimuli." },
      { id: "sym-6", word: "Haemoptysis", translation: "Hémoptysie (crachat de sang)", example: "The patient reported haemoptysis, prompting an urgent chest X-ray." },
    ],
  },
  {
    id: "medication",
    label: "Médicaments",
    icon: "💊",
    color: "border-blue-200 bg-blue-50",
    accent: "bg-blue-100 text-blue-700",
    cards: [
      { id: "med-1", word: "Anticoagulant", translation: "Anticoagulant", example: "The patient was commenced on an anticoagulant to prevent further clot formation." },
      { id: "med-2", word: "Analgesic", translation: "Analgésique", example: "A mild analgesic was prescribed to manage the patient's post-operative pain." },
      { id: "med-3", word: "Diuretic", translation: "Diurétique", example: "The diuretic was administered to reduce fluid overload in the cardiac patient." },
      { id: "med-4", word: "Bronchodilator", translation: "Bronchodilatateur", example: "The nurse administered a bronchodilator via nebuliser during the asthma attack." },
      { id: "med-5", word: "Antiemetic", translation: "Antiémétique", example: "An antiemetic was given prior to chemotherapy to reduce nausea." },
      { id: "med-6", word: "Sedative", translation: "Sédatif", example: "A low-dose sedative was prescribed to help the patient sleep before surgery." },
    ],
  },
  {
    id: "surgery",
    label: "Chirurgie",
    icon: "🔬",
    color: "border-purple-200 bg-purple-50",
    accent: "bg-purple-100 text-purple-700",
    cards: [
      { id: "sur-1", word: "Incision", translation: "Incision", example: "The surgeon made a clean incision along the midline of the abdomen." },
      { id: "sur-2", word: "Suture", translation: "Suture / Point de suture", example: "The wound was closed with absorbable sutures and dressed with a sterile bandage." },
      { id: "sur-3", word: "Anaesthesia", translation: "Anesthésie", example: "General anaesthesia was induced before the procedure began." },
      { id: "sur-4", word: "Haemostasis", translation: "Hémostase", example: "Haemostasis was achieved using electrocautery during the operation." },
      { id: "sur-5", word: "Debridement", translation: "Débridement", example: "Surgical debridement was performed to remove necrotic tissue from the wound." },
      { id: "sur-6", word: "Laparotomy", translation: "Laparotomie", example: "An emergency laparotomy was performed following abdominal trauma." },
    ],
  },
  {
    id: "cardiology",
    label: "Cardiologie",
    icon: "❤️",
    color: "border-[#00C2C7]/30 bg-[#00C2C7]/5",
    accent: "bg-[#00C2C7]/15 text-[#009DA1]",
    cards: [
      { id: "car-1", word: "Arrhythmia", translation: "Arythmie", example: "The ECG confirmed a ventricular arrhythmia requiring immediate intervention." },
      { id: "car-2", word: "Tachycardia", translation: "Tachycardie", example: "The patient developed tachycardia with a heart rate of 130 beats per minute." },
      { id: "car-3", word: "Bradycardia", translation: "Bradycardie", example: "Severe bradycardia was noted and atropine was administered promptly." },
      { id: "car-4", word: "Myocardial infarction", translation: "Infarctus du myocarde", example: "The patient was transferred to the coronary unit following a myocardial infarction." },
      { id: "car-5", word: "Atrial fibrillation", translation: "Fibrillation auriculaire", example: "Atrial fibrillation was identified on the monitor and rate control was initiated." },
      { id: "car-6", word: "Peripheral oedema", translation: "Œdème périphérique", example: "Bilateral peripheral oedema was present, suggesting heart failure." },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: "💬",
    color: "border-amber-200 bg-amber-50",
    accent: "bg-amber-100 text-amber-700",
    cards: [
      { id: "com-1", word: "To reassure", translation: "Rassurer", example: "The nurse took time to reassure the patient before explaining the procedure." },
      { id: "com-2", word: "To consent", translation: "Consentir / Donner son accord", example: "The patient was asked to consent to the treatment after receiving full information." },
      { id: "com-3", word: "To refer", translation: "Orienter / Adresser", example: "The GP decided to refer the patient to a specialist for further assessment." },
      { id: "com-4", word: "To discharge", translation: "Sortir / Libérer (de l'hôpital)", example: "The patient was ready to be discharged with a detailed care plan." },
      { id: "com-5", word: "To clarify", translation: "Clarifier / Préciser", example: "The nurse asked the patient to clarify which symptoms had started first." },
      { id: "com-6", word: "To comply", translation: "Se conformer / Respecter (le traitement)", example: "It is essential that the patient complies with the prescribed medication schedule." },
    ],
  },
];

const ALL_CARDS: Card[] = CATEGORIES.flatMap((cat) =>
  cat.cards.map((c) => ({
    ...c,
    categoryId: cat.id,
    categoryLabel: cat.label,
    categoryIcon: cat.icon,
  }))
);

const TOTAL_CARDS = ALL_CARDS.length;
const SRS_KEY = "oet_vocabulary_srs";
const LEARNED_KEY = "oet_vocabulary_learned";

/* ─── SRS utils ──────────────────────────────────────────────────── */

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function calcNext(entry: SRSEntry | null, rating: Rating): SRSEntry {
  const today = todayStr();
  if (!entry) entry = { interval: 1, ease: 2.5, due: today, reps: 0 };
  switch (rating) {
    case "again":
      return { ...entry, interval: 1, due: addDays(today, 1), reps: entry.reps };
    case "hard": {
      const interval = Math.max(1, Math.round(entry.interval * 1.2));
      const ease = Math.max(1.3, entry.ease - 0.15);
      return { interval, ease, due: addDays(today, interval), reps: entry.reps + 1 };
    }
    case "good": {
      const interval =
        entry.reps === 0 ? 1 : entry.reps === 1 ? 3 : Math.round(entry.interval * entry.ease);
      const ease = Math.min(3.0, entry.ease + 0.1);
      return { interval, ease, due: addDays(today, interval), reps: entry.reps + 1 };
    }
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDueCards(srs: SRSStore): Card[] {
  const today = todayStr();
  return ALL_CARDS.filter((c) => {
    const e = srs[c.id];
    return e && e.due <= today;
  });
}

function getNewCards(srs: SRSStore): Card[] {
  return ALL_CARDS.filter((c) => !srs[c.id]);
}

function getLearnedIds(srs: SRSStore): string[] {
  return ALL_CARDS.filter((c) => {
    const e = srs[c.id];
    return e && e.reps >= 2;
  }).map((c) => c.id);
}

function getDistractors(card: Card, count = 3): string[] {
  const pool = ALL_CARDS.filter((c) => c.id !== card.id);
  return shuffle(pool).slice(0, count).map((c) => c.translation);
}

/* ─── Flashcard component ────────────────────────────────────────── */

function FlashcardMode({
  srs,
  onRate,
  onBack,
}: {
  srs: SRSStore;
  onRate: (cardId: string, rating: Rating) => void;
  onBack: () => void;
}) {
  const due = getDueCards(srs);
  const newCards = getNewCards(srs);
  const queue = shuffle([...due, ...newCards.slice(0, Math.max(5, 10 - due.length))]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionRatings, setSessionRatings] = useState<Rating[]>([]);

  const card = queue[index];

  function handleRate(rating: Rating) {
    onRate(card.id, rating);
    setSessionRatings((prev) => [...prev, rating]);
    setFlipped(false);
    if (index + 1 >= queue.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-[#00C2C7]/10 flex items-center justify-center">
          <span className="text-4xl">🎉</span>
        </div>
        <div>
          <p className="text-xl font-bold text-[#0B1E4B] mb-2">Aucune carte à réviser</p>
          <p className="text-sm text-gray-500">Toutes vos révisions sont à jour. Revenez demain !</p>
        </div>
        <button onClick={onBack} className="px-6 py-3 bg-[#0B1E4B] text-white rounded-xl font-semibold text-sm">
          ← Retour
        </button>
      </div>
    );
  }

  if (done) {
    const good = sessionRatings.filter((r) => r === "good").length;
    const hard = sessionRatings.filter((r) => r === "hard").length;
    const again = sessionRatings.filter((r) => r === "again").length;
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#00C2C7]/10 flex items-center justify-center">
          <span className="text-4xl">✅</span>
        </div>
        <div>
          <p className="text-xl font-bold text-[#0B1E4B] mb-1">Session terminée !</p>
          <p className="text-sm text-gray-500">{queue.length} cartes révisées</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{good}</p>
            <p className="text-xs text-gray-500 mt-0.5">Bien</p>
          </div>
          <div className="text-center px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-2xl font-bold text-orange-500">{hard}</p>
            <p className="text-xs text-gray-500 mt-0.5">Difficile</p>
          </div>
          <div className="text-center px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-2xl font-bold text-red-500">{again}</p>
            <p className="text-xs text-gray-500 mt-0.5">À revoir</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setIndex(0); setFlipped(false); setDone(false); setSessionRatings([]); }}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm"
          >
            Recommencer
          </button>
          <button onClick={onBack} className="px-5 py-2.5 bg-[#0B1E4B] text-white rounded-xl font-semibold text-sm">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const isDue = !!srs[card.id];
  const entry = srs[card.id];
  const nextGood = calcNext(entry ?? null, "good").interval;
  const nextHard = calcNext(entry ?? null, "hard").interval;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress bar */}
      <div className="w-full flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-[#0B1E4B] text-sm flex-shrink-0">← Retour</button>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
            style={{ width: `${(index / queue.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{index + 1} / {queue.length}</span>
      </div>

      {/* Badge */}
      <div className="flex gap-2">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDue ? "bg-amber-100 text-amber-700" : "bg-[#00C2C7]/10 text-[#009DA1]"}`}>
          {isDue ? "Révision" : "Nouveau"}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
          {card.categoryIcon} {card.categoryLabel}
        </span>
      </div>

      {/* Flip card */}
      <div
        className="w-full cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => !flipped && setFlipped(true)}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            height: "260px",
          }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className="absolute inset-0 bg-white border-2 border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 shadow-sm"
          >
            <p className="text-3xl font-bold text-[#0B1E4B] text-center mb-3">{card.word}</p>
            <p className="text-sm text-gray-400">Appuyez pour révéler la traduction</p>
          </div>

          {/* Back */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 bg-[#0B1E4B] border-2 border-[#0B1E4B] rounded-3xl flex flex-col items-center justify-center p-8 shadow-sm"
          >
            <p className="text-2xl font-bold text-white text-center mb-3">{card.translation}</p>
            <p className="text-sm text-white/60 text-center leading-relaxed italic">&ldquo;{card.example}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Rating buttons — shown only after flip */}
      {flipped ? (
        <div className="w-full flex flex-col gap-3">
          <p className="text-xs text-center text-gray-400">Comment vous en souvenez-vous ?</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleRate("again")}
              className="flex flex-col items-center gap-1 py-3 px-2 bg-red-50 border border-red-200 rounded-2xl hover:bg-red-100 transition-colors"
            >
              <span className="text-lg">🔁</span>
              <span className="text-sm font-semibold text-red-600">À revoir</span>
              <span className="text-[10px] text-gray-400">demain</span>
            </button>
            <button
              onClick={() => handleRate("hard")}
              className="flex flex-col items-center gap-1 py-3 px-2 bg-orange-50 border border-orange-200 rounded-2xl hover:bg-orange-100 transition-colors"
            >
              <span className="text-lg">😓</span>
              <span className="text-sm font-semibold text-orange-600">Difficile</span>
              <span className="text-[10px] text-gray-400">{nextHard}j</span>
            </button>
            <button
              onClick={() => handleRate("good")}
              className="flex flex-col items-center gap-1 py-3 px-2 bg-green-50 border border-green-200 rounded-2xl hover:bg-green-100 transition-colors"
            >
              <span className="text-lg">✅</span>
              <span className="text-sm font-semibold text-green-600">Bien</span>
              <span className="text-[10px] text-gray-400">{nextGood}j</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setFlipped(true)}
          className="w-full py-3 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold rounded-xl transition-colors text-sm"
        >
          Révéler la réponse
        </button>
      )}
    </div>
  );
}

/* ─── Quiz component ─────────────────────────────────────────────── */

type QuizQuestion = {
  card: Card;
  options: string[];   // 4 translations, shuffled
  correctIndex: number;
};

function buildQuiz(cards: Card[]): QuizQuestion[] {
  return shuffle(cards).map((card) => {
    const distractors = getDistractors(card, 3);
    const options = shuffle([card.translation, ...distractors]);
    return { card, options, correctIndex: options.indexOf(card.translation) };
  });
}

function QuizMode({ onBack }: { onBack: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function startQuiz() {
    const cards =
      selectedCategory === "all"
        ? ALL_CARDS
        : ALL_CARDS.filter((c) => c.categoryId === selectedCategory);
    setQuestions(buildQuiz(cards));
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === questions![qIndex].correctIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (qIndex + 1 >= questions!.length) {
      setDone(true);
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
    }
  }

  // Category picker
  if (!questions) {
    return (
      <div className="flex flex-col gap-6">
        <button onClick={onBack} className="text-gray-400 hover:text-[#0B1E4B] text-sm self-start">← Retour</button>
        <div>
          <p className="text-sm text-gray-500 mb-1">Quiz OET</p>
          <h2 className="text-xl font-bold text-[#0B1E4B] mb-1">Quiz vocabulaire</h2>
          <p className="text-sm text-gray-400">Choisissez une catégorie ou testez-vous sur tout le vocabulaire.</p>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
              selectedCategory === "all"
                ? "border-[#0B1E4B] bg-[#0B1E4B]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span className="font-semibold text-[#0B1E4B]">Tout le vocabulaire</span>
              </div>
              <span className="text-xs text-gray-400">{TOTAL_CARDS} mots</span>
            </div>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                selectedCategory === cat.id
                  ? "border-[#0B1E4B] bg-[#0B1E4B]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-semibold text-[#0B1E4B]">{cat.label}</span>
                </div>
                <span className="text-xs text-gray-400">{cat.cards.length} mots</span>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={startQuiz}
          className="w-full py-3.5 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold rounded-xl transition-colors"
        >
          Démarrer le quiz →
        </button>
      </div>
    );
  }

  if (done) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#00C2C7]/10 flex items-center justify-center">
          <span className="text-4xl">{pct >= 70 ? "🏆" : pct >= 40 ? "💪" : "📖"}</span>
        </div>
        <div>
          <p className="text-xl font-bold text-[#0B1E4B] mb-1">Quiz terminé !</p>
          <p className="text-sm text-gray-500">{score} / {total} réponses correctes</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: pct >= 70 ? "#00C2C7" : pct >= 40 ? "#f59e0b" : "#f97316" }}
          />
        </div>
        <p className="text-3xl font-bold" style={{ color: pct >= 70 ? "#009DA1" : pct >= 40 ? "#d97706" : "#ea580c" }}>
          {pct}%
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setQuestions(null); }}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm"
          >
            Changer
          </button>
          <button
            onClick={startQuiz}
            className="px-5 py-2.5 bg-[#0B1E4B] text-white rounded-xl font-semibold text-sm"
          >
            Recommencer
          </button>
        </div>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-[#0B1E4B]">← Retour au menu</button>
      </div>
    );
  }

  const q = questions[qIndex];
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-[#0B1E4B] text-sm flex-shrink-0">← Retour</button>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
            style={{ width: `${(qIndex / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{qIndex + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="bg-[#0B1E4B] rounded-2xl p-6 text-center">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-3">Quelle est la traduction de :</p>
        <p className="text-3xl font-bold text-white mb-2">{q.card.word}</p>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/60">
          {q.card.categoryIcon} {q.card.categoryLabel}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q.options.map((opt, idx) => {
          const isCorrect = idx === q.correctIndex;
          const isSelected = selected === idx;
          let cls = "w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-sm ";
          if (selected === null) {
            cls += "border-gray-200 bg-white hover:border-[#0B1E4B]/40 hover:bg-[#0B1E4B]/5 text-[#0B1E4B]";
          } else if (isCorrect) {
            cls += "border-green-400 bg-green-50 text-green-700";
          } else if (isSelected) {
            cls += "border-red-400 bg-red-50 text-red-600";
          } else {
            cls += "border-gray-100 bg-gray-50 text-gray-400";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <span className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  selected === null ? "border-gray-300 text-gray-400"
                    : isCorrect ? "border-green-400 bg-green-400 text-white"
                    : isSelected ? "border-red-400 bg-red-400 text-white"
                    : "border-gray-200 text-gray-300"
                }`}>
                  {selected !== null && isCorrect ? "✓" : selected !== null && isSelected ? "✗" : ["A","B","C","D"][idx]}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Example (shown after answer) */}
      {selected !== null && (
        <div className="bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">Exemple clinique</p>
          <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{q.card.example}&rdquo;</p>
        </div>
      )}

      {/* Next */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold rounded-xl transition-colors"
        >
          {qIndex + 1 >= questions.length ? "Voir les résultats →" : "Question suivante →"}
        </button>
      )}
    </div>
  );
}

/* ─── Browse component ───────────────────────────────────────────── */

function BrowseMode({ srs, onSrsUpdate }: { srs: SRSStore; onSrsUpdate: (srs: SRSStore) => void }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  function toggleLearned(cardId: string) {
    const existing = srs[cardId];
    const next = { ...srs };
    if (existing && existing.reps >= 2) {
      delete next[cardId];
    } else {
      next[cardId] = calcNext(existing ?? null, "good");
    }
    onSrsUpdate(next);
  }

  const category = CATEGORIES.find((c) => c.id === activeCategory)!;
  const categoryLearned = category.cards.filter((c) => srs[c.id] && srs[c.id].reps >= 2).length;

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => {
          const catLearned = cat.cards.filter((c) => srs[c.id] && srs[c.id].reps >= 2).length;
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
              {catLearned > 0 && (
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

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{category.icon}</span>
          <h2 className="font-semibold text-[#0B1E4B]">{category.label}</h2>
        </div>
        <span className="text-xs text-gray-400">{categoryLearned} / {category.cards.length} maîtrisés</span>
      </div>

      <div className="space-y-3">
        {category.cards.map((rawCard) => {
          const card = ALL_CARDS.find((c) => c.id === rawCard.id)!;
          const entry = srs[card.id];
          const learned = entry && entry.reps >= 2;
          const due = entry && entry.due <= todayStr();
          return (
            <div
              key={card.id}
              className={`bg-white border rounded-2xl p-5 transition-all ${
                learned
                  ? "border-[#00C2C7]/30 bg-[#00C2C7]/5"
                  : due
                  ? "border-amber-200 bg-amber-50/40"
                  : "border-gray-200 hover:border-[#00C2C7]/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-base font-bold text-[#0B1E4B]">{card.word}</span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="text-sm font-medium text-gray-600 italic">{card.translation}</span>
                    {due && !learned && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">À réviser</span>
                    )}
                    {learned && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C2C7]/15 text-[#009DA1] font-medium">
                        ✓ Maîtrisé — revu dans {entry!.interval}j
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    <span className="text-[#00C2C7] font-medium">Ex. </span>
                    {card.example}
                  </p>
                </div>
                <button
                  onClick={() => toggleLearned(card.id)}
                  title={learned ? "Marquer comme à revoir" : "Marquer comme maîtrisé"}
                  className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    learned
                      ? "border-[#00C2C7] bg-[#00C2C7] text-white"
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
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export default function VocabularyClient() {
  const [mode, setMode] = useState<Mode>("home");
  const [srs, setSrs] = useState<SRSStore>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SRS_KEY);
      if (raw) setSrs(JSON.parse(raw) as SRSStore);
    } catch {}
    setHydrated(true);
  }, []);

  const saveSrs = useCallback((next: SRSStore) => {
    setSrs(next);
    try {
      localStorage.setItem(SRS_KEY, JSON.stringify(next));
      // Keep oet_vocabulary_learned in sync for readiness scoring
      const learnedIds = getLearnedIds(next);
      localStorage.setItem(LEARNED_KEY, JSON.stringify(learnedIds));
    } catch {}
  }, []);

  function handleRate(cardId: string, rating: Rating) {
    const next = { ...srs, [cardId]: calcNext(srs[cardId] ?? null, rating) };
    saveSrs(next);
  }

  const dueCards = hydrated ? getDueCards(srs) : [];
  const newCards = hydrated ? getNewCards(srs) : [];
  const learnedIds = hydrated ? getLearnedIds(srs) : [];
  const learnedCount = learnedIds.length;
  const progressPct = Math.round((learnedCount / TOTAL_CARDS) * 100);

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

          {mode === "flashcard" && (
            <FlashcardMode srs={srs} onRate={handleRate} onBack={() => setMode("home")} />
          )}

          {mode === "quiz" && (
            <QuizMode onBack={() => setMode("home")} />
          )}

          {mode === "browse" && (
            <>
              <div className="mb-6">
                <button onClick={() => setMode("home")} className="text-sm text-gray-400 hover:text-[#0B1E4B] mb-4 block">← Retour</button>
                <h1 className="text-2xl font-bold text-[#0B1E4B]">Parcourir les fiches</h1>
              </div>
              <BrowseMode srs={srs} onSrsUpdate={saveSrs} />
            </>
          )}

          {mode === "home" && (
            <>
              {/* Page title */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Vocabulaire médical</p>
                <h1 className="text-2xl font-bold text-[#0B1E4B]">Révisions OET</h1>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className={`rounded-2xl p-4 border text-center ${dueCards.length > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
                  <p className={`text-2xl font-bold ${dueCards.length > 0 ? "text-amber-600" : "text-[#0B1E4B]"}`}>
                    {hydrated ? dueCards.length : "—"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">À réviser</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#0B1E4B]">{hydrated ? newCards.length : "—"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Nouveaux</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#009DA1]">{hydrated ? learnedCount : "—"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Maîtrisés</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Progression globale</span>
                  <span>{learnedCount} / {TOTAL_CARDS} mots</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%`, background: progressPct === 100 ? "#00C2C7" : "#0B1E4B" }}
                  />
                </div>
                {learnedCount === TOTAL_CARDS && hydrated && (
                  <p className="text-sm text-[#009DA1] font-medium mt-2 text-center">🎉 Tout le vocabulaire maîtrisé !</p>
                )}
              </div>

              {/* Daily review banner */}
              {hydrated && dueCards.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Révisions du jour prêtes</p>
                    <p className="text-xs text-amber-600 mt-0.5">{dueCards.length} carte{dueCards.length > 1 ? "s" : ""} à réviser aujourd&apos;hui</p>
                  </div>
                  <button
                    onClick={() => setMode("flashcard")}
                    className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Réviser →
                  </button>
                </div>
              )}

              {/* Mode cards */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setMode("flashcard")}
                  className="w-full bg-[#0B1E4B] hover:bg-[#152960] text-white rounded-2xl p-5 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🃏</span>
                        <span className="font-bold text-base">Flashcards</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Répétition espacée · Flip cards · Évaluation Again / Difficile / Bien
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <span className="text-white text-sm">→</span>
                    </div>
                  </div>
                  {hydrated && (
                    <div className="mt-3 flex gap-2">
                      {dueCards.length > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200">
                          {dueCards.length} à réviser
                        </span>
                      )}
                      {newCards.length > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/60">
                          {Math.min(newCards.length, 10)} nouveaux
                        </span>
                      )}
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setMode("quiz")}
                  className="w-full bg-white hover:bg-[#F7F9FC] border border-gray-200 hover:border-[#00C2C7]/40 rounded-2xl p-5 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🧠</span>
                        <span className="font-bold text-base text-[#0B1E4B]">Quiz QCM</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        4 choix de traduction · Par catégorie ou tout le vocabulaire
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0B1E4B]/5 flex items-center justify-center group-hover:bg-[#00C2C7]/15 transition-colors">
                      <span className="text-[#0B1E4B] text-sm">→</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setMode("browse")}
                  className="w-full bg-white hover:bg-[#F7F9FC] border border-gray-200 hover:border-[#00C2C7]/40 rounded-2xl p-5 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">📖</span>
                        <span className="font-bold text-base text-[#0B1E4B]">Parcourir les fiches</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Toutes les {TOTAL_CARDS} fiches · Exemples cliniques · Marquer comme maîtrisé
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0B1E4B]/5 flex items-center justify-center group-hover:bg-[#00C2C7]/15 transition-colors">
                      <span className="text-[#0B1E4B] text-sm">→</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* SRS explanation */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 mb-6">
                <p className="text-xs font-semibold text-gray-600 mb-1">Comment fonctionne la répétition espacée ?</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Chaque carte est planifiée selon votre évaluation : <strong className="text-red-500">À revoir</strong> = demain, <strong className="text-orange-500">Difficile</strong> = intervalle court, <strong className="text-green-600">Bien</strong> = intervalle croissant. Plus vous répondez bien, moins souvent vous verrez la carte.
                </p>
              </div>

              {/* Footer nav */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/plan"
                  className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >
                  ← Mon plan OET
                </Link>
                <Link
                  href="/daily-practice"
                  className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                >
                  Démarrer ma formation →
                </Link>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
