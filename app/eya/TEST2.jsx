// app/eya/page.jsx
"use client";
import Header from "@/components/ui/Header";
import { motion } from "framer-motion";
import StatCard from "../../components/ui/eya/StatCard";
import FlowStep from "../../components/ui/eya/FlowStep";
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
      description: "Mise en service au CHNCAK",
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

      {/* Intro */}
      <section className="pt-28 pb-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight"
            >
              Découvrez <span className="text-blue-700">EYA</span>, l'assistante numérique d'EYA Health
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-4 text-gray-600 max-w-xl"
            >
              EYA centralise la logistique, anticipe les besoins, et permet aux équipes hospitalières
              de se concentrer sur l'essentiel : les soins. Parcourez l'origine, le fonctionnement et les objectifs.
            </motion.p>

            <div className="mt-6 flex gap-3">
              <a
                href="#origine"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-700 text-white shadow hover:bg-blue-800 transition"
              >
                En savoir plus
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50 transition"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full flex items-center justify-center"
          >
            <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-slate-50">
              <Image
                src="/eya-illu.webp"
                alt="EYA illustration"
                width={720}
                height={440}
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ORIGINE */}
      <section id="origine" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Texte d'introduction */}
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Origine</h2>
              <p className="mt-4 text-gray-600">
                EYA est née du constat simple mais critique : la gestion manuelle des stocks et des
                approvisionnements génère erreurs, pertes de temps et risques pour les patients.
                Le CHNCAK a initié EYA pour centraliser les informations, automatiser la prise de décision
                et fiabiliser l'approvisionnement.
              </p>

              <ul className="mt-6 space-y-3 text-gray-700">
                <li>• Diagnostic initial : ruptures fréquentes et processus manuels</li>
                <li>• Conception : prototype centré terrain et retour des praticiens</li>
                <li>• Objectif : fiabiliser, anticiper, simplifier</li>
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/origin-illustration.avif"
                  alt="Origine EYA"
                  width={640}
                  height={420}
                  className="object-cover"
                />
              </div>
            </div>
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

      {/* FONCTIONNEMENT */}
      <section id="fonctionnement" className="py-16 bg-gradient-to-r from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Fonctionnement</h2>
          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
            EYA orchestre le flux entre services, logistique et fournisseurs. Voici le parcours simplifié :
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6 items-start">
            <FlowStep
              icon="📦"
              title="Suivi en temps réel"
              text="Chaque mouvement (consommation, réception) est tracé et met à jour les stocks."
            />
            <FlowStep
              icon="⚠️"
              title="Alertes automatiques"
              text="Des seuils dynamiques déclenchent des notifications et propositions de commande."
            />
            <FlowStep
              icon="🧾"
              title="Commandes intelligentes"
              text="L'IA calcule les quantités et déclenche les commandes selon validation."
            />
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <StatCard value="-30%" label="Réduction estimée des ruptures" accent="bg-green-600" />
            <StatCard value="+40%" label="Efficacité opérationnelle" accent="bg-blue-600" />
            <StatCard value="100%" label="Visibilité centralisée" accent="bg-indigo-600" />
          </div>
        </div>
      </section>

      {/* OBJECTIFS */}
      <section id="objectifs" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Objectifs</h2>
          <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
            EYA vise une transformation durable : digitaliser la logistique, améliorer la coordination et
            préparer l'extension à d'autres établissements.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h4 className="font-semibold text-lg text-blue-700">Digitalisation</h4>
              <p className="text-sm text-gray-600 mt-2">Automatiser les flux et conserver un historique complet.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h4 className="font-semibold text-lg text-blue-700">Coordination</h4>
              <p className="text-sm text-gray-600 mt-2">Faciliter la communication entre services et logistique.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h4 className="font-semibold text-lg text-blue-700">Scalabilité</h4>
              <p className="text-sm text-gray-600 mt-2">Préparer le modèle pour être déployé dans tout le pays.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="/" className="inline-block bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800 transition">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 mt-12 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          EYA Health © 2026 — Making stockouts history. contact: lokoutodeprecieux@gmail.com
        </div>
      </footer>
    </main>
  );
}