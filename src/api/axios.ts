import axios from "axios";

const STORAGE_TOKEN = "token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN);
  if (token) {
    config.headers.set("token", token);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem("user");
      if (window.location.pathname !== "/auth/login") {
        window.location.assign("/auth/login");
      }
    }
    return Promise.reject(error);
  },
);