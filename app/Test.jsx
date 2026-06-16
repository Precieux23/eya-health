"use client";
import { motion } from "framer-motion";
import Header from "@/components/ui/Header";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full bg-white text-gray-900 scroll-smooth">
      <Header />

      {/* SECTION 1 - ACCUEIL */}
      <section
        id="accueil"
        className="relative h-screen flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/accueil.jpg')", // Mets ici une belle image de l'hôpital partenaire
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-white px-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenue sur EYA Health
          </h2>
          <p className="text-lg md:text-xl mb-6 text-gray-200 max-w-3xl mx-auto">
            Une plateforme intelligente pour centraliser la gestion, automatiser les commandes
            et améliorer l’efficacité des services hospitaliers.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Se connecter
          </a>
        </motion.div>
      </section>

      {/* SECTION 2 - EYA */}
      <section
        id="eya"
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-20"
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-blue-700 mb-12"
        >
          EYA — Votre assistante hospitalière numérique
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {[
            {
              icon: "🧠",
              title: "Centralisation des données",
              text: "Regroupez tous les produits, services et fournisseurs au même endroit.",
            },
            {
              icon: "⚙️",
              title: "Suivi automatisé",
              text: "Surveillez les stocks, générez des commandes et recevez des alertes critiques.",
            },
            {
              icon: "🔔",
              title: "Notifications intelligentes",
              text: "Restez informé en temps réel des besoins et des livraisons.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="bg-white shadow-lg rounded-2xl p-8 text-center hover:shadow-xl transition"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-700">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-6">
            “EYA, au service d’une gestion hospitalière efficace, moderne et humaine.”
          </p>
          <a
            href="/eya"
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Découvrir plus
          </a>
        </motion.div>
      </section>
    </main>
  );
}

