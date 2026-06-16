"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api, { attachAuth } from "../../../lib/api";
import FournisseurTable from "../../../components/admin/FournisseurTable";
import FournisseurForm from "../../../components/admin/FournisseurForm";
import { Plus, ArrowLeft, Edit, X, Package, Sparkles, Users, Clock } from "lucide-react";

export default function FournisseursPage() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const load = async () => {
    try {
      attachAuth();
      const res = await api.get("http://localhost:5000/api/fournisseurs");
      setFournisseurs(res.data || []);
    } catch (err) {
      console.error(err);
      console.error(err?.response?.data?.message || "Impossible de charger les fournisseurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeleted = (id) => {
    setFournisseurs((prev) => prev.filter((p) => p._id !== id));
  };

  const handleEdit = (p) => {
    setEditing(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccessCreate = (newFourn) => {
    if (!newFourn) {
      setShowCreate(false);
      setEditing(null);
      setIsSubmitting(false);
      setSubmitMessage("");
      return;
    }
    setFournisseurs((prev) => [newFourn, ...prev]);
    setShowCreate(false);
    setEditing(null);
    setIsSubmitting(false);
    setSubmitMessage("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSuccessEdit = (updatedFourn) => {
    if (!updatedFourn) {
      setEditing(null);
      setIsSubmitting(false);
      setSubmitMessage("");
      return;
    }
    setFournisseurs((prev) => prev.map((p) => (p._id === updatedFourn._id ? updatedFourn : p)));
    setEditing(null);
    setIsSubmitting(false);
    setSubmitMessage("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      
      {/* Éléments décoratifs animés en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* HEADER MODERNE AVEC GLASSMORPHISM */}
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
                  Gestion des Fournisseurs
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
              <span className="relative z-10 font-semibold">Ajouter Fournisseur</span>
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
                    <span>Ajouter Fournisseur</span>
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
        {/* Overlay création */}
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
                  Créer un Nouveau Fournisseur
                </h3>
              </div>
              
              {isSubmitting && (
                <div className="mb-4 p-4 bg-blue-100 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-semibold">{submitMessage}</p>
                </div>
              )}
              
              <FournisseurForm onSuccess={(newFourn) => {
                if (newFourn) {
                  setIsSubmitting(true);
                  setSubmitMessage("Création en cours...");
                  setTimeout(() => { setSubmitMessage("Redirection..."); handleSuccessCreate(newFourn); }, 1000);
                } else { handleSuccessCreate(null); }
              }} />
            </div>
          </div>
        )}

        {/* Overlay édition */}
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
                  Modifier le Fournisseur
                </h3>
              </div>
              
              {isSubmitting && (
                <div className="mb-4 p-4 bg-indigo-100 border border-indigo-200 rounded-lg">
                  <p className="text-indigo-800 font-semibold">{submitMessage}</p>
                </div>
              )}
              
              <FournisseurForm initial={editing} onSuccess={(updatedFourn) => {
                if (updatedFourn) {
                  setIsSubmitting(true);
                  setSubmitMessage("Modification en cours...");
                  setTimeout(() => { setSubmitMessage("Redirection..."); handleSuccessEdit(updatedFourn); }, 1000);
                } else { handleSuccessEdit(null); }
              }} />
            </div>
          </div>
        )}

        {/* Section statistiques rapides - PLEINE LARGEUR */}
        <section className="mt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Carte Fournisseurs */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Package size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {fournisseurs.length}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">Fournisseurs</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Partenaires actifs</span>
                </div>
              </div>
            </div>

            {/* Carte Contacts */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Users size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    {fournisseurs.length * 2}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">Contacts</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Responsables</span>
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Délai */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Clock size={28} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    3-5j
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">Délai moyen</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1 h-3 rounded-full ${i < 3 ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
                    ))}
                  </div>
                  <span>Livraison rapide</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des fournisseurs - PLEINE LARGEUR */}
        <section className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-gray-200 hover:shadow-3xl transition-all duration-500 w-full">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Liste des Fournisseurs</h2>
                <div className="ml-auto px-4 py-2 bg-white/20 backdrop-blur-xl rounded-lg">
                  <span className="text-white font-semibold">{fournisseurs.length} fournisseurs</span>
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
                  <p className="text-gray-600 font-semibold animate-pulse">Chargement des fournisseurs...</p>
                </div>
              ) : (
                <FournisseurTable fournisseurs={fournisseurs} onDeleted={handleDeleted} onEdit={handleEdit} />
              )}
            </div>
          </div>
        </section>
      </div>

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