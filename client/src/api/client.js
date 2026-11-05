import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  // Render free tier can take ~60s to wake up from sleep
  timeout: 70000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("dineops_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No response at all = server unreachable / sleeping / CORS blocked
    if (!error.response) {
      error.message =
        error.code === "ECONNABORTED"
          ? "Server is taking too long to respond. It may be waking up - please try again in a minute."
          : "Cannot reach the server. Please check your internet or try again in a minute (server may be waking up).";
    }

    return Promise.reject(error);
  }
);

export default api;
