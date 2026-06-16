"use client";

import { useState } from "react";
import api, { attachAuth } from "@/lib/api";
import { Save, X } from "lucide-react";

export default function ProductForm({ initial = null, onSuccess }) {
  const [nom_produit, setNom] = useState(initial?.nom_produit || "");
  const [categorie, setCategorie] = useState(initial?.categorie || "médicament");
  const [unite, setUnite] = useState(initial?.unite || "");
  const [date_expiration, setDateExpiration] = useState(
    initial?.date_expiration ? initial.date_expiration.split("T")[0] : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!nom_produit || !categorie || !unite) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      attachAuth();
      const payload = { nom_produit, categorie, unite };
      if (date_expiration) payload.date_expiration = date_expiration;

      let res;
      if (initial && initial._id) {
        res = await api.put(`/api/produits/${initial._id}`, payload);
      } else {
        res = await api.post("/api/produits", payload);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom du Produit *</label>
        <input
          type="text"
          value={nom_produit}
          onChange={(e) => setNom(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          placeholder="Ex: Paracétamol 500mg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
          <select
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            required
          >
            <option value="médicament">Médicament</option>
            <option value="matériel">Matériel</option>
            <option value="consommable">Consommable</option>
            <option value="médical">Médical</option>
            <option value="textile">Textile</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Unité *</label>
          <input
            type="text"
            value={unite}
            onChange={(e) => setUnite(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: comprimé / boîte / ml"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date d'Expiration</label>
        <input
          type="date"
          value={date_expiration}
          onChange={(e) => setDateExpiration(e.target.value)}
          className="mt-1 block w-full md:w-auto rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
        />
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Enregistrement..." : initial ? "Mettre à Jour" : "Créer le Produit"}
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