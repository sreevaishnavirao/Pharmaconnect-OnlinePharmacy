
import axios from "axios";


const RAW_BACKEND = import.meta.env.VITE_BACK_END_URL || "http://localhost:8080";
const BASE_URL = RAW_BACKEND.replace(/\/+$/, "");
const API_BASE_URL = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;
const extractJwtToken = (value) => {
  if (!value) return "";
  const s = String(value);
  const m = s.match(/onlinepharmacy=([^;]+)/i);
  if (m?.[1]) return m[1].trim();

  
  if (s.split(".").length === 3 && !s.includes(";")) return s.trim();

  
  return s.split(";")[0].trim();
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return config;

      const auth = JSON.parse(raw);

      const token = extractJwtToken(
        auth?.token || auth?.accessToken || auth?.jwt || auth?.jwtToken
      );

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_) {}

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthCall = url.includes("/auth/signin") || url.includes("/auth/signup");

    if (status === 401 && !isAuthCall) {
      
      localStorage.removeItem("auth");
    }
return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL, API_BASE_URL as API_ROOT };
