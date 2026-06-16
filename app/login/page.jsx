"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/axiosClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // 🔍 LOG 1 : Vérifier les données avant l'envoi
    console.log("════════════════════════════════════════");
    console.log("🚀 TENTATIVE DE CONNEXION");
    console.log("════════════════════════════════════════");
    console.log("📧 Email:", email);
    console.log("🔒 Mot de passe:", password ? "***" + password.slice(-3) : "vide");
    
    // 🔍 LOG 2 : Vérifier la configuration de l'API
    console.log("🌐 Base URL:", api.defaults.baseURL);
    console.log("📍 Endpoint:", "/users/login");
    console.log("🔗 URL complète:", (api.defaults.baseURL || "http://localhost:5000") + "/users/login");
    
    try {
      // 🔍 LOG 3 : Données envoyées au serveur
      const requestData = { 
        email, 
        mot_de_passe: password 
      };
      console.log("📤 Données envoyées:", requestData);
      console.log("⏳ Envoi de la requête...");
      
      const res = await api.post("/users/login", requestData);
      
      // 🔍 LOG 4 : Réponse reçue du serveur
      console.log("✅ Réponse reçue avec succès!");
      console.log("📥 Status:", res.status);
      console.log("📦 Données brutes:", res.data);
      console.log("🔑 Token présent?", !!res.data.token);
      console.log("👤 User présent?", !!res.data.user);
      
      const { token, user } = res.data;

      // 🔍 LOG 5 : Validation des données
      if (!token || !user) {
        console.error("❌ ERREUR: Réponse invalide");
        console.error("Token:", token);
        console.error("User:", user);
        throw new Error("Réponse serveur invalide");
      }

      console.log("✅ Token:", token.substring(0, 20) + "...");
      console.log("✅ User:", {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role
      });

      // Stockage
      console.log("💾 Stockage des données dans localStorage...");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ Données stockées avec succès");

     // Redirection selon rôle
console.log("🔄 Redirection selon le rôle:", user.role);

if (user.role === "admin") {
  console.log("➡️ Redirection vers /admin/dashboard");
  router.push("/admin/dashboard");
} 
else if (user.role === "pharmacien") {
  console.log("➡️ Redirection vers /pharmacie/dashboard");
  router.push("/pharmacie/dashboard");
} 
else if (user.role === "responsable_logistique" || user.role === "logisticien") {
  console.log("➡️ Redirection vers /dashboard");
  router.push("/dashboard");
} 
else if (user.role === "agent_sante" || user.role === "infirmier" || user.role === "medecin") {
  // Vérifier que l'utilisateur a un service_id
  const serviceId = user.service_id || user.service;
  
  if (!serviceId) {
    console.error("❌ Aucun service_id trouvé pour l'utilisateur");
    alert("Erreur : Aucun service associé à votre compte");
    return;
  }
  
  // Extraire l'ID si c'est un objet
  const id = typeof serviceId === 'object' ? (serviceId._id || serviceId) : serviceId;
  
  console.log("➡️ Redirection vers /service-decompte/" + id);
  router.push(`/service-decompte/${id}`);
} 
else {
  console.log("➡️ Redirection vers /");
  router.push("/");
}
      
      console.log("════════════════════════════════════════");
      console.log("✅ CONNEXION RÉUSSIE");
      console.log("════════════════════════════════════════");
      
    } catch (err) {
      // 🔍 LOG 6 : Gestion des erreurs détaillée
      console.log("════════════════════════════════════════");
      console.error("❌ ERREUR DE CONNEXION");
      console.log("════════════════════════════════════════");
      console.error("Type d'erreur:", err.constructor.name);
      console.error("Message:", err.message);
      
      if (err.response) {
        // Le serveur a répondu avec un code d'erreur
        console.error("📡 Le serveur a répondu:");
        console.error("  - Status:", err.response.status);
        console.error("  - Status Text:", err.response.statusText);
        console.error("  - Data:", err.response.data);
        console.error("  - Headers:", err.response.headers);
      } else if (err.request) {
        // La requête a été envoyée mais pas de réponse
        console.error("📡 Aucune réponse du serveur:");
        console.error("  - Request:", err.request);
        console.error("  - Possible cause: Serveur éteint, problème CORS, ou mauvaise URL");
      } else {
        // Erreur lors de la configuration de la requête
        console.error("⚙️ Erreur de configuration:");
        console.error("  - Message:", err.message);
      }
      
      console.error("Stack trace:", err.stack);
      console.log("════════════════════════════════════════");
      
      setError(err.response?.data?.message || err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
      console.log("🏁 Fin de la tentative de connexion");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 relative overflow-hidden">
      {/* Bulles décoratives animées */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card principal avec effet glassmorphism */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/20">
            {/* Logo et titre */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Connexion
              </h2>
              <p className="text-gray-600 text-sm">
                EYA Health
              </p>
            </motion.div>

            {/* Formulaire */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Champ Email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                  />
                </div>
              </motion.div>

              {/* Champ Mot de passe */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Message d'erreur */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </motion.div>
              )}

              {/* Bouton de connexion */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Se connecter</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Liens supplémentaires */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 space-y-3"
            >
              <div className="text-center">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  
                </a>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 text-gray-500">ou</span>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <span>←</span>
                  <span>Retour à l'accueil</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Note de sécurité */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
            <Lock className="h-3 w-3" />
            <span>Connexion sécurisée et cryptée</span>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}


