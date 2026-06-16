"use client";

import { useState } from "react";
import api, { attachAuth } from "@/lib/api";
import { Save, X } from "lucide-react";

export default function ServiceForm({ initial = null, onSuccess }) {
  const [nom_service, setNom] = useState(initial?.nom_service || "");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState(initial?.unite || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nom_service || !description) {
      setError("Veuillez remplir les champs obligatoires.");
      return;
    }

    setLoading(true);

    try {
      attachAuth();

      // ---- FORM DATA ----
      const formData = new FormData();
      formData.append("nom_service", nom_service);
      formData.append("description", description);

      // Ajout image si sélectionnée
      if (image) formData.append("image", image);

      let res;

      if (initial && initial._id) {
        res = await api.patch(`/api/services/${initial._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await api.post("/api/services", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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

      {/* NOM DU SERVICE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom du Service *
        </label>
        <input
          type="text"
          value={nom_service}
          onChange={(e) => setNom(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          placeholder="Ex: Pharmacie"
          required
        />
      </div>

      {/* IMAGE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image du service *
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          required={!initial} 
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm"
          placeholder="Ex: Il sert à ..."
          required
        />
      </div>

      {/* ACTIONS */}
      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Enregistrement..." : initial ? "Mettre à jour" : "Créer le service"}
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
