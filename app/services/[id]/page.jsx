"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ServicePage({ params }) {
  const [id, setId] = useState(null);
  const [service, setService] = useState(null);
  const [produits, setProduits] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [recalcMessage, setRecalcMessage] = useState(null);

  // Déballer params (Next.js 15+)
  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  // Charger les données
  const chargerDonnees = async () => {
    if (!id) return;
    try {
      const resTableau = await axios.get(`http://localhost:5000/api/services/${id}/tableau`);
      setProduits(resTableau.data);

      const resService = await axios.get(`http://localhost:5000/api/services/${id}`);
      setService(resService.data);

      // Charger les alertes du service
      try {
        const resAlertes = await axios.get(`http://localhost:5000/api/alertes/service/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAlertes(resAlertes.data || []);
      } catch (err) {
        console.warn("Alertes non chargées:", err);
        setAlertes([]);
      }

      // Charger le nombre de notifications non lues
      try {
        const resNotifs = await axios.get(`http://localhost:5000/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const nonLues = resNotifs.data.filter(n => !n.lu).length;
        setNotificationsCount(nonLues);
      } catch (err) {
        console.warn("Notifications non chargées:", err);
        setNotificationsCount(0);
      }
      
      setErreur(null);
    } catch (error) {
      console.error("Erreur chargement:", error);
      setErreur(
        error.response?.data?.message || 
        error.message || 
        "Impossible de charger les données du service"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();

    // Recharger toutes les 2 minutes pour avoir les dernières alertes
    const interval = setInterval(chargerDonnees, 120000);
    return () => clearInterval(interval);
  }, [id]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    setRecalcMessage(null);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/stocks/recalculer', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecalcMessage({ text: "✅ Recalcul terminé avec succès", type: "success" });
      await chargerDonnees();
    } catch (error) {
      console.error("Erreur recalcul:", error);
      setRecalcMessage({ text: "❌ Erreur lors du recalcul", type: "error" });
    } finally {
      setRecalculating(false);
      setTimeout(() => setRecalcMessage(null), 3000);
    }
  };

  // Récupérer l'alerte d'un produit
  const getAlerteForProduit = (produit) => {
    // Chercher une alerte active pour ce produit
    return alertes.find(alerte => {
      const stockProduit = alerte.stock?.produit;
      if (!stockProduit) return false;
      
      // Comparer par ID ou par nom
      return (
        stockProduit._id === produit._id ||
        stockProduit.nom_produit === produit.produit ||
        alerte.stock.produit === produit._id
      );
    });
  };

  // Boule colorée selon le type d'alerte
  const getBouleCouleur = (produit) => {
    const alerte = getAlerteForProduit(produit);
    
    if (!alerte || alerte.statut === "traitee") {
      return null; // Pas de boule si pas d'alerte ou alerte traitée
    }

    switch (alerte.type_alerte) {
      case "critique":
        return (
          <div className="relative group">
            <span className="inline-block w-5 h-5 bg-black rounded-full animate-pulse shadow-lg cursor-help"></span>
            <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 -top-8 left-0 whitespace-nowrap z-10">
              Alerte Critique
            </div>
          </div>
        );
      case "rouge":
        return (
          <div className="relative group">
            <span className="inline-block w-5 h-5 bg-red-500 rounded-full animate-pulse shadow-lg cursor-help"></span>
            <div className="absolute hidden group-hover:block bg-red-500 text-white text-xs rounded py-1 px-2 -top-8 left-0 whitespace-nowrap z-10">
              Alerte Rouge
            </div>
          </div>
        );
      case "orange":
        return (
          <div className="relative group">
            <span className="inline-block w-5 h-5 bg-orange-500 rounded-full animate-pulse shadow-lg cursor-help"></span>
            <div className="absolute hidden group-hover:block bg-orange-500 text-white text-xs rounded py-1 px-2 -top-8 left-0 whitespace-nowrap z-10">
              Alerte Orange
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Couleurs selon le statut d'alerte
  const getStatusColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case "critique":
      case "rupture":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg";
      case "attention":
      case "faible":
        return "bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-md";
      case "normal":
      case "ok":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white font-semibold shadow-md";
      case "aucune":
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 shadow-sm";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  // Badge de statut stylé
  const StatutBadge = ({ statut }) => (
    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide ${getStatusColor(statut)} transform hover:scale-105 transition-all`}>
      {statut === "aucune" ? "✓ Normal" : `⚠ ${statut}`}
    </span>
  );

  // Icône selon le statut
  const getStatutIcon = (statut) => {
    switch (statut?.toLowerCase()) {
      case "critique":
      case "rupture":
        return "🚨";
      case "attention":
      case "faible":
        return "⚠️";
      case "normal":
      case "ok":
        return "✅";
      default:
        return "📦";
    }
  };

  // États de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🏥</span>
            </div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Chargement du service...</p>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md p-10 bg-white rounded-3xl shadow-2xl text-center transform hover:scale-105 transition-transform">
          <div className="text-7xl mb-6 animate-bounce">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur de chargement</h2>
          <p className="text-red-600 mb-6 leading-relaxed">{erreur}</p>
          <a 
            href="/dashboard" 
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            ← Retour au Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="text-7xl mb-4">🔍</div>
          <p className="text-gray-700 text-xl mb-6 font-semibold">Service introuvable</p>
          <a href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold text-lg hover:underline">
            ← Retour au Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Affichage principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* HEADER MODERNE */}
      <header className="w-full bg-white/90 backdrop-blur-2xl shadow-xl px-6 py-4 sticky top-0 z-50 border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center gap-4">
            <a href="/" className="group flex items-center gap-3 hover:opacity-90 transition-all">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all group-hover:scale-110 group-hover:rotate-3">
                  <img
                    src="/chu.jpeg"
                    alt="EYA Health Logo"
                    className="w-12 h-12 rounded-xl border-2 border-white shadow-lg"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  EYA Health IA
                </h1>
                <p className="text-sm text-gray-600 font-semibold">un hôpital partenaire</p>
              </div>
            </a>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-4">
             <Link 
    href={`/notifications?from=/services/${id}`} 
    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-xl font-medium transition-all hover:shadow-md relative"
  >
    <span className="text-xl">🔔</span>
    <span>Notifications</span>
    {notificationsCount > 0 && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
        {notificationsCount}
      </span>
    )}
  </Link>
            <a href="/historique" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-xl font-medium transition-all hover:shadow-md">
              <span className="text-xl">📜</span>
              <span>Historique</span>
            </a>
            <a href="/configuration" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-xl font-medium transition-all hover:shadow-md">
              <span className="text-xl">⚙️</span>
              <span>Configuration</span>
            </a>
            <a href="/dashboard" className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
              <span className="text-xl">🏠</span> Retour
            </a>
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:shadow-xl transition-all font-semibold"
            >
              Menu <span className={`transform transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-blue-100 animate-fadeIn">
                <a href="/dashboard" className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                  <span className="text-xl">🏠</span> Retour
                </a>
                <Link 
      href={`/notifications?from=/services/${id}`}
      className="flex items-center gap-3 px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all text-gray-700 hover:text-blue-600 font-medium"
    >
      <span className="text-2xl">🔔</span> 
      <span>Notifications</span>
      {notificationsCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">{notificationsCount}</span>
      )}
    </Link>
                <a href="/historique" className="flex items-center gap-3 px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all text-gray-700 hover:text-blue-600 font-medium">
                  <span className="text-2xl">📜</span> 
                  <span>Historique</span>
                </a>
                <a href="/configuration" className="flex items-center gap-3 px-5 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all text-gray-700 hover:text-blue-600 font-medium border-t border-gray-100">
                  <span className="text-2xl">⚙️</span> 
                  <span>Configuration</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TITRE DU SERVICE */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
            {service.nom_service || "Service"}
          </h2>
        </div>

        {/* STATISTIQUES RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">📦</span>
              <div className="text-gray-500 text-sm font-semibold">Total produits</div>
            </div>
            <div className="text-4xl font-black text-blue-900">{produits.length}</div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">🚨</span>
              <div className="text-gray-500 text-sm font-semibold">Alertes critiques</div>
            </div>
            <div className="text-4xl font-black text-red-600">
              {alertes.filter(a => a.type_alerte === "critique" && a.statut !== "traitee").length}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">⚠️</span>
              <div className="text-gray-500 text-sm font-semibold">Alertes actives</div>
            </div>
            <div className="text-4xl font-black text-orange-600">
              {alertes.filter(a => (a.type_alerte === "orange" || a.type_alerte === "rouge") && a.statut !== "traitee").length}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">✅</span>
              <div className="text-gray-500 text-sm font-semibold">Stock normal</div>
            </div>
            <div className="text-4xl font-black text-green-600">
              {produits.length - alertes.filter(a => a.statut !== "traitee").length}
            </div>
          </div>
        </div>

        {/* PRÉSENTATION SERVICE */}
        {service.description && (
          <section className="bg-white shadow-2xl rounded-2xl p-8 mb-10 border-t-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📋</span>
              <h2 className="text-2xl font-bold text-blue-900">Présentation du service</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>
          </section>
        )}

        {/* TABLEAU DES PRODUITS */}
        <section className="bg-white shadow-2xl rounded-2xl overflow-hidden border-t-4 border-indigo-500">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <h2 className="text-2xl font-bold text-white">
                Tableau de bord — Surveillance IA des Stocks
              </h2>
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex flex-col items-end gap-2 border-b">
            <button
              onClick={handleRecalculate}
              disabled={recalculating}
              className={`px-6 py-2 rounded-xl font-bold transition-all shadow-md ${
                recalculating 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {recalculating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Recalcul en cours...
                </span>
              ) : (
                "🔄 Recalculer maintenant"
              )}
            </button>
            {recalcMessage && (
              <p className={`text-sm font-semibold animate-pulse ${
                recalcMessage.type === "success" ? "text-green-600" : "text-red-600"
              }`}>
                {recalcMessage.text}
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Alerte IA</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Produit</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Quantité actuelle</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Seuil minimum</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Conso. moyenne</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date rupture probable</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Score de risque IA</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Qté recommandée</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {produits.length > 0 ? (
                  produits.map((produit, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all"
                    >
                      <td className="px-6 py-5">
                        {getBouleCouleur(produit)}
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">{getStatutIcon(produit.statut_alerte)}</span>
                        {produit.produit}
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-xl text-blue-900">{produit.quantite_actuelle}</span>
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-semibold">
                        {produit.seuil_min}
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-semibold">
                        {produit.consommation_moyenne.toFixed(2)}/j
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-semibold">
                        {produit.date_probable_rupture}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold ${
                          produit.score_risque < 30 
                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white" 
                            : produit.score_risque <= 70 
                              ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white" 
                              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                        }`}>
                          {produit.score_risque}%
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-700 font-semibold">
                        {produit.commande_recommandee || "—"}
                      </td>
                      <td className="px-6 py-5">
                        <StatutBadge statut={produit.statut_alerte} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-16 text-center text-gray-500">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-xl font-semibold">Aucun produit en stock pour ce service</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* LÉGENDE DES ALERTES IA */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="font-bold text-gray-800 text-lg">Système d'Alertes Intelligentes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-md">
                <span className="inline-block w-5 h-5 bg-orange-500 rounded-full flex-shrink-0 mt-1"></span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">🟠 Alerte Orange</p>
                  <p className="text-sm text-gray-600">L'IA demande validation pour commande automatique future</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-md">
                <span className="inline-block w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-1"></span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">🔴 Alerte Rouge</p>
                  <p className="text-sm text-gray-600">Stock urgent - Commande auto si orange validée</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-md">
                <span className="inline-block w-5 h-5 bg-black rounded-full flex-shrink-0 mt-1"></span>
                <div>
                  <p className="font-bold text-gray-800 mb-1">⚫ Alerte Critique</p>
                  <p className="text-sm text-gray-600">L'IA passe la commande automatiquement</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}