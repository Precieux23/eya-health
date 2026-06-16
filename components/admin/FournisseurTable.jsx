"use client";

import { useState } from "react";
import api, { attachAuth } from "@/lib/api";
import { Edit, Trash2, Package } from "lucide-react";

export default function FournisseurTable({ fournisseurs, onDeleted, onEdit }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce fournisseur ? Cette action est irréversible.")) return;
    try {
      attachAuth();
      setLoadingId(id);
      const res = await api.delete(`/api/fournisseurs/${id}`);
      if (res.status === 200) {
        onDeleted && onDeleted(id);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Erreur suppression");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-blue-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <tr>
            <th className="p-4 text-left font-semibold flex items-center gap-2">
              <Package size={16} /> Nom Fournisseur
            </th>
            <th className="p-4 text-left font-semibold">Contact</th>
            <th className="p-4 text-left font-semibold">Email</th>
            <th className="p-4 text-left font-semibold">Adresse</th>
            <th className="p-4 text-left font-semibold">Délai livraison</th> 
            <th className="p-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {fournisseurs.length === 0 && (
            <tr>
              <td colSpan="6" className="p-6 text-center text-gray-500 animate-pulse">
                Aucun fournisseur trouvé. Ajoutez-en un !
              </td>
            </tr>
          )}
          {fournisseurs.map((p) => (
            <tr key={p._id} className="hover:bg-blue-50 transition-colors duration-200">
              <td className="p-4 font-medium text-blue-900">{p.nom_fournisseur}</td>
              <td className="p-4 text-gray-700">{p.contact}</td>
              <td className="p-4 text-gray-700">{p.email}</td>
              <td className="p-4 text-gray-700">{p.adresse}</td>
              <td className="p-4 text-gray-700">{p.delai_livraison}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-all duration-300"
                  >
                    <Edit size={14} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={loadingId === p._id}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    {loadingId === p._id ? "Suppression..." : "Supprimer"}
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