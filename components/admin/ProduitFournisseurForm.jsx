"use client";

import { useState, useEffect } from "react";
import api, { attachAuth } from "@/lib/api";
import { Save, X } from "lucide-react";

export default function ProduitFournisseurForm({
  produits = [],
  fournisseurs = [],
  initial = null,
  onSuccess,
}) {
  const [produit_id, setProduit] = useState(initial?.produit_id?._id || "");
  const [fournisseur_id, setFournisseur] = useState(initial?.fournisseur_id?._id || "");
  const [prix_unitaire, setPrix] = useState(initial?.prix_unitaire || "");

  const [delai_fournisseur, setDelai] = useState(
    initial?.fournisseur_id?.delai_livraison || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-remplir délai livraison selon fournisseur choisi
  useEffect(() => {
    if (!fournisseur_id) return;
    const selected = fournisseurs.find((f) => f._id === fournisseur_id);
    if (selected) setDelai(selected.delai_livraison);
  }, [fournisseur_id, fournisseurs]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!produit_id || !fournisseur_id || !prix_unitaire) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload = {
      produit_id,
      fournisseur_id,
      prix_unitaire: Number(prix_unitaire),
    };

    setLoading(true);
    try {
      attachAuth();

      let res;
      if (initial && initial._id) {
        // Update
        res = await api.put(`/api/produit-fournisseurs/${initial._id}`, payload);
      } else {
        // Create
        res = await api.post("/api/produit-fournisseurs", payload);
      }

      if (res?.status >= 200 && res?.status < 300) {
        onSuccess && onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Erreur lors de l'enregistrement de la relation produit–fournisseur."
      );
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

      {/* Produit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Produit *
        </label>
        <select
          value={produit_id}
          onChange={(e) => setProduit(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
          focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          required
        >
          <option value="">Sélectionnez un produit</option>
          {produits.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nom_produit}
            </option>
          ))}
        </select>
      </div>

      {/* Fournisseur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fournisseur *
        </label>
        <select
          value={fournisseur_id}
          onChange={(e) => setFournisseur(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
          focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          required
        >
          <option value="">Sélectionnez un fournisseur</option>
          {fournisseurs.map((f) => (
            <option key={f._id} value={f._id}>
              {f.nom_fournisseur}
            </option>
          ))}
        </select>
      </div>

      {/* Prix & Délai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix Unitaire (FCFA) *
          </label>
          <input
            type="number"
            value={prix_unitaire}
            onChange={(e) => setPrix(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: 250"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Délai Fournisseur (jours)
          </label>
          <input
            type="number"
            value={delai_fournisseur}
            disabled
            className="mt-1 block w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 shadow-sm"
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 
                     text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 
                     transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Enregistrement..." : initial ? "Mettre à Jour" : "Créer la Relation"}
        </button>

        <button
          type="button"
          onClick={() => onSuccess && onSuccess(null)}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg 
                     hover:bg-gray-200 transition-all duration-300 shadow-sm"
        >
          <X size={16} />
          Annuler
        </button>
      </div>
    </form>
  );
}
