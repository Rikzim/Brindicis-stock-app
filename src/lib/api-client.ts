import axios from "axios";
import { useAuthStore } from "@/stores/auth-store";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      useAuthStore.getState().reset();
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  },
);
