"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Building2, 
  Users, 
  Truck, 
  Link2, 
  Database, 
  Download,
  ArrowRight,
  Sparkles,
  Zap,
  Star
} from "lucide-react";

export default function ConfigurationPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Cartes d'actions
  const actions = [
    {
      titre: "Ajouter Produit",
      description: "Créer et gérer les produits du catalogue médical",
      icon: Package,
      href: "admin/produits/create",
      gradient: "from-blue-500 to-cyan-500",
      color: "blue",
    },
    {
      titre: "Ajouter Service",
      description: "Créer et organiser les services hospitaliers",
      icon: Building2,
      href: "admin1/services/create",
      gradient: "from-purple-500 to-pink-500",
      color: "purple",
    },
    {
      titre: "Ajouter Utilisateur",
      description: "Gérer les comptes et permissions du personnel",
      icon: Users,
      href: "admin5/utilisateurs/create",
      gradient: "from-green-500 to-emerald-500",
      color: "green",
    },
    {
      titre: "Ajouter Fournisseur",
      description: "Enregistrer et suivre les fournisseurs partenaires",
      icon: Truck,
      href: "admin2/fournisseurs/create",
      gradient: "from-orange-500 to-red-500",
      color: "orange",
    },
    {
      titre: "Lier Produit-Fournisseur",
      description: "Associer les produits aux fournisseurs avec tarifs",
      icon: Link2,
      href: "admin3/relation/create",
      gradient: "from-indigo-500 to-purple-500",
      color: "indigo",
    },
    {
      titre: "Initialiser Stock",
      description: "Configurer les stocks initiaux par service",
      icon: Database,
      href: "admin4/stock/create",
      gradient: "from-teal-500 to-cyan-500",
      color: "teal",
    },
    {
      titre: "Télécharger Historique",
      description: "Exporter l'historique des mouvements et commandes",
      icon: Download,
      href: "/historique",
      gradient: "from-pink-500 to-rose-500",
      color: "pink",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      
      {/* HEADER */}
      <header className="w-full bg-white/90 backdrop-blur-2xl shadow-xl px-6 py-4 sticky top-0 z-50 border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="group flex items-center gap-3 hover:opacity-90 transition-all">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl">
                  <img src="/chu.jpeg" alt="Logo" className="w-12 h-12 rounded-xl border-2 border-white shadow-lg" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Centre de Configuration
                </h1>
                <p className="text-sm text-gray-600 font-semibold">un hôpital partenaire</p>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-1 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 rounded-xl">
              <span className="text-xl">←</span> Retour
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              Menu <span className={`transform transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {menuOpen && (
              <div className="absolute right-6 mt-3 w-64 bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-blue-100">
                <Link href="/dashboard" className="flex items-center gap-1 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 rounded-xl">
                  <span className="text-xl">←</span> Retour
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* SECTION 1 : PRÉSENTATION */}
        <div className="mb-20 text-center relative">
          {/* Floating decorative elements */}
          <div className="absolute -top-10 left-1/4 w-16 h-16 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute -top-5 right-1/4 w-12 h-12 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-2xl animate-bounce" style={{animationDelay: '0.5s'}}></div>
          
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white px-8 py-3.5 rounded-full mb-8 shadow-2xl backdrop-blur-sm border border-white/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            <Sparkles size={22} className="animate-spin" style={{animationDuration: '3s'}} />
            <span className="font-bold text-sm uppercase tracking-widest">Centre de Configuration</span>
            <Zap size={22} className="animate-pulse" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-8 drop-shadow-sm leading-tight">
            Gérer votre système
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-4">
            Accédez rapidement à toutes les fonctionnalités de configuration du système de gestion intelligente. 
          </p>
          <p className="text-lg text-indigo-600 font-semibold max-w-3xl mx-auto">
            Chaque action vous permet de structurer et optimiser la gestion des stocks hospitaliers.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-blue-400 to-blue-500"></div>
            <Star className="text-blue-500 animate-pulse" size={18} />
            <div className="h-0.5 w-24 bg-gradient-to-l from-transparent via-blue-400 to-blue-500"></div>
          </div>
        </div>

        {/* SECTION 2 : CARTES D'ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Link
                key={index}
                href={action.href}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 border-gray-100 hover:border-transparent overflow-hidden"
              >
                {/* Gradient de fond animé */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                
                {/* Glowing orb effect */}
                <div className={`absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br ${action.gradient} rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150`}></div>
                
                {/* Corner accent animé */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-3xl group-hover:from-blue-100 transition-colors duration-500"></div>
                
                {/* Icône avec effet 3D amélioré */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-all duration-500`}></div>
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 border-2 border-white/50`}>
                    <Icon size={36} className="text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                  {/* Particules autour de l'icône */}
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
                </div>
                
                {/* Contenu */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {action.titre}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
                    {action.description}
                  </p>
                  
                  {/* Bouton d'action avec effet néon */}
                  <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all duration-300">
                    <span className="relative">
                      Accéder
                      <span className={`absolute inset-0 bg-gradient-to-r ${action.gradient} blur-md opacity-0 group-hover:opacity-30 transition-opacity`}></span>
                    </span>
                    <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform drop-shadow-sm" strokeWidth={2.5} />
                  </div>
                </div>
                
                {/* Effet de brillance au survol - version améliorée */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-all duration-1000 pointer-events-none"></div>
                
                {/* Badge de statut */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-3 h-3 bg-gradient-to-r ${action.gradient} rounded-full animate-pulse shadow-lg`}></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* SECTION INFORMATIVE - Version améliorée */}
        <div className="relative group">
          {/* Glow effect subtil */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 via-purple-300/20 to-pink-300/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50"></div>
          
          <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-10 border-2 border-blue-200 group-hover:border-indigo-300 transition-all duration-500 overflow-hidden shadow-xl">
            {/* Motif de fond animé */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.5),transparent_50%)]"></div>
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.5),transparent_50%)]"></div>
            </div>
            
            {/* Décorations des coins */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-200/30 to-transparent rounded-tl-full"></div>
            
            <div className="flex items-start gap-6 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl border-2 border-white/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Sparkles size={28} className="text-white animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <span className="text-3xl animate-bounce" style={{animationDuration: '2s'}}>💡</span>
                  <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    Conseil d'utilisation
                  </span>
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Pour une configuration optimale, suivez l'ordre recommandé : 
                  <span className="block mt-4 font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-xl drop-shadow-sm"> 
                    Produits → Services → Utilisateurs → Fournisseurs → Liaisons → Stocks
                  </span>
                  <span className="block mt-4 text-gray-600 text-base">
                    Cela garantit une cohérence dans la base de données et facilite la gestion quotidienne du système.
                  </span>
                </p>
              </div>
            </div>
            
            {/* Ligne décorative animée */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </div>
        </div>

        {/* Footer decoration */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-0.5 w-20 bg-gradient-to-r from-transparent to-gray-300"></div>
            <Sparkles size={16} className="text-indigo-400 animate-pulse" />
            <div className="h-0.5 w-20 bg-gradient-to-l from-transparent to-gray-300"></div>
          </div>
        </div>
      </main>
    </div>
  );
}