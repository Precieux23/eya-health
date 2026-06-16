'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut, Minus, X, Plus, Package, TrendingUp, AlertCircle } from 'lucide-react';
import api from '@/lib/axiosClient';

export default function ServiceDecomptePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id;

  const [service, setService] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [customQuantity, setCustomQuantity] = useState('');
  const [lastAction, setLastAction] = useState(null);

  // Charger les données du service et des stocks
  useEffect(() => {
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Récupérer le service
      const serviceRes = await api.get(`/services/${serviceId}`);
      console.log('🏥 Service récupéré:', serviceRes.data);
      setService(serviceRes.data);

      // Récupérer tous les stocks
      const stocksRes = await api.get('/stocks');
      console.log('📦 Tous les stocks:', stocksRes.data);
      console.log('🔍 Service ID recherché:', serviceId);
      console.log('🔍 Type de serviceId:', typeof serviceId);
      
      // Filtrer les stocks du service actuel
      const serviceStocks = stocksRes.data.filter(stock => {
        // Le champ peut être service_id OU service
        const stockServiceId = stock.service_id || stock.service;
        console.log(`Stock ${stock._id}: service_id=${stockServiceId} (type: ${typeof stockServiceId})`);
        
        // Comparaison flexible (string ou ObjectId)
        if (!stockServiceId) return false;
        return stockServiceId === serviceId || 
               stockServiceId.toString() === serviceId ||
               stockServiceId._id === serviceId ||
               stockServiceId._id?.toString() === serviceId;
      });
      
      console.log('✅ Stocks filtrés pour ce service:', serviceStocks);

      // Enrichir avec les noms des produits
      const enrichedStocks = await Promise.all(
        serviceStocks.map(async (stock) => {
          try {
            // Le champ peut être produit_id OU produit
            const produitId = stock.produit_id || stock.produit;
            console.log(`🔍 Chargement produit pour stock ${stock._id}, produitId:`, produitId);
            
            if (!produitId) {
              console.warn(`⚠️ Aucun produit_id trouvé pour le stock ${stock._id}`);
              return {
                ...stock,
                nom_produit: 'Produit sans ID',
                unite: 'unité',
              };
            }
            
            // Si produitId est un objet avec _id
            const id = typeof produitId === 'object' ? produitId._id || produitId : produitId;
            
            const produitRes = await api.get(`/produits/${id}`);
            console.log(`✅ Produit récupéré:`, produitRes.data);
            
            return {
              ...stock,
              nom_produit: produitRes.data.nom_produit,
              unite: produitRes.data.unite,
            };
          } catch (error) {
            console.error(`❌ Erreur produit ${stock.produit_id || stock.produit}:`, error.response?.data || error.message);
            return {
              ...stock,
              nom_produit: 'Produit inconnu',
              unite: 'unité',
            };
          }
        })
      );

      setStocks(enrichedStocks);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const stats = {
    totalProduits: stocks.length,
    stockTotal: stocks.reduce((sum, s) => sum + s.quantite_actuelle, 0),
    performance: stocks.length > 0
      ? Math.round(
          (stocks.reduce((sum, s) => sum + (s.quantite_actuelle / s.quantite_max) * 100, 0) / stocks.length)
        )
      : 0,
  };

  // Décrémenter stock
  const handleDecrement = async (stock, quantity = 1) => {
    if (stock.quantite_actuelle < quantity) {
      alert('Stock insuffisant !');
      return;
    }

    try {
      const newQuantity = stock.quantite_actuelle - quantity;
      
      console.log('📤 Envoi de la mise à jour:', {
        stock_id: stock._id,
        quantite_actuelle: newQuantity,
        ancienne_quantite: stock.quantite_actuelle,
        quantite_deduite: quantity
      });

      // Sauvegarder l'action pour annulation
      setLastAction({
        stockId: stock._id,
        oldQuantity: stock.quantite_actuelle,
        newQuantity: newQuantity,
        quantityDeducted: quantity,
      });

      const response = await api.put(`/stocks/${stock._id}`, {
        quantite_actuelle: newQuantity,
      });

      console.log('✅ Réponse du serveur:', response.data);

      // Mettre à jour localement
      setStocks(stocks.map(s => 
        s._id === stock._id 
          ? { ...s, quantite_actuelle: newQuantity }
          : s
      ));

      setActionModal(null);
      setCustomQuantity('');
      
      // Message de succès
      alert(`✅ Stock mis à jour : ${stock.nom_produit} - Nouvelle quantité : ${newQuantity}`);
    } catch (error) {
      console.error('❌ Erreur décrémentation complète:', error);
      console.error('❌ Détails erreur:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.error || 
                       error.message || 
                       'Erreur inconnue';
      
      alert(`Erreur lors de la mise à jour du stock: ${errorMsg}`);
    }
  };

  // Annuler la dernière action
  const handleUndo = async () => {
    if (!lastAction) {
      alert('Aucune action à annuler');
      return;
    }

    try {
      await api.put(`/stocks/${lastAction.stockId}`, {
        quantite_actuelle: lastAction.oldQuantity,
      });

      setStocks(stocks.map(s => 
        s._id === lastAction.stockId 
          ? { ...s, quantite_actuelle: lastAction.oldQuantity }
          : s
      ));

      setLastAction(null);
      alert('Action annulée avec succès');
    } catch (error) {
      console.error('Erreur annulation:', error);
      alert('Erreur lors de l\'annulation');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* HEADER */}
      <header className="w-full bg-white/70 backdrop-blur-2xl shadow-xl px-6 py-4 fixed top-0 left-0 right-0 z-50 border-b border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="group flex items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                  <img src="/chu.jpeg" alt="EYA Health Logo" className="w-12 h-12 rounded-xl border-2 border-white shadow-lg relative z-10" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                  Décompte des Stocks
                </h1>
                <p className="text-sm text-gray-600 font-semibold">
                  un hôpital partenaire
                </p>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <LogOut size={18} />
              <span className="font-semibold">Déconnexion</span>
            </button>
          </nav>

          <div className="md:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold"
            >
              <span>Menu</span>
              <span className={`transform transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                <div className="p-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-5 py-3.5 rounded-xl transition-all duration-300 font-semibold"
                  >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Bienvenue */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Bienvenue sur l'interface de décompte
            </h2>
            <p className="text-2xl font-bold text-gray-700">
              {service?.nom_service || 'Service'}
            </p>
            <p className="text-gray-600 mt-2">{service?.description}</p>
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Total Produits</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {stats.totalProduits}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Package size={32} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Stock Total</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stats.stockTotal}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={32} className="text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Performance</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stats.performance}%
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={32} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Bouton annuler si action disponible */}
          {lastAction && (
            <div className="mb-6 flex justify-center">
              <button
                onClick={handleUndo}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <X size={18} />
                Annuler la dernière action
              </button>
            </div>
          )}

          {/* Grille des produits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <div
                key={stock._id}
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {stock.nom_produit}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    stock.quantite_actuelle <= stock.quantite_min
                      ? 'bg-red-100 text-red-700'
                      : stock.quantite_actuelle >= stock.quantite_max * 0.7
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {stock.quantite_actuelle} {stock.unite}
                  </div>
                </div>

                <div className="mb-4 bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Min: {stock.quantite_min}</span>
                    <span className="text-gray-600">Max: {stock.quantite_max}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        stock.quantite_actuelle <= stock.quantite_min
                          ? 'bg-red-500'
                          : stock.quantite_actuelle >= stock.quantite_max * 0.7
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{
                        width: `${Math.min((stock.quantite_actuelle / stock.quantite_max) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecrement(stock, 1)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Minus size={18} />
                    Diminuer (-1)
                  </button>
                  <button
                    onClick={() => setActionModal(stock)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <Plus size={18} />
                    Personnalisé
                  </button>
                </div>
              </div>
            ))}
          </div>

          {stocks.length === 0 && (
            <div className="text-center py-20">
              <Package size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600 font-semibold">
                Aucun produit dans ce service
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal quantité personnalisée */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Quantité à déduire
            </h3>
            <p className="text-gray-600 mb-6">
              {actionModal.nom_produit} - Stock actuel: {actionModal.quantite_actuelle} {actionModal.unite}
            </p>
            <input
              type="number"
              min="1"
              max={actionModal.quantite_actuelle}
              value={customQuantity}
              onChange={(e) => setCustomQuantity(e.target.value)}
              placeholder="Entrez la quantité"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-6 text-lg"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal(null);
                  setCustomQuantity('');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-300"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const qty = parseInt(customQuantity);
                  if (qty > 0) {
                    handleDecrement(actionModal, qty);
                  }
                }}
                disabled={!customQuantity || parseInt(customQuantity) <= 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}