export default function Home() {
  return (
    <div className="font-[var(--font-geist-sans)]">
      <Nav />
      <Hero />
      <WhatIsOET />
      <OETvsIELTS />
      <ExamStructure />
      <CTA />
      <Footer />
    </div>
  );
}

/* ─── Navigation ─────────────────────────────────────────────── */
function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1E4B]/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#00C2C7] text-2xl font-bold tracking-tight">OET</span>
          <span className="text-white text-lg font-medium">Nursing Academy</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="#oet" className="hover:text-[#00C2C7] transition-colors">L&apos;OET</a>
          <a href="#comparaison" className="hover:text-[#00C2C7] transition-colors">OET vs IELTS</a>
          <a href="#examen" className="hover:text-[#00C2C7] transition-colors">L&apos;Examen</a>
        </nav>
        <a
          href="#contact"
          className="bg-[#00C2C7] hover:bg-[#009DA1] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          Commencer
        </a>
      </div>
    </header>
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0B1E4B] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00C2C7]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#00C2C7]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#00C2C7]/15 border border-[#00C2C7]/30 text-[#00C2C7] text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#00C2C7] rounded-full animate-pulse" />
            Formation 100% en français
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Votre carrière d&apos;infirmier(ère){" "}
            <span className="text-[#00C2C7]">aux États-Unis</span>{" "}
            commence ici
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
            Préparez votre OET Nursing avec une méthode conçue pour les
            infirmiers francophones. Obtenez le score requis et décrochez votre
            licence RN américaine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold px-8 py-4 rounded-full transition-colors text-base"
            >
              Démarrer ma formation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#oet"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:border-white/60 font-semibold px-8 py-4 rounded-full transition-colors text-base"
            >
              En savoir plus
            </a>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <Stat value="95%" label="Taux de réussite" />
            <div className="w-px h-10 bg-white/20" />
            <Stat value="500+" label="Infirmiers formés" />
            <div className="w-px h-10 bg-white/20" />
            <Stat value="B" label="Score cible garanti" />
          </div>
        </div>

        <div className="hidden md:block">
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-[#00C2C7]">{value}</p>
      <p className="text-sm text-white/60 mt-0.5">{label}</p>
    </div>
  );
}

function HeroCard() {
  const skills = [
    { label: "Listening", score: 88, color: "#00C2C7" },
    { label: "Reading", score: 92, color: "#00C2C7" },
    { label: "Writing", score: 85, color: "#33D1D5" },
    { label: "Speaking", score: 90, color: "#00C2C7" },
  ];
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-white/60 text-sm">Progression OET</p>
          <p className="text-white font-semibold mt-0.5">Marie D., Infirmière</p>
        </div>
        <span className="bg-green-500/20 text-green-400 text-xs font-medium px-3 py-1 rounded-full">Score B obtenu</span>
      </div>
      <div className="space-y-4">
        {skills.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-white/70">{s.label}</span>
              <span className="text-white font-medium">{s.score}/100</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${s.score}%`, background: s.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#00C2C7]/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#00C2C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white/70 text-sm">Admise en licence RN en Floride</p>
      </div>
    </div>
  );
}

/* ─── What is OET ─────────────────────────────────────────────── */
function WhatIsOET() {
  const points = [
    {
      icon: "🏥",
      title: "Un examen médical",
      desc: "Contrairement à l'IELTS, l'OET est conçu spécifiquement pour les professionnels de santé. Chaque exercice se déroule dans un contexte hospitalier réaliste.",
    },
    {
      icon: "🌍",
      title: "Reconnu mondialement",
      desc: "L'OET est accepté par les organismes de régulation infirmiers dans 50+ pays, dont les États-Unis, le Canada, l'Australie et le Royaume-Uni.",
    },
    {
      icon: "🎯",
      title: "Score cible : Grade B",
      desc: "La plupart des États américains exigent un grade B minimum dans chacune des 4 compétences. Notre formation vous y amène directement.",
    },
  ];

  return (
    <section id="oet" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>L&apos;OET en bref</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E4B] mt-3 mb-5">
          Qu&apos;est-ce que l&apos;OET Nursing ?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-14 leading-relaxed">
          L&apos;Occupational English Test (OET) est le test de langue anglaise de
          référence pour les professionnels de santé souhaitant exercer dans un
          pays anglophone.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {points.map((p) => (
            <div
              key={p.title}
              className="border border-gray-100 rounded-2xl p-8 hover:border-[#00C2C7]/40 hover:shadow-lg transition-all group"
            >
              <span className="text-4xl mb-5 block">{p.icon}</span>
              <h3 className="text-xl font-semibold text-[#0B1E4B] mb-3 group-hover:text-[#00C2C7] transition-colors">
                {p.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── OET vs IELTS ────────────────────────────────────────────── */
function OETvsIELTS() {
  const rows = [
    { criterion: "Public cible", oet: "Professionnels de santé", ielts: "Grand public" },
    { criterion: "Contexte des exercices", oet: "Hôpitaux, cliniques, soins", ielts: "Général (voyages, études…)" },
    { criterion: "Tâche d'écriture", oet: "Lettre de transfert de patient", ielts: "Essai académique ou général" },
    { criterion: "Speaking", oet: "Jeu de rôle patient / soignant", ielts: "Entretien général" },
    { criterion: "Accepté pour le RN US", oet: "✓ Oui (NCLEX)", ielts: "✓ Oui (TOEFL aussi)" },
    { criterion: "Adapté aux infirmiers", oet: "⭐ Très adapté", ielts: "Peu adapté" },
  ];

  return (
    <section id="comparaison" className="py-24 bg-[#F7F9FC]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Comparaison</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E4B] mt-3 mb-5">
          OET vs IELTS : pourquoi choisir l&apos;OET ?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-14 leading-relaxed">
          Les deux examens sont acceptés, mais l&apos;OET est nettement plus adapté
          aux infirmiers. Voici pourquoi.
        </p>

        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0B1E4B]">
                <th className="text-left text-white/70 font-medium px-6 py-4 w-1/3">Critère</th>
                <th className="text-left text-[#00C2C7] font-semibold px-6 py-4 w-1/3">OET Nursing</th>
                <th className="text-left text-white/70 font-medium px-6 py-4 w-1/3">IELTS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.criterion}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 font-medium text-[#0B1E4B]">{row.criterion}</td>
                  <td className="px-6 py-4 text-[#0B1E4B]">{row.oet}</td>
                  <td className="px-6 py-4 text-gray-500">{row.ielts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-[#00C2C7]/10 border border-[#00C2C7]/30 rounded-2xl flex gap-4">
          <span className="text-2xl">💡</span>
          <p className="text-[#0B1E4B] leading-relaxed">
            <strong>Notre recommandation :</strong> Si vous êtes infirmier(ère),
            l&apos;OET est clairement le meilleur choix. Le vocabulaire médical que
            vous connaissez déjà devient un avantage concret à chaque épreuve.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Exam Structure ──────────────────────────────────────────── */
function ExamStructure() {
  const parts = [
    {
      number: "01",
      skill: "Listening",
      duration: "40 min",
      desc: "Deux parties : une consultation entre soignant et patient, puis un exposé médical. Vous répondez à des questions de compréhension sur des situations cliniques réelles.",
      tips: ["Entraînez-vous à l'accent américain", "Notez les termes médicaux clés", "Anticipez les informations importantes"],
    },
    {
      number: "02",
      skill: "Reading",
      duration: "60 min",
      desc: "Trois parties avec des textes de longueur croissante : notices médicales, articles de santé, textes professionnels. Travaillez la vitesse de lecture et le repérage d'informations.",
      tips: ["Skimming et scanning efficaces", "Maîtriser le vocabulaire médical", "Gestion stricte du temps"],
    },
    {
      number: "03",
      skill: "Writing",
      duration: "45 min",
      desc: "Rédaction d'une lettre de transfert ou de référence à partir de notes de cas. L'épreuve évalue votre capacité à synthétiser des informations médicales pour un confrère.",
      tips: ["Structure : objet, antécédents, traitement, recommandation", "Ton formel et précis", "Pas de copier-coller des notes"],
    },
    {
      number: "04",
      skill: "Speaking",
      duration: "20 min",
      desc: "Deux jeux de rôle de 5 minutes chacun avec un interlocuteur. Vous simulez des consultations : recueil d'informations, annonce de diagnostic, éducation thérapeutique.",
      tips: ["Empathie et clarté", "Utiliser des reformulations", "Maîtriser l'explication de traitements"],
    },
  ];

  return (
    <section id="examen" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <SectionLabel>Structure de l&apos;examen</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B1E4B] mt-3 mb-5">
          Les 4 épreuves de l&apos;OET
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-14 leading-relaxed">
          Chaque compétence est évaluée séparément. Un grade B (équivalent à un
          score de 350/500) est requis dans chacune pour la majorité des États.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {parts.map((p) => (
            <div
              key={p.skill}
              className="border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-[#0B1E4B]/10 group-hover:text-[#00C2C7]/30 transition-colors leading-none">
                    {p.number}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1E4B]">{p.skill}</h3>
                    <span className="text-sm text-gray-400">{p.duration}</span>
                  </div>
                </div>
                <span className="bg-[#00C2C7]/10 text-[#009DA1] text-xs font-semibold px-3 py-1 rounded-full">
                  Grade B requis
                </span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{p.desc}</p>

              <div className="space-y-2">
                {p.tips.map((tip) => (
                  <div key={tip} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#00C2C7]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-[#00C2C7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section id="contact" className="py-24 bg-[#0B1E4B] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2C7]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00C2C7]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-[#00C2C7]/15 border border-[#00C2C7]/30 text-[#00C2C7] text-sm font-medium px-4 py-2 rounded-full mb-8">
          Places limitées — Session de juillet 2025
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Prêt(e) à démarrer votre
          <br />
          <span className="text-[#00C2C7]">carrière américaine ?</span>
        </h2>

        <p className="text-lg text-white/70 mb-12 max-w-xl mx-auto leading-relaxed">
          Rejoignez nos infirmiers francophones qui ont obtenu leur score B et
          exercent aujourd&apos;hui aux États-Unis.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm max-w-lg mx-auto">
          <h3 className="text-white font-semibold text-xl mb-6">
            Demander un appel de découverte gratuit
          </h3>
          <form className="space-y-4" action="#">
            <input
              type="text"
              placeholder="Votre prénom et nom"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00C2C7] transition-colors"
            />
            <input
              type="email"
              placeholder="Votre adresse email"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00C2C7] transition-colors"
            />
            <select defaultValue="" className="w-full bg-white/10 border border-white/20 text-white/70 rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00C2C7] transition-colors appearance-none">
              <option value="" disabled>Votre niveau d&apos;anglais actuel</option>
              <option>Débutant (A2)</option>
              <option>Intermédiaire (B1)</option>
              <option>Avancé (B2)</option>
              <option>Courant (C1+)</option>
            </select>
            <button
              type="submit"
              className="w-full bg-[#00C2C7] hover:bg-[#009DA1] text-white font-semibold py-4 rounded-xl transition-colors text-base mt-2"
            >
              Réserver mon appel gratuit →
            </button>
          </form>
          <p className="text-white/40 text-xs mt-4 text-center">
            Sans engagement. Réponse sous 24h.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#071230] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#00C2C7] font-bold text-lg">OET</span>
          <span className="text-white/60 text-sm">Nursing Academy</span>
        </div>
        <p className="text-white/40 text-sm">
          © 2025 OET Nursing Academy. Tous droits réservés.
        </p>
        <p className="text-white/40 text-sm">
          Formation pour infirmiers francophones
        </p>
      </div>
    </footer>
  );
}

/* ─── Shared ──────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-0.5 bg-[#00C2C7]" />
      <span className="text-[#00C2C7] text-sm font-semibold uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
}
