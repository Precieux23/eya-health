"use client";

import { useState, useEffect } from "react";
import api, { attachAuth } from "@/lib/api";
import { Save, X } from "lucide-react";

export default function StockForm({
  produits = [],
  services = [],
  initial = null,
  onSuccess,
}) {
const [produit_id, setProduit] = useState(initial?.produit?._id || "");  // ✅ produit au lieu de produit_id
const [service_id, setService] = useState(initial?.service?._id || "");  // ✅ service au lieu de service_id
  const [quantite_actuelle, setQuantitea] = useState(initial?.quantite_actuelle || "");
  const [seuil_min, setSeuil] = useState(initial?.seuil_min || "");
  const [quantite_max, setQuantitem] = useState(initial?.quantite_max || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!produit_id || !service_id || !quantite_actuelle || !seuil_min || !quantite_max) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload = {
      produit: produit_id,        // ✅ Changé de produit_id à produit
      service: service_id,        // ✅ Changé de service_id à service
      quantite_actuelle: Number(quantite_actuelle),
      seuil_min: Number(seuil_min),
      quantite_max: Number(quantite_max),
    };

    setLoading(true);
    try {
      attachAuth();

      let res;
      if (initial && initial._id) {
        // Update
        res = await api.put(`/api/stocks/${initial._id}`, payload);
      } else {
        // Create
        res = await api.post("/api/stocks", payload);
      }

      if (res?.status >= 200 && res?.status < 300) {
        onSuccess && onSuccess(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Erreur lors de l'initialisation du stock."
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

      {/* Services */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service *
        </label>
        <select
          value={service_id}
          onChange={(e) => setService(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
          focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          required
        >
          <option value="">Sélectionnez un service</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.nom_service}
            </option>
          ))}
        </select>
      </div>

      {/* Le reste*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantité Actuelle *
          </label>
          <input
            type="number"
            value={quantite_actuelle}
            onChange={(e) => setQuantitea(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: 250"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seuil min *
          </label>
          <input
            type="number"
            value={seuil_min}
            onChange={(e) => setSeuil(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: 25"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantité Max *
          </label>
          <input
            type="number"
            value={quantite_max}
            onChange={(e) => setQuantitem(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 
                       focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
            placeholder="Ex: 250"
            required
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
          {loading ? "Enregistrement..." : initial ? "Mettre à Jour" : "Créer le Stock"}
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
