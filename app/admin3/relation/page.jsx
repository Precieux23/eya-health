"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api, { attachAuth } from "../../../lib/api";
import ProduitFournisseurTable from "../../../components/admin/ProduitFournisseurTable.jsx";
import ProduitFournisseurForm from "../../../components/admin/ProduitFournisseurForm.jsx";
import { Plus, ArrowLeft, Edit, X, Package, Sparkles, TrendingUp, Clock, Link2, DollarSign } from "lucide-react";

export default function ProduitFournisseursPage() {
  const [relations, setRelations] = useState([]);
  const [produits, setProduits] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      attachAuth();
      const [rRel, rProd, rFourn] = await Promise.all([
        api.get("/api/produit-fournisseurs"),
        api.get("/api/produits"),
        api.get("/api/fournisseurs"),
      ]);

      const relationsData = rRel.data || [];
      setRelations(relationsData);
      setProduits(rProd.data || []);
      setFournisseurs(rFourn.data || []);
    } catch (err) {
      console.error("Erreur chargement données :", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const stats = (() => {
    if (!relations.length) return {
      topProduit: null,
      topFournisseur: null,
      prixMoyen: 0,
      delaiMoyen: 0,
    };

    const prodCount = {};
    const fournCount = {};
    let prixSum = 0, delaiSum = 0, n=0;

    relations.forEach(r => {
      const p = r.produit_id;
      const f = r.fournisseur_id;
      if (p) prodCount[p._id || p] = (prodCount[p._id || p] || 0) + 1;
      if (f) fournCount[f._id || f] = (fournCount[f._id || f] || 0) + 1;

      if (typeof r.prix_unitaire === "number") { prixSum += r.prix_unitaire; n++; }
      if (typeof r.delai_livraison === "number") delaiSum += r.delai_livraison;
    });

    const topProdId = Object.entries(prodCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || null;
    const topFournId = Object.entries(fournCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || null;
    const topProduit = relations.find(r => (r.produit_id && (r.produit_id._id === topProdId)))?.produit_id || null;
    const topFournisseur = relations.find(r => (r.fournisseur_id && (r.fournisseur_id._id === topFournId)))?.fournisseur_id || null;

    const prixMoyen = n ? Math.round((prixSum / n) * 100) / 100 : 0;
    const delaiMoyen = relations.length ? Math.round((delaiSum / relations.length) * 100) / 100 : 0;

    return { topProduit, topFournisseur, prixMoyen, delaiMoyen };
  })();

  const handleCreated = (newRel) => {
    if (newRel) setRelations(prev => [newRel, ...prev]);
    setShowCreate(false);
  };
  const handleUpdated = (updated) => {
    if (!updated) { setEditing(null); return; }
    setRelations(prev => prev.map(r => r._id === updated._id ? updated : r));
    setEditing(null);
  };
  const handleDeleted = (id) => {
    setRelations(prev => prev.filter(r => r._id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* HEADER */}
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
            <button
              onClick={() => setShowCreate(true)}
              className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Plus size={18} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative z-10 font-semibold">Nouvelle Relation</span>
              <Sparkles size={16} className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-200 hover:border-gray-300 hover:scale-105"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">Retour au Dashboard</span>
            </Link>
          </nav>

          <div className="md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold hover:scale-105"
            >
              <span>Menu</span>
              <span className={`transform transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-gray-200 animate-fadeIn">
                <div className="p-3 space-y-2">
                  <button
                    onClick={() => { setShowCreate(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
                  >
                    <Plus size={18} />
                    <span>Nouvelle Relation</span>
                  </button>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:shadow-md font-semibold"
                  >
                    <ArrowLeft size={18} />
                    <span>Retour au Dashboard</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-4 pt-20 relative z-10">
        {/* Statistiques améliorées - PLEINE LARGEUR */}
        <section className="mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            {/* Produit le plus lié */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Package size={24} className="text-white" />
                </div>
                <div className="text-sm text-gray-500 font-medium">Produit le plus lié</div>
              </div>
              <div className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                {stats.topProduit ? stats.topProduit.nom_produit : "—"}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp size={12} className="text-blue-500" />
                  <span>Le plus demandé</span>
                </div>
              </div>
            </div>

            {/* Fournisseur le plus utilisé */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Link2 size={24} className="text-white" />
                </div>
                <div className="text-sm text-gray-500 font-medium">Fournisseur privilégié</div>
              </div>
              <div className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                {stats.topFournisseur ? stats.topFournisseur.nom_fournisseur : "—"}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Sparkles size={12} className="text-purple-500" />
                  <span>Partenaire principal</span>
                </div>
              </div>
            </div>

            {/* Prix moyen */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div className="text-sm text-gray-500 font-medium">Prix unitaire moyen</div>
              </div>
              <div className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {stats.prixMoyen ? `${stats.prixMoyen} FCFA` : "—"}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: stats.prixMoyen ? '75%' : '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Délai moyen */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Clock size={24} className="text-white" />
                </div>
                <div className="text-sm text-gray-500 font-medium">Délai livraison moyen</div>
              </div>
              <div className="text-xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {stats.delaiMoyen ? `${stats.delaiMoyen}j` : "—"}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                    ))}
                  </div>
                  <span>Temps de réponse</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des relations - PLEINE LARGEUR */}
        <section className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-gray-200 hover:shadow-3xl transition-all duration-500 w-full">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                  <Link2 size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Relations Produit ↔ Fournisseur</h2>
                <div className="ml-auto px-4 py-2 bg-white/20 backdrop-blur-xl rounded-lg">
                  <span className="text-white font-semibold">{relations.length} relations</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
                  </div>
                  <p className="text-gray-600 font-semibold animate-pulse">Chargement des relations...</p>
                </div>
              ) : (
                <ProduitFournisseurTable
                  relations={relations}
                  loading={loading}
                  onEdit={(r) => setEditing(r)}
                  onDeleted={handleDeleted}
                />
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Modal création */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center overflow-y-auto z-50 animate-fadeIn">
          <div className="mt-28 mb-8 bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 relative border border-gray-200 transform animate-scaleIn h-fit">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
            
            <button onClick={() => setShowCreate(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-300 hover:rotate-90 z-10">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Plus size={24} className="text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Créer une Relation Produit ↔ Fournisseur
              </h3>
            </div>
            
            <ProduitFournisseurForm
              produits={produits}
              fournisseurs={fournisseurs}
              onSuccess={(created) => handleCreated(created)}
            />
          </div>
        </div>
      )}

      {/* Modal édition */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center overflow-y-auto z-50 animate-fadeIn">
          <div className="mt-28 mb-8 bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 relative border border-gray-200 transform animate-scaleIn h-fit">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-400 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-400 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
            
            <button onClick={() => setEditing(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-300 hover:rotate-90 z-10">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Edit size={24} className="text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                Modifier la Relation
              </h3>
            </div>
            
            <ProduitFournisseurForm
              produits={produits}
              fournisseurs={fournisseurs}
              initial={editing}
              onSuccess={(updated) => handleUpdated(updated)}
            />
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
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animation-delay-150 { animation-delay: 150ms; }
      `}</style>
    </main>
  );
}