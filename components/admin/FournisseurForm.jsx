"use client";

import { useState } from "react";
import api, { attachAuth } from "@/lib/api";
import { Save, X } from "lucide-react";
import { address } from "framer-motion/client";

export default function FournisseurForm({ initial = null, onSuccess }) {
  const [nom_fournisseur, setNom_fournisseur] = useState(initial?.nom_fournisseur || "");
  const [contact, setContact] = useState(initial?.contact || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [adresse, setAdresse] = useState(initial?.adresse || "");
  const [delai_livraison, setDelai_livraison] = useState(initial?.delai_livraison || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!nom_fournisseur|| !contact || !email || !delai_livraison || !adresse) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      attachAuth();
      const payload = { nom_fournisseur, contact, email, delai_livraison, adresse};
      

      let res;
      if (initial && initial._id) {
        res = await api.put(`/api/fournisseurs/${initial._id}`, payload);
      } else {
        res = await api.post("/api/fournisseurs", payload);
      }

      if (res && res.status >= 200 && res.status < 300) {
        onSuccess && onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 animate-pulse">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du Fournisseur *</label>
        <input
          type="text"
          value={nom_fournisseur}
          onChange={(e) => setNom_fournisseur(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          placeholder="Santé +"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact *</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: +221 76 556 81 25"
            required
          
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: contact@santeplus.sn"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: HLM5"
            required
          
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Délai livraison *</label>
          <input
            type="number"
            value={delai_livraison}
            onChange={(e) => setDelai_livraison(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: 10"
            required
          />
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Enregistrement..." : initial ? "Mettre à Jour" : "Créer le Fournisseur"}
        </button>
        <button
          type="button"
          onClick={() => onSuccess && onSuccess(null)}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-sm"
        >
          <X size={16} /> Annuler
        </button>
      </div>
    </form>
  );
}