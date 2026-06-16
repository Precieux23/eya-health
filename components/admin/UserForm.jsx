"use client";

import { useState, useEffect } from "react";
import api, { attachAuth } from "@/lib/api";
import { Save, X } from "lucide-react";

export default function UserForm({ initial = null, services = null, onSuccess }) {
  const [nom, setNom] = useState(initial?.nom || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [mot_de_passe, setMotDePasse] = useState(""); 
  const [role, setRole] = useState(initial?.role || "autre");
  const [service_id, setServiceId] = useState(initial?.service_id?._id || initial?.service_id || "");
  const [availableServices, setAvailableServices] = useState(services || []);
  const [loadingServices, setLoadingServices] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // 🟦 Rôles nécessitant obligatoirement un service
  const ROLES_AVEC_SERVICE = ["medecin", "infirmier", "agent_de_sante"];
  const serviceObligatoire = ROLES_AVEC_SERVICE.includes(role);

  // Load services if not passed via props
  useEffect(() => {
    let mounted = true;
    const loadServices = async () => {
      if (services && services.length) return;
      try {
        setLoadingServices(true);
        attachAuth();
        const res = await api.get("/api/services");
        if (!mounted) return;
        setAvailableServices(res.data || []);
      } catch (err) {
        console.error("Impossible de charger les services", err);
      } finally {
        setLoadingServices(false);
      }
    };
    loadServices();
    return () => (mounted = false);
  }, [services]);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nom || !email || (!initial && !mot_de_passe)) {
      setError("Veuillez remplir les champs obligatoires (nom, email, mot de passe pour création).");
      return;
    }

    // ⛔ Vérification obligatoire service selon le rôle
    if (serviceObligatoire && !service_id) {
      setError("Veuillez sélectionner un service pour ce rôle.");
      return;
    }

    const payload = {
      nom,
      email,
      role,
      service_id: service_id || null,
    };

    if (mot_de_passe) payload.mot_de_passe = mot_de_passe;

    setLoading(true);
    try {
      attachAuth();

      let res;
      if (initial && initial._id) {
        res = await api.put(`/api/users/${initial._id}`, payload);
      } else {
        res = await api.post("/api/users", payload);
      }

      if (res?.status >= 200 && res?.status < 300) {
        onSuccess && onSuccess(res.data);
      } else {
        setError("Réponse inattendue du serveur");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Erreur lors de l'enregistrement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
          placeholder="Ex: Aminata Diop"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
          placeholder="exemple@hopital.sn"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe {initial ? "(laisser vide = inchangé)" : "*"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={mot_de_passe}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-sm"
              placeholder="......."
              minLength={6}
              {...(!initial ? { required: true } : {})}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-2 text-sm text-gray-500 px-2 py-1 rounded"
            >
              {showPassword ? "Cacher" : "Voir"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setServiceId(""); // reset si rôle change
            }}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400 transition-all shadow-sm"
            required
          >
            <option value="medecin">Médecin</option>
            <option value="infirmier">Infirmier</option>
            <option value="agent_de_sante">Agent de santé</option>
            <option value="pharmacien">Pharmacien</option>
            <option value="autre">Autre</option>
            <option value="responsable_logistique">Responsable logistique</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service {serviceObligatoire && <span className="text-red-600">*</span>}
        </label>

        <select
          value={service_id || ""}
          onChange={(e) => setServiceId(e.target.value)}
          disabled={!serviceObligatoire}
          required={serviceObligatoire}
          className={`mt-1 block w-full rounded-lg border px-4 py-3 focus:ring-2 transition-all shadow-sm ${
            serviceObligatoire
              ? "border-gray-300 focus:ring-blue-400"
              : "bg-gray-100 text-gray-500 cursor-not-allowed"
          }`}
        >
          <option value="">Sélectionner un service</option>
          {loadingServices ? (
            <option>Chargement...</option>
          ) : (
            availableServices.map((s) => (
              <option key={s._id} value={s._id}>
                {s.nom_service}
              </option>
            ))
          )}
        </select>
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all shadow-md disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? (initial ? "Mise à jour..." : "Création...") : (initial ? "Mettre à jour utilisateur" : "Créer utilisateur")}
        </button>

        <button
          type="button"
          onClick={() => onSuccess && onSuccess(null)}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all shadow-sm"
        >
          <X size={16} />
          Annuler
        </button>
      </div>
    </form>
  );
}
