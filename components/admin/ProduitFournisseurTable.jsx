"use client";

import { useState } from "react";
import api, { attachAuth } from "@/lib/api";
import { Edit, Trash2, Link as LinkIcon } from "lucide-react";

export default function ProduitFournisseurTable({ relations, onDeleted, onEdit }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette relation produit–fournisseur ?")) return;

    try {
      attachAuth();
      setLoadingId(id);
      const res = await api.delete(`/api/produit-fournisseurs/${id}`);

      if (res.status === 200) {
        onDeleted && onDeleted(id);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur lors de la suppression");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-blue-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <tr>
            <th className="p-4 text-left font-semibold flex items-center gap-2">
              <LinkIcon size={16} /> Produit
            </th>
            <th className="p-4 text-left font-semibold">Fournisseur</th>
            <th className="p-4 text-left font-semibold">Prix unitaire</th>
            <th className="p-4 text-left font-semibold">Délai fournisseur (jours)</th>
            <th className="p-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {relations.length === 0 && (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-500 animate-pulse">
                Aucune relation trouvée. Ajoutez-en une !
              </td>
            </tr>
          )}

          {relations.map((rel) => (
            <tr key={rel._id} className="hover:bg-blue-50 transition duration-200">
              <td className="p-4 font-medium text-blue-900">
                {rel.produit_id?.nom_produit || "—"}
              </td>

              <td className="p-4 text-gray-700">
                {rel.fournisseur_id?.nom_fournisseur || "—"}
              </td>

              <td className="p-4 text-gray-700">
                {rel.prix_unitaire} FCFA
              </td>

              <td className="p-4 text-gray-700">
                {rel.fournisseur_id?.delai_livraison || "-"}
              </td>

              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(rel)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all"
                  >
                    <Edit size={14} /> Modifier
                  </button>

                  <button
                    onClick={() => handleDelete(rel._id)}
                    disabled={loadingId === rel._id}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {loadingId === rel._id ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
