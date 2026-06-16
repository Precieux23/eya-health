"use client";

import { useEffect, useState } from "react";
import HistoriqueModal from '../../components/HistoriqueModal'; // Ajustez le chemin
import Link from 'next/link';

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historiqueModalOpen, setHistoriqueModalOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [services, setServices] = useState([]);


  const [stats, setStats] = useState({
    services: 0,
    produits: 0,
    alertes: 0,
    commandes: 0
  });
  const [loading, setLoading] = useState(true);
  const [erreurs, setErreurs] = useState([]);

  const actions = [
    { label: "Ajouter Produit", icon: "➕", href: "/admin/produits/create", color: "from-blue-500 to-blue-600" },
    { label: "Ajouter Service", icon: "🏥", href: "/admin1/services/create", color: "from-green-500 to-green-600" },
    { label: "Ajouter un Utilisateur", icon: "👥", href: "/admin5/utilisateurs/create", color: "from-green-500 to-green-600" },
    { label: "Ajouter Fournisseur", icon: "📦", href: "/admin2/fournisseurs/create", color: "from-purple-500 to-purple-600" },
    { label: "Lier Produit et Fournisseur", icon: "🤝", href: "/admin3/relation/create", color: "from-teal-500 to-teal-600" },
    { label: "Initialiser Stock", icon: "📊", href: "/admin4/stock/create", color: "from-orange-500 to-orange-600" },
     { 
    label: "Télécharger Historique", 
    icon: "📥", 
    onClick: () => setHistoriqueModalOpen(true), // ← Au lieu de href
    color: "from-teal-500 to-teal-600" 
  },
  ];

  // 🔥 Fonction pour charger toutes les données avec gestion d'erreurs détaillée
  const chargerDonneesDashboard = async () => {
    const erreursTemp = [];
    
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      // 1️⃣ Charger tous les services
      let servicesData = [];
      try {
        console.log("🔍 Chargement des services...");
        const resServices = await fetch('http://localhost:5000/api/services', { headers });
        console.log("📊 Status services:", resServices.status);
        
        if (resServices.ok) {
          servicesData = await resServices.json();
          console.log("✅ Services chargés:", servicesData);
        } else {
          const errorText = await resServices.text();
          console.error("❌ Erreur services:", errorText);
          erreursTemp.push(`Services: ${resServices.status}`);
        }
      } catch (err) {
        console.error("❌ Erreur fetch services:", err);
        erreursTemp.push(`Services: ${err.message}`);
      }

      // 2️⃣ Charger tous les produits
      let produitsData = [];
      try {
        console.log("🔍 Chargement des produits...");
        const resProduits = await fetch('http://localhost:5000/api/produits', { headers });
        console.log("📊 Status produits:", resProduits.status);
        
        if (resProduits.ok) {
          produitsData = await resProduits.json();
          console.log("✅ Produits chargés:", produitsData.length);
        } else {
          erreursTemp.push(`Produits: ${resProduits.status}`);
        }
      } catch (err) {
        console.error("❌ Erreur fetch produits:", err);
        erreursTemp.push(`Produits: ${err.message}`);
      }

      // 3️⃣ Charger toutes les alertes
      let alertesData = [];
      try {
        console.log("🔍 Chargement des alertes...");
        const resAlertes = await fetch('http://localhost:5000/api/alertes', { headers });
        console.log("📊 Status alertes:", resAlertes.status);
        
        if (resAlertes.ok) {
          alertesData = await resAlertes.json();
          console.log("✅ Alertes chargées:", alertesData);
        } else {
          erreursTemp.push(`Alertes: ${resAlertes.status}`);
        }
      } catch (err) {
        console.error("❌ Erreur fetch alertes:", err);
        erreursTemp.push(`Alertes: ${err.message}`);
      }

      // 4️⃣ Charger toutes les commandes
      let commandesData = [];
      try {
        console.log("🔍 Chargement des commandes...");
        const resCommandes = await fetch('http://localhost:5000/api/commandes', { headers });
        console.log("📊 Status commandes:", resCommandes.status);
        
        if (resCommandes.ok) {
          commandesData = await resCommandes.json();
          console.log("✅ Commandes chargées:", commandesData.length);
        } else {
          erreursTemp.push(`Commandes: ${resCommandes.status}`);
        }
      } catch (err) {
        console.error("❌ Erreur fetch commandes:", err);
        erreursTemp.push(`Commandes: ${err.message}`);
      }

      // 5️⃣ Calculer le nombre d'alertes par service
      const alertesParService = {};
      alertesData.forEach(alerte => {
        // Essayer différentes structures possibles
        const serviceId = alerte.service?._id || alerte.service || alerte.serviceId;
        console.log("🔍 Alerte:", alerte, "ServiceId extrait:", serviceId);
        
        if (serviceId) {
          alertesParService[serviceId] = (alertesParService[serviceId] || 0) + 1;
        }
      });
      console.log("📊 Alertes par service:", alertesParService);

      const servicesAvecAlertes = servicesData.map(service => {
  return {
    id: service._id,
    href: `/services/${service._id}`,
    name: service.nom_service || service.nom || "Service sans nom",

    // 👉 charge l'image venant du backend
    image: service.image
      ? `http://localhost:5000/uploads/${service.image}`
      : "/services/default.jpg",

    alerts: alertesParService[service._id] || 0,

    // 👉 couleur par défaut (tu peux ajouter dans la DB si nécessaire)
    color: "from-blue-500 to-blue-600",

    description: service.description || ""
  };
});

      // 7️⃣ Mettre à jour les états
      setServices(servicesAvecAlertes);
      setStats({
        services: servicesData.length,
        produits: produitsData.length,
        alertes: alertesData.length,
        commandes: commandesData.length
      });

      // 8️⃣ Charger les notifications non lues
      try {
        const resNotifs = await fetch('http://localhost:5000/api/notifications', { headers });
        if (resNotifs.ok) {
          const notifs = await resNotifs.json();
          const nonLues = notifs.filter(n => !n.lu).length;
          setNotificationsCount(nonLues);
        }
      } catch (err) {
        console.warn("Notifications non chargées:", err);
      }

      setErreurs(erreursTemp);

    } catch (error) {
      console.error("❌ Erreur globale chargement dashboard:", error);
      setErreurs([...erreursTemp, `Erreur globale: ${error.message}`]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Charger les données au montage
  useEffect(() => {
    chargerDonneesDashboard();

    const interval = setInterval(chargerDonneesDashboard, 120000);
    return () => clearInterval(interval);
  }, []);

  // 📊 Stats affichées
  const statsDisplay = [
    { label: "Services", value: stats.services, icon: "📈", color: "from-blue-500 to-blue-600" },
    { label: "Produits actifs", value: stats.produits, icon: "📦", color: "from-green-500 to-green-600" },
    { label: stats.alertes > 1 ? "Alertes" : "Alerte", value: stats.alertes, icon: "⚠️", color: "from-red-500 to-red-600" },
    { label: "Commandes", value: stats.commandes, icon: "🚚", color: "from-purple-500 to-purple-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* HEADER */}
      <header className="w-full bg-white/80 backdrop-blur-xl shadow-lg px-6 py-4 sticky top-0 z-50 border-b border-gray-100">
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
                  EYA Health
                </h1>
                <p className="text-sm text-gray-600 font-semibold">un hôpital partenaire</p>
              </div>
            </a>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/notifications"
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
            <a href="/historique" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              <span className="text-xl">📜</span>
              <span>Historique</span>
            </a>
            <a href="/configuration" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              <span className="text-xl">⚙️</span>
              <span>Configuration</span>
            </a>
            <a href="/" className="flex items-center gap-1 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
              <span className="text-xl">🏠</span> Page d'accueil
            </a>
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
            >
              Menu <span className={`transform transition-transform ${menuOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                <a href="/" className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                  <span className="text-xl">🏠</span> Page d'accueil
                </a>
                <a href="/notifications" className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                  <span className="text-xl">🔔</span> Notifications
                </a>
                <a href="/historique" className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                  <span className="text-xl">📜</span> Historique
                </a>
                <a href="/configuration" className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600">
                  <span className="text-xl">⚙️</span> Configuration
                </a>
                <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 border-t border-gray-100">
                  <span className="text-xl">👤</span> Profil
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 🚨 AFFICHAGE DES ERREURS DE DEBUG */}
        {erreurs.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-bold text-yellow-800 mb-2">⚠️ Erreurs de chargement détectées :</h4>
            <ul className="list-disc list-inside text-sm text-yellow-700">
              {erreurs.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
            <p className="text-xs text-yellow-600 mt-2">
              Vérifiez la console pour plus de détails (F12)
            </p>
          </div>
        )}

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-95"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🏥
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Tableau de bord logistique
              </h2>
            </div>

            <p className="text-blue-100 leading-relaxed mb-8 text-lg">
              Supervisez en temps réel l'état des stocks, anticipez les ruptures et optimisez l'approvisionnement pour garantir la disponibilité permanente des produits essentiels.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: "📊", title: "Supervision globale", desc: "Ruptures, commandes et stocks critiques" },
                { icon: "🎯", title: "Gestion centralisée", desc: "Produits et fournisseurs regroupés" },
                { icon: "⚡", title: "Actions rapides", desc: "Modifications en quelques clics" }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-blue-100">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS DYNAMIQUES */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statsDisplay.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h2 className="text-4xl font-bold text-white mb-1">{item.value}</h2>
                <p className="text-sm text-white/90 font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ACTIONS RAPIDES */}
        <section className="mb-12">
  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
    <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
    Actions rapides
  </h3>
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {actions.map((action, i) => (
      action.onClick ? (
        // 👉 Si l'action a un onClick, on utilise un <button>
        <button
          key={i}
          onClick={action.onClick}
          className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
          <div className="relative flex flex-col items-center text-center gap-3">
            <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform text-2xl`}>
              {action.icon}
            </div>
            <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
          </div>
        </button>
      ) : (
        // 👉 Si l'action a un href, on utilise un <a>
        <a
          key={i}
          href={action.href}
          className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
          <div className="relative flex flex-col items-center text-center gap-3">
            <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform text-2xl`}>
              {action.icon}
            </div>
            <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
          </div>
        </a>
      )
    ))}
  </div>
</section>

        {/* SERVICES DYNAMIQUES */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
            Services hospitaliers ({services.length})
          </h3>

          {services.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-md">
              <div className="text-6xl mb-4">🏥</div>
              <p className="text-gray-500 text-lg font-medium">Aucun service disponible</p>
              <p className="text-gray-400 text-sm mt-2">Vérifiez les logs de la console (F12)</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="group relative bg-white shadow-lg rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Service";
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
                      
                      {service.alerts > 0 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 animate-pulse">
                          <span>⚠️</span>
                          {service.alerts} {service.alerts > 1 ? 'alertes' : 'alerte'}
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                        {service.name}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-500 group-hover:text-blue-600 transition-colors">
                        <span className="text-sm font-medium">Voir les détails</span>
                        <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                    </div>

                    <div className={`h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

<HistoriqueModal 
  isOpen={historiqueModalOpen} 
  onClose={() => setHistoriqueModalOpen(false)} 
/>

    </main>
  );
}