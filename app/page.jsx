"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";

export default function HomePage() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Génération aléatoire uniquement côté client (évite l’erreur d’hydratation)
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-white text-gray-900 scroll-smooth">
      <Header />

      {/* SECTION 1 - ACCUEIL */}
      <section
        id="accueil"
        className="relative h-screen flex flex-col items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/accueil.jpg')",
        }}
      >
        {/* Overlay avec gradient animé bleu-vert */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-teal-900/70 animate-gradient" />

        {/* Effet de particules lumineuses */}
        <div className="absolute inset-0">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white px-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
            Bienvenue sur EYA Health
          </h2>
          <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-3xl mx-auto drop-shadow-lg">
            Une plateforme intelligente pour centraliser la gestion, automatiser les commandes
            et améliorer l'efficacité des services hospitaliers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="mailto:lokoutodeprecieux@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-2xl hover:shadow-blue-500/50"
            >
              Request a Demo
            </motion.a>
            <motion.a
              href="/eya"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition shadow-2xl"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>

        <style jsx>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 10s ease infinite;
          }
        `}</style>
      </section>

      {/* SECTION 2 - EYA */}
      <section
        id="eya"
        className="min-h-screen flex flex-col items-center justify-center relative px-6 py-20 overflow-hidden"
      >
        {/* Fond dégradé animé bleu-vert */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50" />

        {/* Cercles décoratifs flous */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 -left-20 w-96 h-96 bg-teal-400/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 mb-12 z-10"
        >
          EYA — Votre assistante santé numérique
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl relative z-10">
          {[
            {
              icon: "🧠",
              title: "Centralisation des données",
              text: "Regroupez tous les produits, services et fournisseurs au même endroit.",
              gradient: "from-blue-500 to-cyan-400",
              shadow: "hover:shadow-blue-500/30",
            },
            {
              icon: "⚙️",
              title: "Suivi automatisé",
              text: "Surveillez les stocks, générez des commandes et recevez des alertes critiques.",
              gradient: "from-purple-500 to-pink-400",
              shadow: "hover:shadow-purple-500/30",
            },
            {
              icon: "🔔",
              title: "Notifications intelligentes",
              text: "Restez informé en temps réel des besoins et des livraisons.",
              gradient: "from-orange-500 to-red-400",
              shadow: "hover:shadow-orange-500/30",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className={`bg-white shadow-lg ${item.shadow} rounded-2xl p-8 text-center hover:shadow-2xl transition-all border border-gray-100 relative overflow-hidden group`}
            >
              {/* Effet de brillance au survol */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <motion.div
                className="text-5xl mb-4 inline-block"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.icon}
              </motion.div>

              <h3
                className={`text-xl font-semibold mb-2 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
              >
                {item.title}
              </h3>

              <p className="text-gray-600">{item.text}</p>

              {/* Barre décorative en bas */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center relative z-10"
        >
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6 font-medium italic">
            "EYA, au service d'une gestion hospitalière efficace, moderne et humaine."
          </p>
          <motion.a
            href="/eya"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition shadow-xl hover:shadow-green-500/50 inline-block"
          >
            Découvrir plus
          </motion.a>
        </motion.div>
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
