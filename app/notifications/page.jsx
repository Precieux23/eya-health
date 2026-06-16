"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // ✅ AJOUT

export default function NotificationsPage() {
  const searchParams = useSearchParams(); // ✅ AJOUT
  const returnUrl = searchParams.get("from") || "/dashboard"; // ✅ URL de retour

  const [notifications, setNotifications] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("toutes");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    chargerDonnees();
    
    const interval = setInterval(chargerDonnees, 30000);
    return () => clearInterval(interval);
  }, []);

  const chargerDonnees = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const resNotifs = await axios.get("http://localhost:5000/api/notifications", { headers });
      setNotifications(resNotifs.data);

      const resAlertes = await axios.get("http://localhost:5000/api/alertes", { headers });
      setAlertes(resAlertes.data);

      setLoading(false);
    } catch (error) {
      console.error("Erreur chargement:", error);
      setLoading(false);
    }
  };

  const marquerLue = async (notifId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${notifId}/marquer-lu`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNotifications(notifications.map(n => 
        n._id === notifId ? { ...n, lu: true } : n
      ));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const marquerToutesLues = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/notifications/marquer-toutes-lues",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      chargerDonnees();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const supprimerNotification = async (notifId) => {
    if (!confirm("Supprimer cette notification ?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/notifications/${notifId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(notifications.filter(n => n._id !== notifId));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const ouvrirModalAlerte = (alerte) => {
    setModalAlerte(alerte);
  };

  // Actions ORANGE
  const validerAlerteOrange = async (alerteId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      await axios.put(
        `http://localhost:5000/api/alertes/${alerteId}/valider-orange`,
        { utilisateur_id: user._id || user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("✅ Alerte orange validée !");
      setModalAlerte(null);
      chargerDonnees();
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de la validation");
    } finally {
      setActionLoading(false);
    }
  };

  const refuserAlerteOrange = async (alerteId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      await axios.put(
        `http://localhost:5000/api/alertes/${alerteId}/refuser-orange`,
        { utilisateur_id: user._id || user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("❌ Alerte orange refusée");
      setModalAlerte(null);
      chargerDonnees();
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur");
    } finally {
      setActionLoading(false);
    }
  };

  // Actions ROUGE
  const commanderMaintenant = async (alerteId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      await axios.put(
        `http://localhost:5000/api/alertes/${alerteId}/commander-maintenant`,
        { utilisateur_id: user._id || user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("✅ Commande créée avec succès !");
      setModalAlerte(null);
      chargerDonnees();
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de la commande");
    } finally {
      setActionLoading(false);
    }
  };

  const marquerNonNecessaire = async (alerteId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      await axios.put(
        `http://localhost:5000/api/alertes/${alerteId}/non-necessaire`,
        { utilisateur_id: user._id || user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("✅ Alerte marquée comme non nécessaire");
      setModalAlerte(null);
      chargerDonnees();
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur");
    } finally {
      setActionLoading(false);
    }
  };

  const notificationsFiltrees = notifications.filter(n => {
    if (activeTab === "toutes") return true;
    if (activeTab === "alertes") return n.type === "alerte";
    if (activeTab === "commandes") return n.type === "commande";
    return true;
  });

  const notificationsNonLues = notifications.filter(n => !n.lu).length;

  const getIconeNotification = (type) => {
    switch (type) {
      case "alerte": return "🚨";
      case "commande": return "📦";
      case "livraison": return "🚚";
      case "stock": return "📊";
      default: return "📢";
    }
  };

  const getCouleurNotification = (type) => {
    switch (type) {
      case "alerte": return "bg-red-50 border-red-200";
      case "commande": return "bg-blue-50 border-blue-200";
      case "livraison": return "bg-green-50 border-green-200";
      case "stock": return "bg-orange-50 border-orange-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  // Trouver l'alerte correspondante à une notification
  const getAlerteFromNotification = (notif) => {
    return alertes.find(a => {
      const produitNom = a.stock?.produit?.nom_produit;
      return produitNom && notif.message.includes(produitNom);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* HEADER */}
      <header className="w-full bg-white/90 backdrop-blur-2xl shadow-xl px-6 py-4 sticky top-0 z-50 border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="group flex items-center gap-3 hover:opacity-90 transition-all">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl">
                  <img src="/chu.jpeg" alt="Logo" className="w-12 h-12 rounded-xl border-2 border-white shadow-lg" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Centre de Notifications IA
                </h1>
                <p className="text-sm text-gray-600 font-semibold">un hôpital partenaire</p>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link 
              href={returnUrl}
              className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 rounded-xl font-semibold"
            >
              <span className="text-xl">←</span> Retour
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold"
            >
              Menu <span className={`transform transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {menuOpen && (
              <div className="absolute right-6 mt-3 w-64 bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-blue-100">
                <Link 
                  href={returnUrl}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 text-gray-700"
                >
                  <span className="text-xl">←</span> Retour
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
                Notifications & Alertes
              </h2>
              <p className="text-gray-600 font-semibold">
                {notificationsNonLues} notification{notificationsNonLues > 1 ? "s" : ""} non lue{notificationsNonLues > 1 ? "s" : ""}
              </p>
            </div>
            {notificationsNonLues > 0 && (
              <button
                onClick={marquerToutesLues}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                <span>✓</span> Tout marquer comme lu
              </button>
            )}
          </div>

          {/* ONGLETS */}
          <div className="flex gap-2 bg-white rounded-xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab("toutes")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "toutes" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab("alertes")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "alertes" ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Alertes ({notifications.filter(n => n.type === "alerte").length})
            </button>
            <button
              onClick={() => setActiveTab("commandes")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "commandes" ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Commandes ({notifications.filter(n => n.type === "commande").length})
            </button>
          </div>
        </div>

        {/* LISTE NOTIFICATIONS */}
        <div className="space-y-4">
          {notificationsFiltrees.length > 0 ? (
            notificationsFiltrees.map((notif) => {
              const alerte = getAlerteFromNotification(notif);
              const isOrange = notif.message.includes("🟠");
              const isRouge = notif.message.includes("🔴");
              
              return (
                <div
                  key={notif._id}
                  className={`${getCouleurNotification(notif.type)} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
                    !notif.lu ? "border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{getIconeNotification(notif.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{notif.titre}</h3>
                          {!notif.lu && (
                            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">NOUVEAU</span>
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">{notif.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(notif.createdAt).toLocaleString("fr-FR")}
                        </p>

                        {/* BOUTONS ALERTE ORANGE */}
                        {isOrange && alerte && alerte.statut === "non_lue" && (
                          <div className="mt-4 flex gap-3 flex-wrap">
                            <button
                              onClick={() => validerAlerteOrange(alerte._id)}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                            >
                              ✅ Valider la commande auto
                            </button>
                            <button
                              onClick={() => refuserAlerteOrange(alerte._id)}
                              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                            >
                              ❌ Ne pas valider
                            </button>
                          </div>
                        )}

                        {/* BOUTONS ALERTE ROUGE */}
                        {isRouge && alerte && alerte.statut === "non_lue" && (
                          <div className="mt-4 flex gap-3 flex-wrap">
                            <button
                              onClick={() => commanderMaintenant(alerte._id)}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                            >
                              📦 Commander maintenant
                            </button>
                            <button
                              onClick={() => marquerNonNecessaire(alerte._id)}
                              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md"
                            >
                              🚫 Non nécessaire
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!notif.lu && (
                        <button
                          onClick={() => marquerLue(notif._id)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          title="Marquer comme lu"
                        >
                          ✓ Lu
                        </button>
                      )}
                      <button
                        onClick={() => supprimerNotification(notif._id)}
                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="text-7xl mb-4">📭</div>
              <p className="text-xl font-semibold text-gray-600">Aucune notification</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}