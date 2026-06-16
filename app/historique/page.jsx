"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HistoriquePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);
  const [produits, setProduits] = useState([]);
  const [produitsSelectionnes, setProduitsSelectionnes] = useState([]);
  const [typeHistorique, setTypeHistorique] = useState('complet');
  const [periode, setPeriode] = useState(30);
  const [loading, setLoading] = useState(false);
  const [donnees, setDonnees] = useState(null);
  const [vueGraphique, setVueGraphique] = useState(true);

  const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    chargerServices();
  }, []);

  const chargerServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Erreur chargement services:', err);
    }
  };

  const chargerProduits = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/produits/service/${serviceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProduits(data);
      }
    } catch (err) {
      console.error('Erreur chargement produits:', err);
    }
  };

  const selectionnerService = async (service) => {
    setServiceSelectionne(service);
    await chargerProduits(service._id);
    setDonnees(null);
  };

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        serviceId: serviceSelectionne._id,
        type: typeHistorique,
        format: 'json',
        periode: periode,
      });

      if (typeHistorique === 'detaille' && produitsSelectionnes.length > 0) {
        params.append('produits', produitsSelectionnes.join(','));
      }

      const res = await fetch(`http://localhost:5000/api/historique/donnees?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setDonnees(data);
      }
    } catch (err) {
      console.error('Erreur chargement données:', err);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const telecharger = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        serviceId: serviceSelectionne._id,
        type: typeHistorique,
        format: format,
        periode: periode,
      });

      if (typeHistorique === 'detaille' && produitsSelectionnes.length > 0) {
        params.append('produits', produitsSelectionnes.join(','));
      }

      const res = await fetch(`http://localhost:5000/api/historique/generer?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Erreur génération');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      a.download = `historique-${serviceSelectionne.nom || serviceSelectionne.nom_service}-${Date.now()}.${extension}`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert(`✅ Fichier ${format.toUpperCase()} téléchargé !`);
    } catch (err) {
      alert('❌ Erreur : ' + err.message);
    }
  };

  const preparerDonneesGraphique = (mouvements) => {
    if (!mouvements || mouvements.length === 0) return [];

    const groupes = {};
    mouvements.forEach(mouv => {
      const date = formatDate(mouv.date_mouvement || mouv.createdAt);
      if (!groupes[date]) {
        groupes[date] = { date, entrees: 0, sorties: 0 };
      }
      const type = mouv.type_mouvement || mouv.type;
      if (type === 'entree' || type === 'entrée') {
        groupes[date].entrees += mouv.quantite || 0;
      } else {
        groupes[date].sorties += mouv.quantite || 0;
      }
    });

    return Object.values(groupes).slice(-15);
  };

const preparerDonneesRepartition = (stocks) => {
    if (!stocks || stocks.length === 0) return [];

    let critiques = 0;
    let faibles = 0;
    let bientotFaibles = 0;
    let normaux = 0;

    stocks.forEach(stock => {
      const score = stock.score_risque_rupture || 0;

      if (score > 70) {
        critiques++;
      } else if (score >= 30) {
        faibles++;
      } else if (score >= 15) {
        bientotFaibles++;
      } else {
        normaux++;
      }
    });

    return [
      { name: 'Critiques', value: critiques, color: '#000000' },      // ⚫ Noir - Alerte critique
      { name: 'Faibles', value: faibles, color: '#EF4444' },          // 🔴 Rouge - Alerte rouge
      { name: 'Bientôt Faibles', value: bientotFaibles, color: '#F59E0B' }, // 🟠 Orange - Alerte orange
      { name: 'Normaux', value: normaux, color: '#10B981' }           // 🟢 Vert - Pas d'alerte
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* HEADER */}
      <header className="w-full bg-white/90 backdrop-blur-2xl shadow-xl px-6 py-4 sticky top-0 z-50 border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="group flex items-center gap-3 hover:opacity-90 transition-all">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">📊</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Historique Logistique
                </h1>
                <p className="text-sm text-gray-600 font-semibold">un hôpital partenaire</p>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <a href="/dashboard" className="flex items-center gap-1 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 rounded-xl">
              <span className="text-xl">←</span> Retour
            </a>
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
                <a href="/dashboard" className="flex items-center gap-2 px-5 py-3 hover:bg-blue-50 transition-colors text-gray-700">
                  <span>←</span> Retour
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* SECTION CONFIGURATION */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-blue-100/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Configuration de l'analyse
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service */}
            <div className="group">
              <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-lg">🏥</span> Service
              </label>
              <select
                value={serviceSelectionne?._id || ''}
                onChange={(e) => {
                  const service = services.find(s => s._id === e.target.value);
                  if (service) selectionnerService(service);
                }}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-sm hover:shadow-md bg-white"
              >
                <option value="">Sélectionner un service...</option>
                {services.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.nom || s.nom_service}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="group">
              <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span> Type de rapport
              </label>
              <select
                value={typeHistorique}
                onChange={(e) => setTypeHistorique(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-sm hover:shadow-md bg-white"
              >
                <option value="complet">📊 Vue complète</option>
                <option value="detaille">🎯 Vue détaillée par produit</option>
              </select>
            </div>

            {/* Période */}
            <div className="group">
              <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-lg">📅</span> Période d'analyse
              </label>
              <select
                value={periode}
                onChange={(e) => setPeriode(Number(e.target.value))}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all shadow-sm hover:shadow-md bg-white"
              >
                <option value={7}>📆 7 derniers jours</option>
                <option value={30}>📆 30 derniers jours</option>
                <option value={90}>📆 90 derniers jours</option>
                <option value={365}>📆 1 an</option>
              </select>
            </div>

            {/* Actions */}
            <div className="group">
              <label className=" text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="text-lg">🚀</span> Lancer l'analyse
              </label>
              <button
                onClick={chargerDonnees}
                disabled={!serviceSelectionne || loading}
                className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Chargement...
                  </span>
                ) : '🔍 Analyser'}
              </button>
            </div>
          </div>

          {/* Sélection produits pour détaillé */}
          {typeHistorique === 'detaille' && produits.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl border-2 border-blue-100">
              <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2 text-lg">
                <span className="text-2xl">📦</span>
                Produits sélectionnés ({produitsSelectionnes.length}/{produits.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                {produits.map(p => (
                  <label key={p._id} className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all group">
                    <input
                      type="checkbox"
                      checked={produitsSelectionnes.includes(p._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProduitsSelectionnes([...produitsSelectionnes, p._id]);
                        } else {
                          setProduitsSelectionnes(produitsSelectionnes.filter(id => id !== p._id));
                        }
                      }}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      {p.nom_produit}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RÉSULTATS */}
        {donnees && (
          <>
            {/* Barre d'actions */}
            <div className="flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 border-2 border-blue-100/50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVueGraphique(!vueGraphique)}
                  className="px-5 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-2xl font-bold hover:from-blue-200 hover:to-indigo-200 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="text-xl">{vueGraphique ? '📋' : '📊'}</span>
                  {vueGraphique ? 'Vue Tableau' : 'Vue Graphique'}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => telecharger('pdf')}
                  className="px-5 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-2xl font-bold hover:from-red-100 hover:to-red-200 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="text-xl">📄</span> Télécharger PDF
                </button>
                <button
                  onClick={() => telecharger('excel')}
                  className="px-5 py-3 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-2xl font-bold hover:from-green-100 hover:to-green-200 hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="text-xl">📊</span> Télécharger Excel
                </button>
              </div>
            </div>

            {/* Statistiques globales */}
            {donnees.stats && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-blue-400/20">
                  <div className="text-5xl mb-4">📦</div>
                  <div className="text-4xl font-black mb-2">{donnees.stats.totalProduits || 0}</div>
                  <div className="text-blue-100 font-semibold text-lg">Produits gérés</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-green-400/20">
                  <div className="text-5xl mb-4">➕</div>
                  <div className="text-4xl font-black mb-2">{donnees.stats.totalEntrees || 0}</div>
                  <div className="text-green-100 font-semibold text-lg">Entrées totales</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-orange-400/20">
                  <div className="text-5xl mb-4">➖</div>
                  <div className="text-4xl font-black mb-2">{donnees.stats.totalSorties || 0}</div>
                  <div className="text-orange-100 font-semibold text-lg">Sorties totales</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-red-400/20">
                  <div className="text-5xl mb-4">⚠️</div>
                  <div className="text-4xl font-black mb-2">{donnees.stats.totalAlertes || 0}</div>
                  <div className="text-red-100 font-semibold text-lg">Alertes actives</div>
                </div>
              </div>
            )}

            {/* Graphiques globaux */}
            {vueGraphique && donnees.type === 'complet' && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Graphique mouvements */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-blue-100/50 hover:shadow-3xl transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Mouvements sur la période
                    </h3>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={preparerDonneesGraphique(donnees.mouvements)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '16px', 
                          border: '2px solid #e5e7eb',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="entrees" stroke="#10B981" strokeWidth={3} name="Entrées" dot={{ fill: '#10B981', r: 5 }} />
                      <Line type="monotone" dataKey="sorties" stroke="#F59E0B" strokeWidth={3} name="Sorties" dot={{ fill: '#F59E0B', r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Graphique répartition */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Répartition des stocks (selon alertes)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={preparerDonneesRepartition(donnees.stocks)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {preparerDonneesRepartition(donnees.stocks).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Graphiques détaillés par produit */}
            {vueGraphique && donnees.type === 'detaille' && donnees.produits && (
              <div className="space-y-6">
                {donnees.produits.map((produitData, idx) => {
                  const produit = produitData.stock?.produit;
                  if (!produit) return null;

                  return (
                    <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                      <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        📦 {produit.nom_produit}
                      </h3>

                      {/* Stats produit */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{produitData.stock.quantite_actuelle || 0}</div>
                          <div className="text-sm text-gray-600">Stock actuel</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">{produitData.stats.totalEntrees}</div>
                          <div className="text-sm text-gray-600">Entrées</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-orange-600">{produitData.stats.totalSorties}</div>
                          <div className="text-sm text-gray-600">Sorties</div>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                          <div className="text-2xl font-bold text-red-600">{produitData.stats.nombreAlertes}</div>
                          <div className="text-sm text-gray-600">Alertes</div>
                        </div>
                      </div>

                      {/* Graphique mouvements du produit */}
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={preparerDonneesGraphique(produitData.mouvements)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="entrees" fill="#10B981" name="Entrées" />
                          <Bar dataKey="sorties" fill="#F59E0B" name="Sorties" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* État vide */}
        {!donnees && !loading && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-blue-100">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucune donnée</h3>
            <p className="text-gray-600">
              Sélectionnez un service et cliquez sur "Analyser" pour voir les statistiques et graphiques
            </p>
          </div>
        )}
      </div>
    </div>
  );
}