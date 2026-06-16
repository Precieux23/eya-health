import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, setLogLevel 
} from 'firebase/firestore';

// Configuration Firebase et initialisation (récupérées depuis l'environnement)
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Initialiser l'application Firebase
const app = initializeApp(firebaseConfig);

// Activer le mode Debug pour les logs de Firestore (utile pour le développement)
setLogLevel('debug');

// --- Composant Principal de l'Application ---

const App = () => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Initialisation Firebase et Authentification
  useEffect(() => {
    const firestoreDb = getFirestore(app);
    const firebaseAuth = getAuth(app);
    
    setDb(firestoreDb);
    setAuth(firebaseAuth);

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Fallback for anonymous sign-in if token is missing (though Canvas usually provides one)
        signInAnonymously(firebaseAuth)
          .then((cred) => setUserId(cred.user.uid))
          .catch(error => console.error("Anonymous sign-in failed:", error));
      }
      setIsAuthReady(true);
      setLoading(false);
    });

    // Tentative de connexion avec le jeton personnalisé (si disponible)
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
    if (initialAuthToken) {
      signInWithCustomToken(firebaseAuth, initialAuthToken)
        .catch(error => console.error("Custom token sign-in failed:", error));
    } else if (!firebaseAuth.currentUser) {
      // Si aucun jeton n'est fourni et pas d'utilisateur, on tente l'anonyme
      // Le onAuthStateChanged ci-dessus gère aussi ce cas.
    }

    return () => unsubscribe();
  }, []);

  // Définition du chemin de la collection (collection privée par utilisateur)
  const getServiceCollectionRef = useCallback(() => {
    if (db && userId) {
      // Chemin: /artifacts/{appId}/users/{userId}/services
      return collection(db, `artifacts/${appId}/users/${userId}/services`);
    }
    return null;
  }, [db, userId]);

  // 2. Écoute en temps réel des services (onSnapshot)
  useEffect(() => {
    if (!isAuthReady || !db || !userId) {
      // Ne pas tenter d'interroger la base de données avant l'authentification
      return;
    }

    const servicesRef = getServiceCollectionRef();
    if (!servicesRef) return;
    
    // Ajout d'une simple requête pour garantir que la référence est bien une collection
    const q = query(servicesRef); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const serviceList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(serviceList);
      setLoading(false);
    }, (error) => {
      console.error("Erreur lors de la récupération des services: ", error);
      setMessage("Erreur lors du chargement des services. Vérifiez la console.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, userId, isAuthReady, getServiceCollectionRef]);

  // 3. Logique d'ajout d'un service
  const handleAddService = async (serviceData) => {
    if (!db || !userId) {
      setMessage("Erreur: Utilisateur non authentifié ou base de données non initialisée.");
      return;
    }
    setLoading(true);
    try {
      const servicesRef = getServiceCollectionRef();
      if (!servicesRef) throw new Error("Référence de collection non disponible.");

      await addDoc(servicesRef, {
        ...serviceData,
        createdAt: serverTimestamp(),
      });
      setMessage(`Service '${serviceData.name}' ajouté avec succès!`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du service: ", error);
      setMessage("Échec de l'ajout du service.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Logique de suppression d'un service
  const handleDeleteService = async (id) => {
    if (!db || !userId) {
      setMessage("Erreur: Utilisateur non authentifié ou base de données non initialisée.");
      return;
    }
    setLoading(true);
    try {
      const servicesRef = getServiceCollectionRef();
      if (!servicesRef) throw new Error("Référence de collection non disponible.");

      await deleteDoc(doc(servicesRef, id));
      setMessage("Service supprimé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du service: ", error);
      setMessage("Échec de la suppression du service.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Affichage de l'état
  if (loading && !isAuthReady) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-xl text-gray-600">
      Chargement de l'authentification...
    </div>;
  }
  
  if (!userId) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-xl text-red-600">
      Erreur d'authentification.
    </div>;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700">
          Gestion des Services Numériques
        </h1>
        <p className="text-gray-500 mt-2">
          Gérez votre catalogue de services en temps réel avec Firebase.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          ID Utilisateur: <span className="font-mono text-xs bg-gray-200 p-1 rounded">{userId}</span>
        </p>
      </header>

      {/* Affichage du message d'état/erreur */}
      {message && (
        <MessageBar message={message} setMessage={setMessage} />
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Formulaire d'ajout de Service */}
        <ServiceForm onAdd={handleAddService} isLoading={loading} />
        
        {/* Tableau des Services */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Liste des Services ({services.length})</h2>
          {loading ? (
            <div className="text-center py-4 text-gray-500">Chargement des données...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">
              Aucun service trouvé. Ajoutez-en un ci-dessus!
            </div>
          ) : (
            // Correction de l'erreur ici : le composant était mal fermé.
            <ServiceTable services={services} onDelete={handleDeleteService} />
          )}
        </div>
      </div>
      
    </div>
  );
};

// --- Composant d'Affichage de Message ---
const MessageBar = ({ message, setMessage }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 5000); // Le message disparaît après 5 secondes

    return () => clearTimeout(timer);
  }, [message, setMessage]);

  const bgColor = message.toLowerCase().includes('erreur') || message.toLowerCase().includes('échec') 
    ? 'bg-red-100 border-red-400 text-red-700' 
    : 'bg-green-100 border-green-400 text-green-700';

  return (
    <div className={`max-w-4xl mx-auto p-4 mb-4 border-l-4 rounded-lg shadow-md ${bgColor} transition duration-300 ease-in-out`}>
      <div className="flex justify-between items-center">
        <p className="font-medium">{message}</p>
        <button 
          onClick={() => setMessage('')} 
          className="text-lg font-bold p-1 leading-none hover:text-gray-900 transition"
          aria-label="Fermer la notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

// --- Composant Formulaire d'Ajout ---
const ServiceForm = ({ onAdd, isLoading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || isNaN(parseFloat(price))) {
      alert("Veuillez remplir tous les champs correctement."); // Utiliser une alerte simple pour les validations mineures
      return;
    }
    
    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
    };

    onAdd(serviceData);

    // Réinitialiser le formulaire
    setName('');
    setDescription('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-indigo-200">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Ajouter un Nouveau Service</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nom du Service */}
        <div className="md:col-span-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom du Service</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Conseil Stratégique"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>
        
        {/* Prix */}
        <div className="md:col-span-1">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex: 499.99"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
        </div>

        {/* Bouton d'Ajout */}
        <div className="md:col-span-1 flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-150 ${
              isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Ajout en cours...' : 'Ajouter le Service'}
          </button>
        </div>
      </div>

      {/* Description du Service */}
      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez brièvement le service..."
          rows="2"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-y"
        />
      </div>

    </form>
  );
};

// --- Composant Tableau des Services ---
const ServiceTable = ({ services, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services
            .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) // Tri par date de création (le plus récent en premier)
            .map((service) => (
              <tr key={service.id} className="hover:bg-indigo-50 transition duration-100">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell max-w-xs truncate">
                  {service.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-600 font-bold">
                  {service.price?.toFixed(2)} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button
                    onClick={() => onDelete(service.id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-100 transition duration-150"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;