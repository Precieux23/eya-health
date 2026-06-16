// app/eya/page.jsx
"use client";
import Header from "@/components/ui/Header";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Lightbulb, Palette, Code, Rocket, CheckCircle } from 'lucide-react';

export default function EyaPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const timeline = [
    {
      id: 1,
      title: "Idée",
      description: "Diagnostic des ruptures de stocks",
      date: "Phase 1",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Conception",
      description: "Prototype centré sur le terrain",
      date: "Phase 2",
      icon: Palette,
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 3,
      title: "Développement",
      description: "Construction de la plateforme",
      date: "Phase 3",
      icon: Code,
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 4,
      title: "Tests",
      description: "Validation avec les praticiens",
      date: "Phase 4",
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500"
    },
    {
      id: 5,
      title: "Déploiement",
      description: "Mise en service en hôpital partenaire",
      date: "Phase 5",
      icon: Rocket,
      color: "from-red-400 to-rose-500"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % timeline.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, timeline.length]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Header />

      {/* Intro - Hero avec gradient animé */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        {/* Gradient animé en arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
            >
              ✨ Innovation Hospitalière
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
            >
              Découvrez{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EYA
              </span>
              , l'assistante numérique d'EYA Health
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 text-lg text-gray-700 max-w-xl leading-relaxed"
            >
              EYA centralise la logistique, anticipe les besoins, et permet aux équipes hospitalières
              de se concentrer sur l'essentiel : les soins. Parcourez l'origine, le fonctionnement et les objectifs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 flex gap-4"
            >
              <a
                href="#origine"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                En savoir plus
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-800 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                Retour à l'accueil
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-md group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
                <Image
                  src="/eya-illu.webp"
                  alt="EYA illustration"
                  width={720}
                  height={440}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition duration-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ORIGINE - Style carte avec effets */}
      <section id="origine" className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Texte d'introduction */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full filter blur-2xl opacity-30"></div>
              
              <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                🌱 Genèse du projet
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
                Origine
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                EYA est née du constat simple mais critique : la gestion manuelle des stocks et des
                approvisionnements génère erreurs, pertes de temps et risques pour les patients.
                Nos hôpitaux partenaires ont initié EYA pour centraliser les informations, automatiser la prise de décision
                et fiabiliser l'approvisionnement.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: "🔍", text: "Diagnostic initial : ruptures fréquentes et processus manuels" },
                  { icon: "🎨", text: "Conception : prototype centré terrain et retour des praticiens" },
                  { icon: "🎯", text: "Objectif : fiabiliser, anticiper, simplifier" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-gray-700 flex-1">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/origin-illustration.avif"
                    alt="Origine EYA"
                    width={640}
                    height={420}
                    className="object-cover transform group-hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* TIMELINE - Parcours du projet */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-4">
              Parcours du projet
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              De l'idée initiale au déploiement : découvrez les étapes clés de la création d'EYA
            </p>

            {/* Timeline Container */}
            <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl">
              {/* Ligne de progression */}
              <div className="absolute top-24 left-0 w-full h-1 bg-slate-200 hidden md:block px-12">
                <div className="relative h-full max-w-6xl mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(activeStep / (timeline.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Étapes de la timeline */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === activeStep;
                  const isPast = index < activeStep;

                  return (
                    <div
                      key={step.id}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => {
                        setActiveStep(index);
                        setIsAutoPlaying(false);
                      }}
                    >
                      {/* Icône */}
                      <div className="relative mb-6">
                        <div
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                            isActive
                              ? `bg-gradient-to-br ${step.color} scale-110 shadow-2xl`
                              : isPast
                              ? 'bg-gradient-to-br from-blue-500 to-blue-700 scale-100'
                              : 'bg-slate-200 scale-90'
                          }`}
                        >
                          <Icon
                            className={`transition-all duration-500 ${
                              isActive ? 'w-9 h-9 text-white' : 'w-7 h-7 text-slate-600'
                            } ${isPast && !isActive ? 'text-white' : ''}`}
                          />
                        </div>

                        {/* Pulsation pour l'étape active */}
                        {isActive && (
                          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-30 animate-ping`} />
                        )}
                      </div>

                      {/* Contenu */}
                      <div
                        className={`text-center transition-all duration-500 transform ${
                          isActive ? 'scale-105' : 'scale-100'
                        }`}
                      >
                        <div
                          className={`text-xs md:text-sm font-semibold mb-2 transition-colors duration-300 ${
                            isActive || isPast ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        >
                          {step.date}
                        </div>
                        <h4
                          className={`text-base md:text-lg font-bold mb-2 transition-colors duration-300 ${
                            isActive ? 'text-slate-900' : isPast ? 'text-slate-700' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-xs md:text-sm transition-colors duration-300 ${
                            isActive ? 'text-gray-600' : 'text-slate-400'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carte détaillée de l'étape active */}
              <div className="mt-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${timeline[activeStep].color} shadow-lg`}>
                    {(() => {
                      const Icon = timeline[activeStep].icon;
                      return <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                      {timeline[activeStep].title}
                    </h3>
                    <p className="text-gray-600 text-base md:text-lg mb-4">
                      {timeline[activeStep].description}
                    </p>
                    <div className="text-blue-600 text-sm font-medium">
                      Étape {activeStep + 1} sur {timeline.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex justify-center gap-3 md:gap-4 mt-8 flex-wrap">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  disabled={activeStep === 0}
                  className="px-4 md:px-6 py-2 md:py-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg transition-colors text-sm md:text-base font-medium"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm md:text-base font-medium"
                >
                  {isAutoPlaying ? '⏸ Pause' : '▶ Lecture'}
                </button>
                <button
                  onClick={() => setActiveStep((prev) => Math.min(timeline.length - 1, prev + 1))}
                  disabled={activeStep === timeline.length - 1}
                  className="px-4 md:px-6 py-2 md:py-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-lg transition-colors text-sm md:text-base font-medium"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNEMENT - Style cards avec glassmorphism */}
      <section id="fonctionnement" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm text-blue-700 rounded-full text-sm font-semibold shadow-sm">
              ⚙️ Comment ça marche ?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fonctionnement</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              EYA orchestre le flux entre services, logistique et fournisseurs. Voici le parcours simplifié :
            </p>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-8 items-start">
            {[
              { icon: "📦", title: "Suivi en temps réel", text: "Chaque mouvement (consommation, réception) est tracé et met à jour les stocks.", color: "from-blue-500 to-cyan-500" },
              { icon: "⚠️", title: "Alertes automatiques", text: "Des seuils dynamiques déclenchent des notifications et propositions de commande.", color: "from-orange-500 to-red-500" },
              { icon: "🧾", title: "Commandes intelligentes", text: "L'IA calcule les quantités et déclenche les commandes selon validation.", color: "from-purple-500 to-pink-500" }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-full">
                  <div className={`absolute -inset-1 bg-gradient-to-r ${step.color} rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000`}></div>
                  <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white text-3xl mb-6 shadow-lg`}>
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 grid md:grid-cols-3 gap-8"
          >
            {[
              { value: "-30% (estimated)", label: "Réduction estimée des ruptures", gradient: "from-green-500 to-emerald-600", icon: "📉" },
              { value: "+40% (projected)", label: "Efficacité opérationnelle", gradient: "from-blue-500 to-indigo-600", icon: "⚡" },
              { value: "100%", label: "Visibilité centralisée", gradient: "from-purple-500 to-pink-600", icon: "👁️" }
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000`}></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-4`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-700 font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* OBJECTIFS - Style moderne avec cartes interactives */}
      <section id="objectifs" className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(139,92,246,0.1),transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold">
              🎯 Vision et ambitions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Objectifs</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              EYA vise une transformation durable : digitaliser la logistique, améliorer la coordination et
              préparer l'extension à d'autres établissements.
            </p>
          </motion.div>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💻",
                title: "Digitalisation",
                text: "Automatiser les flux et conserver un historique complet.",
                gradient: "from-blue-500 to-cyan-500",
                pattern: "bg-blue-50"
              },
              {
                icon: "🤝",
                title: "Coordination",
                text: "Faciliter la communication entre services et logistique.",
                gradient: "from-indigo-500 to-purple-500",
                pattern: "bg-indigo-50"
              },
              {
                icon: "🚀",
                title: "Scalabilité",
                text: "Préparer le modèle pour être déployé dans tout le pays.",
                gradient: "from-purple-500 to-pink-500",
                pattern: "bg-purple-50"
              }
            ].map((obj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative h-full">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${obj.gradient} rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000`}></div>
                  <div className={`relative h-full ${obj.pattern} rounded-3xl p-8 border-2 border-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-50 rounded-full -mr-16 -mt-16"></div>
                    
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${obj.gradient} text-white text-3xl mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      {obj.icon}
                    </div>
                    <h4 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${obj.gradient} bg-clip-text text-transparent`}>
                      {obj.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {obj.text}
                    </p>
                    
                    <div className="mt-6 flex items-center text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                      <span></span>
                      <span className="ml-2 transform group-hover:translate-x-2 transition-transform"></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <a href="/" className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg">
              <span>Retour à l'accueil</span>
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 mt-12 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                EYA Health
              </div>
              <p className="text-slate-400 text-sm">
                Making stockouts history.
              </p>
            </div>
            
            <div className="text-center text-sm text-slate-400">
              EYA Health © 2026 — contact: lokoutodeprecieux@gmail.com
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
