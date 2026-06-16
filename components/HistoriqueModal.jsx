import { useState, useEffect } from 'react';

export default function HistoriqueModal({ isOpen, onClose }) {
  const [etape, setEtape] = useState(1);
  const [services, setServices] = useState([]);
  const [serviceSelectionne, setServiceSelectionne] = useState(null);
  const [produits, setProduits] = useState([]);
  const [produitsSelectionnes, setProduitsSelectionnes] = useState([]);
  const [typeHistorique, setTypeHistorique] = useState('complet');
  const [format, setFormat] = useState('pdf');
  const [periode, setPeriode] = useState(30);
  const [loading, setLoading] = useState(false);

  // Charger les services
  useEffect(() => {
    if (isOpen) {
      chargerServices();
    }
  }, [isOpen]);

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

  // Charger les produits du service sélectionné
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

  // Sélectionner un service
  const selectionnerService = async (service) => {
    setServiceSelectionne(service);
    await chargerProduits(service._id);
    setEtape(2);
  };

  // Générer l'historique
  const genererHistorique = async () => {
    setLoading(true);
    try {
      const token =
        JSON.parse(localStorage.getItem("userInfo"))?.token ||
        localStorage.getItem("token") ||
        "";

      if (!token) {
        alert("❌ Aucun token trouvé. Reconnectez-vous !");
        return;
      }

      const params = new URLSearchParams({
        serviceId: serviceSelectionne._id,
        type: typeHistorique,
        format: format,
        periode: periode,
      });

      if (typeHistorique === "detaille" && produitsSelectionnes.length > 0) {
        params.append("produits", produitsSelectionnes.join(","));
      }

      console.log('📤 Requête:', `http://localhost:5000/api/historique/generer?${params}`);

      const res = await fetch(
        `http://localhost:5000/api/historique/generer?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erreur backend :", errorText);
        alert("❌ Erreur backend : " + errorText);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (
        !contentType.includes("pdf") &&
        !contentType.includes("spreadsheet") &&
        !contentType.includes("excel")
      ) {
        const text = await res.text();
        console.error("❌ Réponse non-fichier :", text);
        alert("❌ Le serveur n'a pas renvoyé un fichier : " + text);
        return;
      }

      // Télécharger le fichier avec la BONNE EXTENSION
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      // ✅ CORRECTION ICI - Utiliser .xlsx pour Excel
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      const nomFichier = `historique-${
        serviceSelectionne.nom || serviceSelectionne.nom_service
      }-${Date.now()}.${extension}`;
      
      a.download = nomFichier;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log(`✅ Fichier téléchargé : ${nomFichier}`);
      alert("✅ Historique téléchargé avec succès !");
      onClose();
      reinitialiser();
    } catch (err) {
      console.error("Erreur génération:", err);
      alert("❌ Erreur lors de la génération : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const reinitialiser = () => {
    setEtape(1);
    setServiceSelectionne(null);
    setProduits([]);
    setProduitsSelectionnes([]);
    setTypeHistorique('complet');
    setFormat('pdf');
    setPeriode(30);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                📥
              </div>
              <div>
                <h2 className="text-2xl font-bold">Télécharger l'Historique</h2>
                <p className="text-blue-100 text-sm">
                  {etape === 1 && 'Sélectionnez un service'}
                  {etape === 2 && 'Choisissez le type d\'historique'}
                  {etape === 3 && 'Configuration finale'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { onClose(); reinitialiser(); }}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>

          {/* Indicateur d'étapes */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className={`w-full h-2 rounded-full ${etape >= num ? 'bg-white' : 'bg-white/30'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* ÉTAPE 1 : Sélection du service */}
          {etape === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Sélectionnez un service</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <button
                    key={service._id}
                    onClick={() => selectionnerService(service)}
                    className="group relative bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                        🏥
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {service.nom || service.nom_service}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {service.description || 'Service hospitalier'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                      <span>Sélectionner</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Type d'historique */}
          {etape === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="font-semibold text-blue-800">
                  Service sélectionné : {serviceSelectionne?.nom || serviceSelectionne?.nom_service}
                </p>
              </div>

              <h3 className="text-xl font-bold text-gray-800">Choisissez le type d'historique</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => { setTypeHistorique('complet'); setEtape(3); }}
                  className={`group relative border-2 rounded-2xl p-6 text-left transition-all ${
                    typeHistorique === 'complet'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                    📊
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Historique Complet</h4>
                  <p className="text-sm text-gray-600">
                    Tous les produits du service avec statistiques globales, alertes et commandes
                  </p>
                  <div className="mt-4 flex items-center text-green-600 font-medium text-sm">
                    Recommandé <span className="ml-2">→</span>
                  </div>
                </button>

                <button
                  onClick={() => setTypeHistorique('detaille')}
                  className={`group relative border-2 rounded-2xl p-6 text-left transition-all ${
                    typeHistorique === 'detaille'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                    🎯
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Historique Détaillé</h4>
                  <p className="text-sm text-gray-600">
                    Sélectionnez des produits spécifiques pour un rapport détaillé
                  </p>
                  <div className="mt-4 flex items-center text-purple-600 font-medium text-sm">
                    Plus précis <span className="ml-2">→</span>
                  </div>
                </button>
              </div>

              {typeHistorique === 'detaille' && (
                <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                  <h4 className="font-bold text-gray-800 mb-4">
                    Sélectionnez les produits ({produitsSelectionnes.length})
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {produits.map((produit) => (
                      <label
                        key={produit._id}
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={produitsSelectionnes.includes(produit._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProduitsSelectionnes([...produitsSelectionnes, produit._id]);
                            } else {
                              setProduitsSelectionnes(produitsSelectionnes.filter(id => id !== produit._id));
                            }
                          }}
                          className="w-5 h-5 text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {produit.nom_produit}
                          </p>
                          <p className="text-xs text-gray-500">
                            {produit.categorie} • {produit.unite}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setEtape(3)}
                    disabled={produitsSelectionnes.length === 0}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    Continuer ({produitsSelectionnes.length} produit(s))
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 3 : Configuration finale */}
          {etape === 3 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="font-semibold text-blue-800">
                  {serviceSelectionne?.nom || serviceSelectionne?.nom_service} - 
                  {typeHistorique === 'complet' ? ' Historique complet' : ` ${produitsSelectionnes.length} produit(s)`}
                </p>
              </div>

              <h3 className="text-xl font-bold text-gray-800">Configuration de l'historique</h3>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Format du fichier</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      format === 'pdf' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <span className="text-3xl">📄</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">PDF</p>
                      <p className="text-xs text-gray-500">Document formaté</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setFormat('excel')}
                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${
                      format === 'excel' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <span className="text-3xl">📊</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">Excel</p>
                      <p className="text-xs text-gray-500">Données exploitables (.xlsx)</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Période */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Période</label>
                <div className="grid grid-cols-4 gap-3">
                  {[7, 30, 90, 365].map((jours) => (
                    <button
                      key={jours}
                      onClick={() => setPeriode(jours)}
                      className={`py-3 px-4 border-2 rounded-xl font-semibold transition-all ${
                        periode === jours
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      {jours} jours
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-3xl flex items-center justify-between">
          <button
            onClick={() => {
              if (etape > 1) setEtape(etape - 1);
              else { onClose(); reinitialiser(); }
            }}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
          >
            ← {etape === 1 ? 'Annuler' : 'Retour'}
          </button>

          {etape === 3 && (
            <button
              onClick={genererHistorique}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <span>📥</span>
                  Télécharger l'historique
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}