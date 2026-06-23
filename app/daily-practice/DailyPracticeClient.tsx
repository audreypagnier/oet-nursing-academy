"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─── Types ───────────────────────────────────────────────────── */

type Level = "A2" | "B1" | "B1+" | "B2";

type Task = {
  id: string;
  duration: number;
  skill: string;
  icon: string;
  description: string;
  tip: string;
  href?: string;
  linkLabel?: string;
};

/* ─── Task content by level ───────────────────────────────────── */

const TASKS_BY_LEVEL: Record<Level, Task[]> = {
  A2: [
    {
      id: "vocab",
      duration: 5,
      skill: "Vocabulaire",
      icon: "📖",
      description: "Apprenez 3 nouvelles fiches médicales aujourd'hui.",
      tip: "Concentrez-vous sur les symptômes courants : pain, swelling, breathlessness.",
      href: "/vocabulary",
      linkLabel: "Ouvrir les fiches →",
    },
    {
      id: "reading",
      duration: 5,
      skill: "Reading",
      icon: "📄",
      description: "Lisez une note de soins courte et identifiez les informations clés.",
      tip: "Repérez : nom du patient, motif d'admission, traitement en cours. Ignorez les mots inconnus.",
      href: "/reading",
      linkLabel: "Ouvrir Reading →",
    },
    {
      id: "speaking",
      duration: 5,
      skill: "Speaking",
      icon: "🎙️",
      description: "Entraînez-vous à saluer un patient et à lui demander son motif de consultation.",
      tip: "Phrases clés : \"Good morning, my name is… How are you feeling today?\" Répétez 3 fois à voix haute.",
      href: "/speaking",
      linkLabel: "Voir les scénarios →",
    },
    {
      id: "writing",
      duration: 5,
      skill: "Writing",
      icon: "✍️",
      description: "Rédigez 2–3 phrases décrivant l'état d'un patient à la sortie.",
      tip: "Structure : motif — traitement reçu — état actuel. Utilisez le présent simple.",
      href: "/writing",
      linkLabel: "Voir les lettres modèles →",
    },
  ],
  B1: [
    {
      id: "vocab",
      duration: 5,
      skill: "Vocabulaire",
      icon: "📖",
      description: "Révisez 5 fiches et utilisez chaque mot dans une phrase.",
      tip: "Ciblez les médicaments et posologies : administer, dose, prescribed, contraindicated.",
      href: "/vocabulary",
      linkLabel: "Ouvrir les fiches →",
    },
    {
      id: "reading",
      duration: 5,
      skill: "Reading",
      icon: "📄",
      description: "Lisez un résumé de dossier patient et répondez mentalement : qui, quoi, depuis quand.",
      tip: "Entraînez-vous à lire rapidement : trouvez les informations clés en moins de 2 minutes.",
      href: "/reading",
      linkLabel: "Ouvrir Reading →",
    },
    {
      id: "speaking",
      duration: 5,
      skill: "Speaking",
      icon: "🎙️",
      description: "Pratiquez un scénario de consultation : posez des questions ouvertes au patient.",
      tip: "Utilisez : \"Can you describe…?\", \"When did it start?\", \"Does anything make it worse?\"",
      href: "/speaking",
      linkLabel: "Voir les scénarios →",
    },
    {
      id: "writing",
      duration: 5,
      skill: "Writing",
      icon: "✍️",
      description: "Rédigez l'introduction d'une lettre de référence OET (2–3 phrases).",
      tip: "Incluez : nom, âge, motif d'admission, date. Ex : \"Mr. X, 58, was admitted on… with…\"",
      href: "/writing",
      linkLabel: "Voir les lettres modèles →",
    },
  ],
  "B1+": [
    {
      id: "vocab",
      duration: 5,
      skill: "Vocabulaire",
      icon: "📖",
      description: "Apprenez 5 termes de cardiologie ou chirurgie et créez des phrases cliniques.",
      tip: "Objectif : utiliser les mots dans un contexte OET réaliste, pas juste les mémoriser isolément.",
      href: "/vocabulary",
      linkLabel: "Ouvrir les fiches →",
    },
    {
      id: "reading",
      duration: 5,
      skill: "Reading",
      icon: "📄",
      description: "Lisez un dossier patient complexe et résumez-le oralement en 30 secondes.",
      tip: "Entraînez-vous à extraire l'essentiel rapidement — compétence clé pour l'OET Reading.",
      href: "/reading",
      linkLabel: "Ouvrir Reading →",
    },
    {
      id: "speaking",
      duration: 5,
      skill: "Speaking",
      icon: "🎙️",
      description: "Simulez un jeu de rôle complet : introduction, questions, explication, conclusion.",
      tip: "Soignez le registre professionnel et les transitions : \"I'd like to explain…\", \"Is that clear?\"",
      href: "/speaking",
      linkLabel: "Voir les scénarios →",
    },
    {
      id: "writing",
      duration: 5,
      skill: "Writing",
      icon: "✍️",
      description: "Rédigez un paragraphe complet de lettre de référence et relisez-le pour corriger.",
      tip: "Vérifiez : registre formel, absence de contractions, structure claire (objet → antécédents → recommandation).",
      href: "/writing",
      linkLabel: "Voir les lettres modèles →",
    },
  ],
  B2: [
    {
      id: "vocab",
      duration: 5,
      skill: "Vocabulaire",
      icon: "📖",
      description: "Révisez les termes avancés et préparez des synonymes pour chaque concept clé.",
      tip: "Ex : administer → dispense → prescribe. Avoir plusieurs options enrichit vos réponses Speaking et Writing.",
      href: "/vocabulary",
      linkLabel: "Ouvrir les fiches →",
    },
    {
      id: "reading",
      duration: 5,
      skill: "Reading",
      icon: "📄",
      description: "Chronométrez-vous : lisez un dossier complet en 3 minutes et répondez à 3 questions.",
      tip: "À ce niveau, la vitesse de lecture est votre principal levier d'amélioration.",
      href: "/reading",
      linkLabel: "Ouvrir Reading →",
    },
    {
      id: "speaking",
      duration: 5,
      skill: "Speaking",
      icon: "🎙️",
      description: "Enregistrez-vous sur un scénario et écoutez pour identifier vos hésitations.",
      tip: "Critères OET : linguistic, clinical, relationship-building. Visez la fluidité ET la précision clinique.",
      href: "/speaking",
      linkLabel: "Voir les scénarios →",
    },
    {
      id: "writing",
      duration: 5,
      skill: "Writing",
      icon: "✍️",
      description: "Rédigez une lettre complète en 15 minutes et vérifiez avec la lettre modèle.",
      tip: "Critères OET Writing : purpose, content, conciseness, language. Soignez chaque section.",
      href: "/writing",
      linkLabel: "Voir les lettres modèles →",
    },
  ],
};

const DEFAULT_TASKS = TASKS_BY_LEVEL["B1"];

/* ─── Helpers ─────────────────────────────────────────────────── */

function todayKey(): string {
  return `oet_daily_practice_${new Date().toISOString().slice(0, 10)}`;
}

function formatDate(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/* ─── Component ───────────────────────────────────────────────── */

export default function DailyPracticeClient() {
  const [level, setLevel] = useState<Level | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Load level from assessment
    try {
      const raw = localStorage.getItem("oet_assessment_result");
      if (raw) {
        const { level: lvl } = JSON.parse(raw) as { level: string };
        if (["A2", "B1", "B1+", "B2"].includes(lvl)) setLevel(lvl as Level);
      }
    } catch {}

    // Load today's completed tasks
    try {
      const raw = localStorage.getItem(todayKey());
      if (raw) setCompleted(new Set(JSON.parse(raw) as string[]));
    } catch {}

    setHydrated(true);
  }, []);

  function toggle(id: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(todayKey(), JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }

  const tasks = level ? TASKS_BY_LEVEL[level] : DEFAULT_TASKS;
  const completedCount = tasks.filter((t) => completed.has(t.id)).length;
  const allDone = completedCount === tasks.length;
  const totalMinutes = tasks.reduce((s, t) => s + t.duration, 0);

  if (!hydrated) {
    return (
      <Shell>
        <div className="w-full max-w-xl mx-auto space-y-4 animate-pulse">
          <div className="h-10 w-56 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-2xl" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="w-full max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 capitalize mb-1">{formatDate()}</p>
          <h1 className="text-2xl font-bold text-[#0B1E4B]">Session du jour</h1>
          {level && (
            <p className="text-sm text-gray-500 mt-1">
              Niveau{" "}
              <span className="font-semibold text-[#009DA1]">{level}</span>
              {" "}— {totalMinutes} minutes de pratique ciblée
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#0B1E4B]">
              {allDone ? "Session complétée !" : `${completedCount} / ${tasks.length} tâches`}
            </span>
            <span className="text-sm text-gray-400">{completedCount * 5} / {totalMinutes} min</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / tasks.length) * 100}%`,
                background: allDone ? "#00C2C7" : "#0B1E4B",
              }}
            />
          </div>
          {allDone && (
            <p className="text-sm text-[#009DA1] font-medium mt-3 text-center">
              Excellent travail ! Revenez demain pour votre prochaine session.
            </p>
          )}
        </div>

        {/* Task list */}
        <div className="space-y-3 mb-6">
          {tasks.map((task, index) => {
            const done = completed.has(task.id);
            return (
              <div
                key={task.id}
                className={`rounded-2xl border transition-all ${
                  done
                    ? "bg-[#00C2C7]/5 border-[#00C2C7]/30"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggle(task.id)}
                  className="w-full text-left p-5"
                  aria-label={`Marquer "${task.skill}" comme ${done ? "non complété" : "complété"}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step number / checkmark */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        done
                          ? "bg-[#00C2C7] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {done ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-semibold text-[#0B1E4B]">
                          {task.icon} {task.skill}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {task.duration} min
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed mb-2 ${done ? "text-gray-400 line-through" : "text-gray-600"}`}>
                        {task.description}
                      </p>
                      {!done && (
                        <p className="text-xs text-gray-400 leading-relaxed bg-gray-50 rounded-xl px-3 py-2">
                          💡 {task.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Link to practice page */}
                {task.href && !done && (
                  <div className="px-5 pb-4 pl-17">
                    <Link
                      href={task.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#009DA1] hover:text-[#007A7E] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.linkLabel}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No assessment nudge */}
        {!level && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3 items-start">
            <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-amber-800 font-medium mb-1">Session par défaut (niveau B1)</p>
              <p className="text-xs text-amber-700 leading-relaxed mb-2">
                Passez l'évaluation pour obtenir une session adaptée à votre niveau réel.
              </p>
              <Link
                href="/assessment"
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors"
              >
                Passer l'évaluation →
              </Link>
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/plan"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            ← Mon plan complet
          </Link>
          <Link
            href="/readiness"
            className="flex-1 text-center bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            Mon score de préparation →
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
        <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-[#0B1E4B] transition-colors">Tableau de bord</Link>
          <Link href="/plan" className="hover:text-[#0B1E4B] transition-colors">Mon plan</Link>
          <Link href="/readiness" className="hover:text-[#0B1E4B] transition-colors">Mon score</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
