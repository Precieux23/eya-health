"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  {/* 🆕 SECTION EXPLICATIVE – HERO */}
    <section className="mt-10 mb-12 bg-white shadow-md rounded-2xl p-8 border-l-4 border-blue-600">
      <h2 className="text-2xl font-bold text-blue-800 mb-3">
        Bienvenue dans votre tableau de bord logistique
      </h2>

      <p className="text-gray-600 leading-relaxed max-w-3xl">
        Cet espace vous permet de superviser en temps réel l’état des stocks,
        d’anticiper les ruptures, de suivre les besoins des services hospitaliers
        et de gérer l’approvisionnement d’un hôpital partenaire.
        Utilisez les statistiques, alertes et services ci-dessous pour optimiser
        vos interventions et garantir la disponibilité permanente des produits.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-6">

        <div className="p-4 bg-blue-50 rounded-xl border shadow-sm">
          <h4 className="font-semibold text-blue-700">✔ Supervision globale</h4>
          <p className="text-sm text-gray-600">
            Accédez en un coup d’œil aux ruptures, commandes et stocks critiques.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border shadow-sm">
          <h4 className="font-semibold text-blue-700">✔ Gestion centralisée</h4>
          <p className="text-sm text-gray-600">
            Tous les produits, services et fournisseurs regroupés au même endroit.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border shadow-sm">
          <h4 className="font-semibold text-blue-700">✔ Actions rapides</h4>
          <p className="text-sm text-gray-600">
            Ajoutez, modifiez ou initialisez vos stocks en quelques clics.
          </p>
        </div>
      </div>
    </section>

  const services = [
    { name: "Urgences", icon: "🏥", slug: "urgences" },
    { name: "Laboratoire", icon: "🧪", slug: "laboratoire" },
    { name: "Bloc Opératoire", icon: "💉", slug: "bloc" },
    { name: "Pédiatrie", icon: "🧸", slug: "pediatrie" },
    { name: "Pharmacie Interne", icon: "💊", slug: "pharmacie" },
    { name: "Hygiène & Salubrité", icon: "🧹", slug: "hygiene" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Services de l'hôpital partenaire
        </h1>

        {/* GRID DES SERVICES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.name}
              onClick={() => router.push(`/dashboard/${service.slug}`)}
              className="cursor-pointer bg-white shadow-md hover:shadow-xl transition-all p-6 rounded-2xl border 
                         hover:-translate-y-1"
            >
              <div className="text-6xl mb-4">{service.icon}</div>
              <h2 className="text-xl font-semibold text-gray-700">{service.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* HEADER COMPONENT */
function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-blue-700 text-white flex items-center justify-center rounded-full font-bold">
            E
          </div>
          <span className="text-lg font-semibold text-gray-800">
            EYA Health
          </span>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="/dashboard" className="hover:text-blue-700">Dashboard</a>

          {/* MENU DÉROULANT */}
          <div className="relative group">
            <button className="hover:text-blue-700">Configuration ▾</button>

            {/* Dropdown */}
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-xl opacity-0 invisible 
                            group-hover:opacity-100 group-hover:visible transition-all">
              {[
                { label: "Services", link: "/config/services" },
                { label: "Produits", link: "/config/produits" },
                { label: "Fournisseurs", link: "/config/fournisseurs" },
                { label: "Liaison P-F", link: "/config/pf" },
                { label: "Stock Initial", link: "/config/stock" },
                { label: "Utilisateurs", link: "/config/utilisateurs" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.link}
                  className="block px-4 py-2 hover:bg-blue-50 rounded-lg"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <a href="/historique" className="hover:text-blue-700">Historique</a>
          <a href="/notifications" className="hover:text-blue-700">Notifications</a>

          {/* Avatar */}
            <a href="/" className="hover:text-blue-700">Retour</a>
          
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          ☰
        </div>
      </div>
    </header>
  );
}
