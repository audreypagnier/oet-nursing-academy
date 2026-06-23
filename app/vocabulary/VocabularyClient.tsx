"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

/* ─── Data ───────────────────────────────────────────────────────── */

type RawCard = { id: string; word: string; translation: string; example: string };
type Card = RawCard & { categoryId: string; categoryLabel: string; categoryIcon: string };

type Category = {
  id: string; label: string; icon: string; color: string; accent: string; cards: RawCard[];
};

const CATEGORIES: Category[] = [
  {
    id: "symptoms", label: "Symptômes", icon: "🩺",
    color: "border-rose-200 bg-rose-50", accent: "bg-rose-100 text-rose-700",
    cards: [
      { id: "sym-1", word: "Dyspnea",       translation: "Dyspnée",                        example: "The patient presented with acute dyspnea and required immediate oxygen therapy." },
      { id: "sym-2", word: "Palpitations",   translation: "Palpitations",                   example: "She reported intermittent palpitations over the past three days." },
      { id: "sym-3", word: "Diaphoresis",    translation: "Diaphorèse (sueurs froides)",    example: "On assessment, the patient was pale and showed signs of diaphoresis." },
      { id: "sym-4", word: "Nausea",         translation: "Nausée",                         example: "Post-operative nausea was managed with antiemetic medication." },
      { id: "sym-5", word: "Lethargy",       translation: "Léthargie",                      example: "The child displayed lethargy and was unresponsive to verbal stimuli." },
      { id: "sym-6", word: "Haemoptysis",    translation: "Hémoptysie (crachat de sang)",   example: "The patient reported haemoptysis, prompting an urgent chest X-ray." },
    ],
  },
  {
    id: "medication", label: "Médicaments", icon: "💊",
    color: "border-blue-200 bg-blue-50", accent: "bg-blue-100 text-blue-700",
    cards: [
      { id: "med-1", word: "Anticoagulant",  translation: "Anticoagulant",                  example: "The patient was commenced on an anticoagulant to prevent further clot formation." },
      { id: "med-2", word: "Analgesic",      translation: "Analgésique",                    example: "A mild analgesic was prescribed to manage the patient's post-operative pain." },
      { id: "med-3", word: "Diuretic",       translation: "Diurétique",                     example: "The diuretic was administered to reduce fluid overload in the cardiac patient." },
      { id: "med-4", word: "Bronchodilator", translation: "Bronchodilatateur",              example: "The nurse administered a bronchodilator via nebuliser during the asthma attack." },
      { id: "med-5", word: "Antiemetic",     translation: "Antiémétique",                   example: "An antiemetic was given prior to chemotherapy to reduce nausea." },
      { id: "med-6", word: "Sedative",       translation: "Sédatif",                        example: "A low-dose sedative was prescribed to help the patient sleep before surgery." },
    ],
  },
  {
    id: "surgery", label: "Chirurgie", icon: "🔬",
    color: "border-purple-200 bg-purple-50", accent: "bg-purple-100 text-purple-700",
    cards: [
      { id: "sur-1", word: "Incision",       translation: "Incision",                       example: "The surgeon made a clean incision along the midline of the abdomen." },
      { id: "sur-2", word: "Suture",         translation: "Suture / Point de suture",       example: "The wound was closed with absorbable sutures and dressed with a sterile bandage." },
      { id: "sur-3", word: "Anaesthesia",    translation: "Anesthésie",                     example: "General anaesthesia was induced before the procedure began." },
      { id: "sur-4", word: "Haemostasis",    translation: "Hémostase",                      example: "Haemostasis was achieved using electrocautery during the operation." },
      { id: "sur-5", word: "Debridement",    translation: "Débridement",                    example: "Surgical debridement was performed to remove necrotic tissue from the wound." },
      { id: "sur-6", word: "Laparotomy",     translation: "Laparotomie",                    example: "An emergency laparotomy was performed following abdominal trauma." },
    ],
  },
  {
    id: "cardiology", label: "Cardiologie", icon: "❤️",
    color: "border-[#00C2C7]/30 bg-[#00C2C7]/5", accent: "bg-[#00C2C7]/15 text-[#009DA1]",
    cards: [
      { id: "car-1", word: "Arrhythmia",            translation: "Arythmie",                   example: "The ECG confirmed a ventricular arrhythmia requiring immediate intervention." },
      { id: "car-2", word: "Tachycardia",            translation: "Tachycardie",                example: "The patient developed tachycardia with a heart rate of 130 beats per minute." },
      { id: "car-3", word: "Bradycardia",            translation: "Bradycardie",                example: "Severe bradycardia was noted and atropine was administered promptly." },
      { id: "car-4", word: "Myocardial infarction",  translation: "Infarctus du myocarde",      example: "The patient was transferred to the coronary unit following a myocardial infarction." },
      { id: "car-5", word: "Atrial fibrillation",    translation: "Fibrillation auriculaire",   example: "Atrial fibrillation was identified on the monitor and rate control was initiated." },
      { id: "car-6", word: "Peripheral oedema",      translation: "Œdème périphérique",         example: "Bilateral peripheral oedema was present, suggesting heart failure." },
    ],
  },
  {
    id: "communication", label: "Communication", icon: "💬",
    color: "border-amber-200 bg-amber-50", accent: "bg-amber-100 text-amber-700",
    cards: [
      { id: "com-1", word: "To reassure",  translation: "Rassurer",                            example: "The nurse took time to reassure the patient before explaining the procedure." },
      { id: "com-2", word: "To consent",   translation: "Consentir / Donner son accord",        example: "The patient was asked to consent to the treatment after receiving full information." },
      { id: "com-3", word: "To refer",     translation: "Orienter / Adresser",                  example: "The GP decided to refer the patient to a specialist for further assessment." },
      { id: "com-4", word: "To discharge", translation: "Sortir / Libérer (de l'hôpital)",      example: "The patient was ready to be discharged with a detailed care plan." },
      { id: "com-5", word: "To clarify",   translation: "Clarifier / Préciser",                 example: "The nurse asked the patient to clarify which symptoms had started first." },
      { id: "com-6", word: "To comply",    translation: "Se conformer / Respecter (le traitement)", example: "It is essential that the patient complies with the prescribed medication schedule." },
    ],
  },
];

const ALL_CARDS: Card[] = CATEGORIES.flatMap((cat) =>
  cat.cards.map((c) => ({ ...c, categoryId: cat.id, categoryLabel: cat.label, categoryIcon: cat.icon }))
);
const TOTAL_CARDS = ALL_CARDS.length;

/* ─── Storage keys ───────────────────────────────────────────────── */

const KNOWN_KEY   = "oet_vocab_known";      // string[] — card IDs marked "Je connais"
const REVIEW_KEY  = "oet_vocab_review";     // string[] — card IDs marked "À revoir"
const STREAK_KEY  = "oet_vocab_streak";     // StreakData
const LEGACY_KEY  = "oet_vocabulary_learned"; // kept for readiness compat

/* ─── Types ──────────────────────────────────────────────────────── */

type Tab = "flashcards" | "quiz" | "parcourir";

type StreakData = {
  lastDate: string;
  count: number;
  weeklyActivity: Record<string, number>; // YYYY-MM-DD → words reviewed count
};

type QuizType = "en_fr" | "fr_en" | "fill_blank" | "clinical_mcq";

type QuizQuestion = {
  type: QuizType;
  card: Card;
  prompt: string;
  context?: string;      // sentence with blank for fill/clinical types
  options: string[];     // 4 answer options
  correctIndex: number;
};

/* ─── Utilities ──────────────────────────────────────────────────── */

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDistractors(card: Card, field: "word" | "translation", count = 3): string[] {
  return shuffle(ALL_CARDS.filter((c) => c.id !== card.id))
    .slice(0, count)
    .map((c) => c[field]);
}

function blankExample(card: Card): string {
  // Replace the English word in the example sentence with _____
  const wordRegex = new RegExp(card.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const blanked = card.example.replace(wordRegex, "_____");
  // If replacement didn't work (word not in example verbatim), blank the first noun-like chunk
  return blanked.includes("_____") ? blanked : card.example;
}

/* ─── Daily set generation ───────────────────────────────────────── */

function getDailyCards(known: Set<string>, review: Set<string>): Card[] {
  const reviewCards = shuffle(ALL_CARDS.filter((c) => review.has(c.id))).slice(0, 5);
  const remaining = 10 - reviewCards.length;
  const newCards   = shuffle(ALL_CARDS.filter((c) => !known.has(c.id) && !review.has(c.id))).slice(0, remaining);
  const rem2 = remaining - newCards.length;
  const knownCards = shuffle(ALL_CARDS.filter((c) => known.has(c.id) && !review.has(c.id))).slice(0, rem2);
  return shuffle([...reviewCards, ...newCards, ...knownCards]);
}

/* ─── Quiz builder ───────────────────────────────────────────────── */

function buildQuizQuestions(known: Set<string>, review: Set<string>): QuizQuestion[] {
  // Priority cards: review first, then new, then known
  const priority = [
    ...shuffle(ALL_CARDS.filter((c) => review.has(c.id))),
    ...shuffle(ALL_CARDS.filter((c) => !known.has(c.id) && !review.has(c.id))),
    ...shuffle(ALL_CARDS.filter((c) => known.has(c.id))),
  ];
  const pool = priority.slice(0, 10);
  const types: QuizType[] = ["en_fr", "fr_en", "fill_blank", "clinical_mcq", "en_fr", "fr_en", "fill_blank", "clinical_mcq", "en_fr", "fr_en"];

  return shuffle(pool).slice(0, 10).map((card, i) => {
    const type = types[i % types.length];
    return buildQuestion(card, type);
  });
}

function buildQuestion(card: Card, type: QuizType): QuizQuestion {
  switch (type) {
    case "en_fr": {
      const distractors = getDistractors(card, "translation", 3);
      const options = shuffle([card.translation, ...distractors]);
      return {
        type, card,
        prompt: `Quelle est la traduction française de « ${card.word} » ?`,
        options,
        correctIndex: options.indexOf(card.translation),
      };
    }
    case "fr_en": {
      const distractors = getDistractors(card, "word", 3);
      const options = shuffle([card.word, ...distractors]);
      return {
        type, card,
        prompt: `Quel terme médical anglais correspond à « ${card.translation} » ?`,
        options,
        correctIndex: options.indexOf(card.word),
      };
    }
    case "fill_blank": {
      const context = blankExample(card);
      const distractors = getDistractors(card, "word", 3);
      const options = shuffle([card.word, ...distractors]);
      return {
        type, card,
        prompt: "Complétez la phrase clinique :",
        context,
        options,
        correctIndex: options.indexOf(card.word),
      };
    }
    case "clinical_mcq": {
      const context = blankExample(card);
      const distractors = getDistractors(card, "word", 3);
      const options = shuffle([card.word, ...distractors]);
      return {
        type, card,
        prompt: "Quel terme médical complète cette situation clinique ?",
        context,
        options,
        correctIndex: options.indexOf(card.word),
      };
    }
  }
}

/* ─── Streak helpers ─────────────────────────────────────────────── */

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakData;
  } catch {}
  return { lastDate: "", count: 0, weeklyActivity: {} };
}

function saveStreak(s: StreakData) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(s)); } catch {}
}

function updateStreakActivity(delta: number): StreakData {
  const today = todayStr();
  const s = loadStreak();
  s.weeklyActivity[today] = (s.weeklyActivity[today] ?? 0) + delta;

  // Update streak count
  if (s.lastDate === today) {
    // already active today, no change to streak count
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    if (s.lastDate === yStr) {
      s.count += 1;
    } else if (s.lastDate !== today) {
      s.count = 1;
    }
    s.lastDate = today;
  }
  saveStreak(s);
  return s;
}

function weeklyLearned(s: StreakData): number {
  const today = new Date();
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    total += s.weeklyActivity[k] ?? 0;
  }
  return total;
}

function masteryLevel(pct: number): { label: string; color: string } {
  if (pct >= 90) return { label: "Expert OET",      color: "text-[#009DA1]" };
  if (pct >= 70) return { label: "Avancé",           color: "text-[#0B1E4B]" };
  if (pct >= 50) return { label: "Intermédiaire",    color: "text-purple-600" };
  if (pct >= 25) return { label: "En progression",   color: "text-amber-600" };
  return              { label: "Débutant",           color: "text-gray-500" };
}

/* ─── FlashcardSession component ─────────────────────────────────── */

function FlashcardSession({
  known, review, onKnown, onReview, onBack,
}: {
  known: Set<string>;
  review: Set<string>;
  onKnown: (id: string) => void;
  onReview: (id: string) => void;
  onBack: () => void;
}) {
  const [queue]      = useState<Card[]>(() => getDailyCards(known, review));
  const [index, setIndex]       = useState(0);
  const [flipped, setFlipped]   = useState(false);
  const [done, setDone]         = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  const card = queue[index];

  function handleKnown() {
    onKnown(card.id);
    setKnownCount((n) => n + 1);
    advance();
  }

  function handleReview() {
    onReview(card.id);
    advance();
  }

  function advance() {
    setFlipped(false);
    if (index + 1 >= queue.length) setDone(true);
    else setIndex((i) => i + 1);
  }

  if (queue.length === 0) {
    return (
      <SessionShell onBack={onBack} title="Flashcards du jour">
        <div className="flex flex-col items-center gap-5 py-12 text-center">
          <span className="text-5xl">🎉</span>
          <p className="text-lg font-bold text-[#0B1E4B]">Aucune carte à réviser</p>
          <p className="text-sm text-gray-500">Toutes vos révisions sont à jour !</p>
          <button onClick={onBack} className="px-6 py-3 bg-[#0B1E4B] text-white rounded-xl font-semibold text-sm">← Retour</button>
        </div>
      </SessionShell>
    );
  }

  if (done) {
    return (
      <SessionShell onBack={onBack} title="Session terminée">
        <div className="flex flex-col items-center gap-5 py-8 text-center">
          <span className="text-5xl">✅</span>
          <p className="text-xl font-bold text-[#0B1E4B]">Session complète !</p>
          <p className="text-sm text-gray-500">{queue.length} cartes révisées</p>
          <div className="flex gap-4">
            <div className="px-5 py-3 bg-[#00C2C7]/10 border border-[#00C2C7]/30 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#009DA1]">{knownCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Je connais</p>
            </div>
            <div className="px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-2xl font-bold text-amber-600">{queue.length - knownCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">À revoir</p>
            </div>
          </div>
          <button onClick={onBack} className="px-6 py-3 bg-[#0B1E4B] text-white rounded-xl font-semibold text-sm">← Retour au menu</button>
        </div>
      </SessionShell>
    );
  }

  const isInReview = review.has(card.id);
  const isKnown    = known.has(card.id);

  return (
    <SessionShell onBack={onBack} title="Flashcards du jour">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
            style={{ width: `${(index / queue.length) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{index + 1} / {queue.length}</span>
      </div>

      {/* Status badge */}
      <div className="flex gap-2 justify-center mb-4">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          isInReview ? "bg-amber-100 text-amber-700" : isKnown ? "bg-[#00C2C7]/10 text-[#009DA1]" : "bg-gray-100 text-gray-500"
        }`}>
          {isInReview ? "À revoir" : isKnown ? "Connu" : "Nouveau"}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
          {card.categoryIcon} {card.categoryLabel}
        </span>
      </div>

      {/* Flip card */}
      <div className="mb-5" style={{ perspective: "1200px" }}>
        <div style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          position: "relative", height: "220px",
        }}>
          {/* Front */}
          <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className="absolute inset-0 bg-white border-2 border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 cursor-pointer shadow-sm"
            onClick={() => setFlipped(true)}>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-3">Terme médical anglais</p>
            <p className="text-2xl font-bold text-[#0B1E4B] text-center">{card.word}</p>
            {!flipped && <p className="text-xs text-gray-300 mt-4">Appuyez pour retourner</p>}
          </div>
          {/* Back */}
          <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            className="absolute inset-0 bg-[#0B1E4B] rounded-3xl flex flex-col items-center justify-center p-6 shadow-sm">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Traduction française</p>
            <p className="text-xl font-bold text-white text-center mb-3">{card.translation}</p>
            <p className="text-xs text-white/60 text-center leading-relaxed italic">&ldquo;{card.example}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!flipped ? (
        <button onClick={() => setFlipped(true)}
          className="w-full py-3 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold rounded-xl text-sm transition-colors">
          Retourner la carte
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleReview}
            className="flex flex-col items-center gap-1.5 py-4 bg-amber-50 border-2 border-amber-200 hover:bg-amber-100 rounded-2xl transition-colors">
            <span className="text-xl">🔁</span>
            <span className="text-sm font-bold text-amber-700">À revoir</span>
            <span className="text-[10px] text-amber-500">Réapparaîtra bientôt</span>
          </button>
          <button onClick={handleKnown}
            className="flex flex-col items-center gap-1.5 py-4 bg-[#00C2C7]/10 border-2 border-[#00C2C7]/40 hover:bg-[#00C2C7]/20 rounded-2xl transition-colors">
            <span className="text-xl">✅</span>
            <span className="text-sm font-bold text-[#009DA1]">Je connais</span>
            <span className="text-[10px] text-[#009DA1]/70">Moins souvent</span>
          </button>
        </div>
      )}
    </SessionShell>
  );
}

/* ─── QuizSession component ──────────────────────────────────────── */

function QuizSession({
  known, review, onBack,
}: {
  known: Set<string>;
  review: Set<string>;
  onBack: () => void;
}) {
  const [questions] = useState<QuizQuestion[]>(() => buildQuizQuestions(known, review));
  const [index, setIndex]       = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);

  const q = questions[index];

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  }

  function handleNext() {
    if (index + 1 >= questions.length) { setDone(true); return; }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  const TYPE_LABELS: Record<QuizType, string> = {
    en_fr: "Anglais → Français", fr_en: "Français → Anglais",
    fill_blank: "Complétez la phrase", clinical_mcq: "Contexte clinique",
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <SessionShell onBack={onBack} title="Quiz terminé">
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <span className="text-5xl">{pct >= 70 ? "🏆" : pct >= 40 ? "💪" : "📖"}</span>
          <div>
            <p className="text-xl font-bold text-[#0B1E4B]">{score} / {questions.length} bonnes réponses</p>
            <p className="text-3xl font-black mt-1" style={{ color: pct >= 70 ? "#009DA1" : pct >= 40 ? "#d97706" : "#ea580c" }}>{pct}%</p>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: pct >= 70 ? "#00C2C7" : pct >= 40 ? "#f59e0b" : "#f97316" }} />
          </div>
          <button onClick={onBack} className="px-6 py-3 bg-[#0B1E4B] text-white rounded-xl font-semibold text-sm">← Retour au menu</button>
        </div>
      </SessionShell>
    );
  }

  return (
    <SessionShell onBack={onBack} title="Quiz du jour">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#00C2C7] rounded-full transition-all duration-500"
            style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{index + 1}/{questions.length}</span>
      </div>

      {/* Type badge */}
      <div className="mb-4 flex gap-2">
        <span className="text-xs px-2.5 py-1 rounded-full bg-[#0B1E4B]/10 text-[#0B1E4B] font-medium">
          {TYPE_LABELS[q.type]}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
          {q.card.categoryIcon} {q.card.categoryLabel}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-[#0B1E4B] rounded-2xl p-5 mb-4">
        <p className="text-xs text-white/50 mb-2">{q.prompt}</p>
        {q.context ? (
          <p className="text-sm text-white leading-relaxed italic">&ldquo;{q.context}&rdquo;</p>
        ) : (
          <p className="text-xl font-bold text-white">{
            q.type === "en_fr" ? q.card.word : q.card.translation
          }</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {q.options.map((opt, idx) => {
          const isCorrect  = idx === q.correctIndex;
          const isSelected = selected === idx;
          let cls = "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm flex items-center gap-3 ";
          if (selected === null) {
            cls += "border-gray-200 bg-white hover:border-[#0B1E4B]/40 text-[#0B1E4B]";
          } else if (isCorrect) {
            cls += "border-green-400 bg-green-50 text-green-700";
          } else if (isSelected) {
            cls += "border-red-400 bg-red-50 text-red-600";
          } else {
            cls += "border-gray-100 bg-gray-50 text-gray-400";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                selected === null ? "border-gray-300 text-gray-400"
                  : isCorrect   ? "border-green-400 bg-green-400 text-white"
                  : isSelected  ? "border-red-400 bg-red-400 text-white"
                  : "border-gray-200 text-gray-300"
              }`}>
                {selected !== null && isCorrect ? "✓" : selected !== null && isSelected ? "✗" : ["A","B","C","D"][idx]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Clinical example reveal after answer */}
      {selected !== null && !q.context && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Exemple clinique</p>
          <p className="text-xs text-gray-600 italic leading-relaxed">&ldquo;{q.card.example}&rdquo;</p>
        </div>
      )}

      {selected !== null && (
        <button onClick={handleNext}
          className="w-full py-3 bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold rounded-xl text-sm transition-colors">
          {index + 1 >= questions.length ? "Voir les résultats →" : "Question suivante →"}
        </button>
      )}
    </SessionShell>
  );
}

/* ─── BrowseMode component ───────────────────────────────────────── */

function BrowseMode({ known, review }: { known: Set<string>; review: Set<string> }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div>
      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {CATEGORIES.map((cat) => {
          const catKnown  = cat.cards.filter((c) => known.has(c.id)).length;
          const isActive  = cat.id === activeCategory;
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isActive ? "bg-[#0B1E4B] text-white border-[#0B1E4B]" : "bg-white text-gray-600 border-gray-200 hover:border-[#0B1E4B]/40"
              }`}>
              {cat.icon} {cat.label}
              {catKnown > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20 text-white" : "bg-[#00C2C7]/15 text-[#009DA1]"}`}>
                  {catKnown}/{cat.cards.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {category.cards.map((raw) => {
          const isKnown   = known.has(raw.id);
          const isReview  = review.has(raw.id);
          return (
            <div key={raw.id} className={`bg-white border rounded-2xl p-4 transition-all ${
              isKnown ? "border-[#00C2C7]/30 bg-[#00C2C7]/5" : isReview ? "border-amber-200 bg-amber-50/40" : "border-gray-200"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-[#0B1E4B]">{raw.word}</span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="text-xs text-gray-600 italic">{raw.translation}</span>
                    {isKnown  && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00C2C7]/15 text-[#009DA1] font-medium">✓ Connu</span>}
                    {isReview && !isKnown && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">À revoir</span>}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="text-[#00C2C7] font-medium">Ex. </span>{raw.example}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SessionShell helper ────────────────────────────────────────── */

function SessionShell({ children, onBack, title }: { children: React.ReactNode; onBack: () => void; title: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-[#0B1E4B] transition-colors">← Retour</button>
        <span className="text-sm font-semibold text-[#0B1E4B]">{title}</span>
      </div>
      {children}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export default function VocabularyClient() {
  const [tab,      setTab]      = useState<Tab>("flashcards");
  const [mode,     setMode]     = useState<"menu" | "flashcard-session" | "quiz-session">("menu");
  const [known,    setKnown]    = useState<Set<string>>(new Set());
  const [review,   setReview]   = useState<Set<string>>(new Set());
  const [streak,   setStreak]   = useState<StreakData>({ lastDate: "", count: 0, weeklyActivity: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const k = localStorage.getItem(KNOWN_KEY);
      if (k) setKnown(new Set(JSON.parse(k) as string[]));
      const r = localStorage.getItem(REVIEW_KEY);
      if (r) setReview(new Set(JSON.parse(r) as string[]));
      setStreak(loadStreak());
    } catch {}
    setHydrated(true);
  }, []);

  const persistKnown = useCallback((next: Set<string>) => {
    setKnown(next);
    const ids = [...next];
    try {
      localStorage.setItem(KNOWN_KEY, JSON.stringify(ids));
      localStorage.setItem(LEGACY_KEY, JSON.stringify(ids)); // readiness compat
    } catch {}
  }, []);

  const persistReview = useCallback((next: Set<string>) => {
    setReview(next);
    try { localStorage.setItem(REVIEW_KEY, JSON.stringify([...next])); } catch {}
  }, []);

  function handleKnown(id: string) {
    const nextKnown  = new Set(known);  nextKnown.add(id);
    const nextReview = new Set(review); nextReview.delete(id);
    persistKnown(nextKnown);
    persistReview(nextReview);
    const s = updateStreakActivity(1);
    setStreak(s);
  }

  function handleReview(id: string) {
    const nextReview = new Set(review); nextReview.add(id);
    // Do NOT remove from known — a card can be in both (will be shown more often)
    persistReview(nextReview);
    const s = updateStreakActivity(1);
    setStreak(s);
  }

  // Stats
  const knownCount   = hydrated ? known.size : 0;
  const reviewCount  = hydrated ? review.size : 0;
  const masteryPct   = Math.round((knownCount / TOTAL_CARDS) * 100);
  const mastery      = masteryLevel(masteryPct);
  const weekLearned  = hydrated ? weeklyLearned(streak) : 0;
  const dailyCards   = hydrated ? getDailyCards(known, review) : [];
  const dueReview    = hydrated ? ALL_CARDS.filter((c) => review.has(c.id)).length : 0;

  if (!hydrated) {
    return (
      <Shell>
        <div className="w-full max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="h-10 w-48 bg-gray-200 rounded-xl" />
          <div className="h-36 bg-gray-200 rounded-2xl" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
        </div>
      </Shell>
    );
  }

  // ── Flashcard session ──
  if (mode === "flashcard-session") {
    return (
      <Shell>
        <div className="w-full max-w-lg mx-auto">
          <FlashcardSession
            known={known} review={review}
            onKnown={handleKnown} onReview={handleReview}
            onBack={() => setMode("menu")}
          />
        </div>
      </Shell>
    );
  }

  // ── Quiz session ──
  if (mode === "quiz-session") {
    return (
      <Shell>
        <div className="w-full max-w-lg mx-auto">
          <QuizSession known={known} review={review} onBack={() => setMode("menu")} />
        </div>
      </Shell>
    );
  }

  // ── Menu ──
  return (
    <Shell>
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Vocabulaire médical OET</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Révisions interactives</h1>
        </div>

        {/* Motivation bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#0B1E4B] rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-[#00C2C7]">{streak.count}</p>
            <p className="text-[10px] text-white/60 mt-0.5">🔥 Jours consécutifs</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[#0B1E4B]">{weekLearned}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">📅 Mots cette semaine</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center">
            <p className={`text-sm font-bold ${mastery.color}`}>{mastery.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">🎯 Niveau</p>
          </div>
        </div>

        {/* Progress card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-[#0B1E4B]">Maîtrise globale</p>
            <span className="text-sm font-bold text-[#0B1E4B]">{masteryPct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${masteryPct}%`, background: masteryPct >= 70 ? "#00C2C7" : masteryPct >= 40 ? "#a855f7" : "#0B1E4B" }} />
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Total",     value: TOTAL_CARDS, color: "text-[#0B1E4B]" },
              { label: "Connus",    value: knownCount,  color: "text-[#009DA1]" },
              { label: "À revoir", value: reviewCount,  color: "text-amber-600" },
              { label: "Nouveaux",  value: TOTAL_CARDS - knownCount - Math.max(0, reviewCount - knownCount), color: "text-gray-400" },
            ].map((s) => (
              <div key={s.label}>
                <p className={`text-lg font-bold ${s.color}`}>{Math.max(0, s.value)}</p>
                <p className="text-[10px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily review alert */}
        {dueReview > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-800">Révisions en attente</p>
              <p className="text-xs text-amber-600 mt-0.5">{dueReview} carte{dueReview > 1 ? "s" : ""} marquée{dueReview > 1 ? "s" : ""} "À revoir"</p>
            </div>
            <button onClick={() => { setTab("flashcards"); setMode("flashcard-session"); }}
              className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors">
              Réviser →
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
          {(["flashcards", "quiz", "parcourir"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-white text-[#0B1E4B] shadow-sm" : "text-gray-500 hover:text-[#0B1E4B]"
              }`}>
              {t === "flashcards" ? "🃏 Flashcards" : t === "quiz" ? "🧠 Quiz" : "📖 Parcourir"}
            </button>
          ))}
        </div>

        {/* Tab: Flashcards */}
        {tab === "flashcards" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#0B1E4B] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🃏</span>
                </div>
                <div>
                  <h2 className="font-bold text-[#0B1E4B] mb-0.5">Flashcards du jour</h2>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {dailyCards.length} cartes · Flip cards · Boutons "Je connais" et "À revoir"
                  </p>
                </div>
              </div>

              {/* Session composition */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {dueReview > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                    {Math.min(dueReview, 5)} à revoir
                  </span>
                )}
                {TOTAL_CARDS - knownCount - reviewCount > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#0B1E4B]/10 text-[#0B1E4B]">
                    {Math.min(TOTAL_CARDS - knownCount - reviewCount, 5)} nouveaux
                  </span>
                )}
                {knownCount > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#00C2C7]/15 text-[#009DA1]">
                    + renforcement
                  </span>
                )}
              </div>

              <button onClick={() => setMode("flashcard-session")}
                className="w-full py-3.5 bg-[#0B1E4B] hover:bg-[#152960] text-white font-semibold rounded-xl transition-colors text-sm">
                Démarrer les flashcards →
              </button>
            </div>

            {/* How it works */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">Comment ça marche</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-amber-500 flex-shrink-0">🔁</span>
                  <span><strong className="text-gray-600">À revoir</strong> — la carte réapparaît dans vos prochaines sessions</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="text-[#009DA1] flex-shrink-0">✅</span>
                  <span><strong className="text-gray-600">Je connais</strong> — la carte revient moins souvent pour renforcement</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Quiz */}
        {tab === "quiz" && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-4">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#00C2C7] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h2 className="font-bold text-[#0B1E4B] mb-0.5">Quiz du jour — 10 questions</h2>
                  <p className="text-xs text-gray-400 leading-relaxed">4 types de questions · Priorité aux mots à revoir</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { icon: "🇬🇧", label: "Anglais → Français", desc: "Traduire le terme" },
                  { icon: "🇫🇷", label: "Français → Anglais", desc: "Retrouver le terme" },
                  { icon: "✏️", label: "Compléter la phrase", desc: "Contexte clinique" },
                  { icon: "🏥", label: "QCM clinique",        desc: "Sens en situation" },
                ].map((q) => (
                  <div key={q.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                    <p className="text-base mb-1">{q.icon}</p>
                    <p className="text-xs font-semibold text-[#0B1E4B]">{q.label}</p>
                    <p className="text-[10px] text-gray-400">{q.desc}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => setMode("quiz-session")}
                className="w-full py-3.5 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold rounded-xl transition-colors text-sm">
                Démarrer le quiz →
              </button>
            </div>
          </div>
        )}

        {/* Tab: Browse */}
        {tab === "parcourir" && (
          <BrowseMode known={known} review={review} />
        )}

        {/* Footer nav */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link href="/plan"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm">
            ← Mon plan OET
          </Link>
          <Link href="/daily-practice"
            className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm">
            Routine du jour →
          </Link>
        </div>

      </div>
    </Shell>
  );
}

/* ─── Shell ──────────────────────────────────────────────────────── */

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
          <Link href="/progress" className="hover:text-[#0B1E4B] transition-colors">Progression</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-10">{children}</main>
    </div>
  );
}
