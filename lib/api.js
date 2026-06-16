// /lib/api.js
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute le token si présent dans localStorage (client-side)
export const attachAuth = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("eya_token") || localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }
};

export default api;
