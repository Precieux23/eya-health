"use client";

import { useEffect, useState } from "react";
import ProduitFournisseurForm from "@/components/admin/ProduitFournisseurForm";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Sparkles, CheckCircle, Link2, Package, Truck, DollarSign, Clock, Lightbulb } from "lucide-react";
import Link from "next/link";
import api, { attachAuth } from "@/lib/api";

export default function CreateRelationPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [produits, setProducts] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  
  useEffect(() => {
    async function loadData() {
      attachAuth();
      const [pRes, sRes] = await Promise.all([
        api.get("/api/produits"),
        api.get("/api/fournisseurs"),
      ]);
      setProducts(pRes.data || []);
      setFournisseurs(sRes.data || []);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* HEADER MODERNE */}
      <header className="w-full bg-white/70 backdrop-blur-2xl shadow-xl px-6 py-4 fixed top-0 left-0 right-0 z-50 border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <a href="/" className="group flex items-center gap-3 hover:opacity-90 transition-all duration-500">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img src="/chu.jpeg" alt="EYA Health Logo" className="w-12 h-12 rounded-xl border-2 border-white shadow-lg relative z-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-purple-600 transition-all duration-500">
                  Gestion des Relations
                </h1>
                <p className="text-sm text-gray-600 font-semibold group-hover:text-gray-800 transition-colors">
                  un hôpital partenaire
                </p>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            <Link href="/admin3/relation" className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-200 hover:border-gray-300 hover:scale-105">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">Retour à la Liste</span>
            </Link>
          </nav>

          <div className="md:hidden relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold hover:scale-105">
              <span>Menu</span>
              <span className={`transform transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-gray-200 animate-fadeIn">
                <div className="p-3">
                  <Link href="/admin3/relation" onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:shadow-md font-semibold">
                    <ArrowLeft size={18} />
                    <span>Retour à la Liste</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="max-w-5xl mx-auto px-4 pt-20 relative z-10">
        {/* Card d'information avec animation */}
        <div className="mt-8 mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-1 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scaleIn">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl relative group hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <Link2 size={32} className="text-white relative z-10" />
                  <Sparkles size={16} className="text-white absolute top-2 right-2 animate-pulse" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
                  Créer une Relation Produit ↔ Fournisseur
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  Établissez un lien stratégique entre un produit et un fournisseur pour optimiser votre chaîne d'approvisionnement et gérer efficacement les tarifs et délais.
                </p>
                
                {/* Tags informatifs adaptés aux relations */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-200 transition-colors cursor-default">
                    <Link2 size={14} />
                    Association stratégique
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold hover:bg-purple-200 transition-colors cursor-default">
                    <DollarSign size={14} />
                    Gestion des prix
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold hover:bg-green-200 transition-colors cursor-default">
                    <Clock size={14} />
                    Suivi des délais
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire dans une belle card */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-500">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Link2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Informations de la Relation</h3>
                <p className="text-sm text-gray-600">Sélectionnez le produit, le fournisseur et définissez les conditions</p>
              </div>
            </div>
          </div>

          <div className="p-8 relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <ProduitFournisseurForm
                produits={produits}
                fournisseurs={fournisseurs}
                onSuccess={(res) => {
                  if (res) {
                    setShowSuccess(true);
                    setTimeout(() => { router.push("/admin3/relation"); }, 1500);
                  } else { router.back(); }
                }}
              />
            </div>
          </div>
        </div>

        {/* Section d'aide améliorée */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Lightbulb size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">
              Conseils pour créer une relation efficace
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <Package size={16} className="text-blue-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Sélection du produit</h5>
                  <p className="text-sm text-gray-600">Choisissez le produit à lier et vérifiez qu'il n'est pas déjà associé au même fournisseur</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-100 hover:border-purple-300 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <Truck size={16} className="text-purple-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Choix du fournisseur</h5>
                  <p className="text-sm text-gray-600">Sélectionnez un fournisseur fiable qui peut livrer ce produit régulièrement</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 hover:border-indigo-300 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <DollarSign size={16} className="text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Prix unitaire</h5>
                  <p className="text-sm text-gray-600">Indiquez le prix négocié avec le fournisseur pour faciliter le calcul des coûts</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-green-100 hover:border-green-300 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                  <Clock size={16} className="text-green-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Délai de livraison</h5>
                  <p className="text-sm text-gray-600">Précisez le nombre de jours nécessaires pour la livraison du produit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification de succès animée */}
      {showSuccess && (
        <div className="fixed top-24 right-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-200 p-6 z-50 animate-slideIn max-w-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Relation créée avec succès !</h4>
              <p className="text-sm text-gray-600">Redirection vers la liste...</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-progress"></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
        .animate-progress { animation: progress 1.5s ease-out forwards; }
      `}</style>
    </main>
  );
}