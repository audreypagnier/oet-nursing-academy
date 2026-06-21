"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { computeReadiness, type ReadinessData } from "../lib/readiness";

/* ─── Types ───────────────────────────────────────────────────── */

type Level = "A2" | "B1" | "B1+" | "B2";

type AssessmentResult = {
  score: number;
  level: Level;
  breakdown: { vocabulary: string; reading: string; grammar: string };
  completedAt: string;
};

/* ─── Plan data ───────────────────────────────────────────────── */

type WeekDay = {
  day: string;
  focus: string;
  tasks: string[];
  duration: string;
  color: string;
};

type PlanConfig = {
  duration: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  levelColor: string;
  borderColor: string;
  bgColor: string;
  weeks: WeekDay[];
  dailyRoutine: { time: string; activity: string; tip: string }[];
  milestones: string[];
};

const PLANS: Record<Level, PlanConfig> = {
  A2: {
    duration: "9 à 12 mois",
    subtitle: "Programme intensif — consolidation des bases médicales",
    badge: "Débutant",
    badgeColor: "bg-orange-100 text-orange-700",
    levelColor: "text-orange-600",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    weeks: [
      {
        day: "Lundi",
        focus: "Vocabulaire",
        tasks: [
          "Apprenez 10 termes médicaux courants (symptômes, organes)",
          "Utilisez chaque mot dans une phrase clinique",
          "Révisez les 10 mots de la semaine précédente",
        ],
        duration: "45 min",
        color: "border-l-[#00C2C7]",
      },
      {
        day: "Mardi",
        focus: "Grammaire",
        tasks: [
          "Voix passive au présent et au passé (ex: « The medication was administered »)",
          "Exercices de complétion de phrases infirmières",
          "Correction et relecture à voix haute",
        ],
        duration: "45 min",
        color: "border-l-[#0B1E4B]",
      },
      {
        day: "Mercredi",
        focus: "Listening",
        tasks: [
          "Écoutez un dialogue médical simple en anglais (YouTube / podcast)",
          "Notez les mots inconnus et cherchez leur définition",
          "Réécoutez en lisant la transcription",
        ],
        duration: "30 min",
        color: "border-l-purple-400",
      },
      {
        day: "Jeudi",
        focus: "Reading",
        tasks: [
          "Lisez une notice de médicament ou un compte rendu simple en anglais",
          "Identifiez le vocabulaire médical clé",
          "Répondez à 3 questions de compréhension",
        ],
        duration: "40 min",
        color: "border-l-green-400",
      },
      {
        day: "Vendredi",
        focus: "Speaking",
        tasks: [
          "Présentez un symptôme à voix haute en anglais (1 à 2 minutes)",
          "Enregistrez-vous et écoutez votre prononciation",
          "Répétez 5 phrases infirmières courantes",
        ],
        duration: "30 min",
        color: "border-l-yellow-400",
      },
      {
        day: "Samedi",
        focus: "Writing",
        tasks: [
          "Rédigez un paragraphe de description d'un patient fictif",
          "Utilisez au moins 5 termes médicaux de la semaine",
          "Relisez pour corriger la grammaire",
        ],
        duration: "35 min",
        color: "border-l-pink-400",
      },
    ],
    dailyRoutine: [
      { time: "0 – 5 min", activity: "Révision de flashcards médicales", tip: "Utilisez Anki ou une liste papier" },
      { time: "5 – 12 min", activity: "Lecture d'un court texte médical en anglais", tip: "Notice de médicament, article santé simple" },
      { time: "12 – 17 min", activity: "Écriture d'une phrase clinique complexe", tip: "Incluez un modal (must, should, may)" },
      { time: "17 – 20 min", activity: "Prononciation à voix haute", tip: "Répétez 5 termes difficiles lentement" },
    ],
    milestones: [
      "Mois 1–3 : Maîtriser 300 termes médicaux essentiels et la grammaire de base",
      "Mois 4–6 : Comprendre des dialogues médicaux simples et écrire des descriptions de patient",
      "Mois 7–9 : Simuler des consultations simples et rédiger des lettres courtes",
      "Mois 10–12 : Passer des examens blancs OET et atteindre un score B régulier",
    ],
  },

  B1: {
    duration: "6 à 9 mois",
    subtitle: "Programme structuré — montée en compétence OET",
    badge: "Intermédiaire",
    badgeColor: "bg-yellow-100 text-yellow-700",
    levelColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    bgColor: "bg-yellow-50",
    weeks: [
      {
        day: "Lundi",
        focus: "Vocabulaire",
        tasks: [
          "Étudiez 15 termes cliniques avancés (pharmacologie, pathologies)",
          "Classez-les par système (cardiovasculaire, respiratoire…)",
          "Rédigez 3 phrases de cas clinique avec ces termes",
        ],
        duration: "40 min",
        color: "border-l-[#00C2C7]",
      },
      {
        day: "Mardi",
        focus: "Reading",
        tasks: [
          "Lisez un article médical en anglais (200–300 mots)",
          "Skimming : identifiez le thème en 2 minutes",
          "Scanning : répondez à 5 questions précises sur le texte",
        ],
        duration: "45 min",
        color: "border-l-green-400",
      },
      {
        day: "Mercredi",
        focus: "Listening",
        tasks: [
          "Écoutez un exposé médical de 5 à 10 minutes",
          "Prenez des notes structurées (problème, traitement, résultat)",
          "Résumez oralement ce que vous avez compris",
        ],
        duration: "40 min",
        color: "border-l-purple-400",
      },
      {
        day: "Jeudi",
        focus: "Writing",
        tasks: [
          "Étudiez la structure d'une lettre de référence OET",
          "Rédigez le premier paragraphe d'une lettre de transfert fictive",
          "Comparez avec un modèle et identifiez vos erreurs",
        ],
        duration: "50 min",
        color: "border-l-pink-400",
      },
      {
        day: "Vendredi",
        focus: "Speaking",
        tasks: [
          "Jeu de rôle : expliquez un traitement à un patient fictif (5 min)",
          "Enregistrez-vous et évaluez fluidité et clarté",
          "Travaillez l'intonation sur 3 phrases types",
        ],
        duration: "45 min",
        color: "border-l-yellow-400",
      },
      {
        day: "Samedi",
        focus: "Révision globale",
        tasks: [
          "Révisez le vocabulaire de la semaine avec des quiz",
          "Relisez votre lettre du jeudi et corrigez-la",
          "Faites 10 questions de compréhension en temps limité",
        ],
        duration: "50 min",
        color: "border-l-[#0B1E4B]",
      },
    ],
    dailyRoutine: [
      { time: "0 – 5 min", activity: "Révision de 10 termes cliniques", tip: "Axez-vous sur la spécialité infirmière" },
      { time: "5 – 11 min", activity: "Lecture rapide d'un texte médical", tip: "Chronométrez-vous pour simuler l'examen" },
      { time: "11 – 16 min", activity: "Rédaction d'une phrase de lettre de transfert", tip: "Travaillez l'objet ou les antécédents" },
      { time: "16 – 20 min", activity: "Simulation speaking 4 minutes", tip: "Expliquez un soin comme à un patient anglophone" },
    ],
    milestones: [
      "Mois 1–2 : Consolider le vocabulaire clinique et la structure des textes médicaux",
      "Mois 3–4 : Maîtriser la lettre de transfert et les jeux de rôle simples",
      "Mois 5–6 : Passer des examens blancs OET et analyser les erreurs",
      "Mois 7–9 : Atteindre un score B stable sur les 4 compétences",
    ],
  },

  "B1+": {
    duration: "3 à 6 mois",
    subtitle: "Programme ciblé — perfectionnement OET",
    badge: "Intermédiaire avancé",
    badgeColor: "bg-[#00C2C7]/15 text-[#009DA1]",
    levelColor: "text-[#009DA1]",
    borderColor: "border-[#00C2C7]/30",
    bgColor: "bg-[#00C2C7]/10",
    weeks: [
      {
        day: "Lundi",
        focus: "Vocabulaire avancé",
        tasks: [
          "Étudiez 10 termes spécialisés (oncologie, soins intensifs, pédiatrie)",
          "Pratiquez leur usage dans un contexte de lettre de transfert",
          "Identifiez les synonymes médicaux acceptés à l'OET",
        ],
        duration: "35 min",
        color: "border-l-[#00C2C7]",
      },
      {
        day: "Mardi",
        focus: "Writing OET",
        tasks: [
          "Rédigez une lettre de transfert complète (250 mots) en 45 minutes",
          "Appliquez la structure : objet, antécédents, traitement, recommandation",
          "Corrigez avec une grille d'évaluation OET",
        ],
        duration: "60 min",
        color: "border-l-pink-400",
      },
      {
        day: "Mercredi",
        focus: "Listening intensif",
        tasks: [
          "Écoutez deux extraits médicaux de niveaux différents",
          "Complétez des exercices de type lacunaire (fill-in-the-blank)",
          "Travaillez les accents anglais américain et britannique",
        ],
        duration: "45 min",
        color: "border-l-purple-400",
      },
      {
        day: "Jeudi",
        focus: "Reading chronométré",
        tasks: [
          "Lisez 3 textes médicaux en 60 minutes (simulation OET)",
          "Pratiquez le skimming et le scanning sous pression temporelle",
          "Identifiez les pièges courants (paraphrase, synonymes)",
        ],
        duration: "60 min",
        color: "border-l-green-400",
      },
      {
        day: "Vendredi",
        focus: "Speaking — jeu de rôle",
        tasks: [
          "Simulez deux consultations complètes de 5 minutes chacune",
          "Travaillez l'empathie, la reformulation et l'éducation thérapeutique",
          "Évaluez votre fluidité, précision et pertinence clinique",
        ],
        duration: "50 min",
        color: "border-l-yellow-400",
      },
      {
        day: "Samedi",
        focus: "Examen blanc",
        tasks: [
          "Faites un test complet sur une ou deux compétences",
          "Analysez vos erreurs et notez les points faibles",
          "Planifiez les ajustements pour la semaine suivante",
        ],
        duration: "60 min",
        color: "border-l-[#0B1E4B]",
      },
    ],
    dailyRoutine: [
      { time: "0 – 4 min", activity: "Relecture d'une lettre de transfert modèle", tip: "Notez une tournure à réutiliser" },
      { time: "4 – 10 min", activity: "Écoute d'un extrait médical", tip: "Podcast médical ou simulation OET Listening" },
      { time: "10 – 16 min", activity: "Rédaction d'un paragraphe de lettre", tip: "Concentrez-vous sur les antécédents ou le traitement" },
      { time: "16 – 20 min", activity: "Speaking express : 1 jeu de rôle rapide", tip: "Choisissez un scénario différent chaque jour" },
    ],
    milestones: [
      "Semaine 1–4 : Maîtriser la structure et le ton de la lettre de transfert OET",
      "Semaine 5–8 : Simuler les 4 compétences en conditions d'examen",
      "Semaine 9–16 : Atteindre un score B régulier sur les examens blancs",
      "Semaine 17–24 : Passer l'OET et obtenir les résultats officiels",
    ],
  },

  B2: {
    duration: "1 à 3 mois",
    subtitle: "Programme express — préparation finale OET",
    badge: "Avancé",
    badgeColor: "bg-[#0B1E4B]/10 text-[#0B1E4B]",
    levelColor: "text-[#0B1E4B]",
    borderColor: "border-[#0B1E4B]/20",
    bgColor: "bg-[#0B1E4B]/5",
    weeks: [
      {
        day: "Lundi",
        focus: "Vocabulaire OET",
        tasks: [
          "Révisez le lexique médical spécifique aux 4 épreuves OET",
          "Pratiquez les collocations médicales (administer medication, monitor vitals…)",
          "Faites un quiz de 20 termes chronométré",
        ],
        duration: "30 min",
        color: "border-l-[#00C2C7]",
      },
      {
        day: "Mardi",
        focus: "Writing — simulation",
        tasks: [
          "Rédigez une lettre de transfert complète en 45 minutes chrono",
          "Respectez la longueur (180–200 mots), le registre et la structure",
          "Auto-évaluez avec les critères OET : contenu, précision, organisation",
        ],
        duration: "60 min",
        color: "border-l-pink-400",
      },
      {
        day: "Mercredi",
        focus: "Listening — simulation",
        tasks: [
          "Faites les deux parties Listening en conditions réelles",
          "Analysez les erreurs : attention aux homophones médicaux",
          "Ré-écoutez les passages difficiles",
        ],
        duration: "50 min",
        color: "border-l-purple-400",
      },
      {
        day: "Jeudi",
        focus: "Reading — simulation",
        tasks: [
          "Faites les trois parties Reading en 60 minutes",
          "Gérez le temps : 15 min / 15 min / 30 min",
          "Identifiez vos erreurs de type (compréhension vs. vitesse)",
        ],
        duration: "65 min",
        color: "border-l-green-400",
      },
      {
        day: "Vendredi",
        focus: "Speaking — simulation",
        tasks: [
          "Deux jeux de rôle complets, 5 minutes chacun, enregistrés",
          "Analysez : fluidité, empathie, précision du vocabulaire clinique",
          "Préparez des formules pour les situations difficiles",
        ],
        duration: "45 min",
        color: "border-l-yellow-400",
      },
      {
        day: "Samedi",
        focus: "Analyse & stratégie",
        tasks: [
          "Comparez vos scores de la semaine par compétence",
          "Identifiez la compétence la plus faible et planifiez un focus",
          "Préparez la liste des points à réviser la semaine suivante",
        ],
        duration: "30 min",
        color: "border-l-[#0B1E4B]",
      },
    ],
    dailyRoutine: [
      { time: "0 – 3 min", activity: "Relecture de 5 termes médicaux ciblés", tip: "Priorité aux termes que vous hésitez en situation réelle" },
      { time: "3 – 10 min", activity: "Écriture d'un paragraphe de lettre de transfert", tip: "Variez les sections chaque jour" },
      { time: "10 – 16 min", activity: "Écoute d'un extrait médical complexe", tip: "Notez les structures grammaticales entendues" },
      { time: "16 – 20 min", activity: "Speaking express : 1 mini jeu de rôle", tip: "Concentrez-vous sur la fluidité, pas la perfection" },
    ],
    milestones: [
      "Semaine 1–2 : Simuler les 4 épreuves et identifier les lacunes résiduelles",
      "Semaine 3–4 : Corriger les erreurs récurrentes et affiner la stratégie examen",
      "Semaine 5–8 : Atteindre un score B stable et s'inscrire à l'OET",
      "Semaine 9–12 : Passer l'examen et obtenir les résultats officiels",
    ],
  },
};

/* ─── Component ───────────────────────────────────────────────── */

export default function PlanClient() {
  const [result, setResult] = useState<AssessmentResult | null | "loading">("loading");
  const [readiness, setReadiness] = useState<ReadinessData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("oet_assessment_result");
      setResult(raw ? (JSON.parse(raw) as AssessmentResult) : null);
    } catch {
      setResult(null);
    }
    setReadiness(computeReadiness());
  }, []);

  if (result === "loading") return <Shell><LoadingState /></Shell>;
  if (!result) return <Shell><EmptyState /></Shell>;

  const level = (["A2", "B1", "B1+", "B2"].includes(result.level) ? result.level : "B1") as Level;
  const plan = PLANS[level];

  return (
    <Shell>
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Mon plan OET</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Programme de préparation</h1>
        </div>

        {/* Plan summary card */}
        <div className={`rounded-2xl border p-6 mb-6 ${plan.bgColor} ${plan.borderColor}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${plan.badgeColor}`}>
                Niveau {level} — {plan.badge}
              </span>
              <h2 className={`text-2xl font-bold mb-1 ${plan.levelColor}`}>{plan.duration}</h2>
              <p className="text-sm text-gray-600">{plan.subtitle}</p>
            </div>
            <div className="flex-shrink-0 text-center bg-white/60 border border-white/80 rounded-xl px-5 py-3">
              <p className="text-3xl font-bold text-[#0B1E4B]">{result.score}</p>
              <p className="text-xs text-gray-400 mt-0.5">Score / 100</p>
            </div>
          </div>
        </div>

        {/* Weekly structure */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-[#0B1E4B] mb-1">Structure hebdomadaire</h2>
          <p className="text-sm text-gray-400 mb-5">6 jours de travail, 1 jour de repos</p>
          <div className="space-y-3">
            {plan.weeks.map((w) => (
              <div
                key={w.day}
                className={`border-l-4 ${w.color} bg-gray-50 rounded-r-xl px-5 py-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400 w-16">{w.day}</span>
                    <span className="text-sm font-semibold text-[#0B1E4B]">{w.focus}</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                    {w.duration}
                  </span>
                </div>
                <ul className="space-y-1 ml-[4.75rem]">
                  {w.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#00C2C7] mt-0.5 flex-shrink-0">›</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Daily 20-min routine */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[#00C2C7]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#00C2C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-[#0B1E4B]">Routine quotidienne</h2>
              <p className="text-xs text-gray-400">20 minutes chaque jour, en dehors de vos sessions</p>
            </div>
          </div>
          <div className="space-y-3">
            {plan.dailyRoutine.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-xs font-mono font-semibold text-[#00C2C7] bg-[#00C2C7]/10 px-2.5 py-1.5 rounded-lg flex-shrink-0 mt-0.5 whitespace-nowrap">
                  {item.time}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#0B1E4B]">{item.activity}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-[#0B1E4B] mb-5">Jalons de progression</h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />
            {plan.milestones.map((m, i) => (
              <div key={i} className="relative mb-5 last:mb-0">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-[#00C2C7] bg-white" />
                <p className="text-sm text-gray-700 leading-relaxed">{m}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness score */}
        {readiness && <PlanReadinessCard readiness={readiness} />}

        {/* CTA buttons */}
        <div className="bg-[#0B1E4B] rounded-2xl p-6 mb-5">
          <h2 className="text-white font-semibold mb-1">Commencer maintenant</h2>
          <p className="text-white/60 text-sm mb-5">
            Choisissez un exercice pour démarrer votre session du jour.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/#contact"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-4 text-center transition-colors group"
            >
              <span className="text-xl">📖</span>
              <span className="text-white text-sm font-semibold">Vocabulaire</span>
              <span className="text-white/50 text-xs">Mémoriser les termes OET</span>
            </Link>
            <Link
              href="/#contact"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-4 text-center transition-colors group"
            >
              <span className="text-xl">🎙️</span>
              <span className="text-white text-sm font-semibold">Speaking</span>
              <span className="text-white/50 text-xs">Simuler une consultation</span>
            </Link>
            <Link
              href="/#contact"
              className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-4 text-center transition-colors group"
            >
              <span className="text-xl">✍️</span>
              <span className="text-white text-sm font-semibold">Writing</span>
              <span className="text-white/50 text-xs">Rédiger une lettre OET</span>
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            ← Mon tableau de bord
          </Link>
          <Link
            href="/assessment"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Refaire l&apos;évaluation
          </Link>
        </div>
      </div>
    </Shell>
  );
}

/* ─── Shell ───────────────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-xl font-bold">OET</span>
          <span className="text-[#0B1E4B] text-sm font-medium">Nursing Academy</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-[#0B1E4B] transition-colors">Tableau de bord</Link>
          <Link href="/assessment" className="hover:text-[#0B1E4B] transition-colors">Évaluation</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        {children}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-full bg-[#00C2C7]/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-[#00C2C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[#0B1E4B] mb-3">Aucun résultat enregistré</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        Votre plan de préparation est généré automatiquement à partir de votre
        évaluation. Passez le test d&apos;abord.
      </p>
      <Link
        href="/assessment"
        className="inline-block bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
      >
        Passer l&apos;évaluation →
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-pulse">
      <div className="h-10 w-56 bg-gray-200 rounded-xl" />
      <div className="h-28 bg-gray-200 rounded-2xl" />
      <div className="h-96 bg-gray-200 rounded-2xl" />
      <div className="h-32 bg-gray-200 rounded-2xl" />
    </div>
  );
}

function PlanReadinessCard({ readiness }: { readiness: ReadinessData }) {
  const { score, level } = readiness;
  return (
    <div className={`rounded-2xl border p-6 mb-6 ${level.bg} ${level.border}`}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${level.badge}`}>
            {level.label}
          </span>
          <h3 className="font-bold text-[#0B1E4B]">Score de préparation OET</h3>
          <p className="text-xs text-gray-400 mt-0.5">Estimation indicative — pas un résultat officiel OET</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className={`text-4xl font-bold ${level.color}`}>{score}</span>
          <span className="text-gray-400 text-sm"> / 100</span>
        </div>
      </div>

      <div className="h-2.5 bg-white/60 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: score >= 75 ? "#00C2C7" : score >= 60 ? "#f59e0b" : score >= 40 ? "#f97316" : "#ef4444",
          }}
        />
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">{level.description}</p>

      {/* Target scores */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {level.targetScores.map((ts) => (
          <div key={ts.skill} className="bg-white/60 rounded-xl px-3 py-2.5">
            <p className="text-xs text-gray-500 mb-0.5">{ts.skill}</p>
            <p className="text-sm font-bold text-[#0B1E4B]">{ts.target}</p>
            {ts.note && <p className="text-xs text-gray-400 mt-0.5">{ts.note}</p>}
          </div>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="text-sm font-semibold text-[#009DA1] hover:underline"
      >
        Voir le détail du score →
      </Link>
    </div>
  );
}
