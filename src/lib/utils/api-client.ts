import axios from "axios";
import { Routes } from "./routes";
import { authStore, getAuthToken } from "@/lib/state/auth-store";
import { navigateTo } from "@/lib/utils/navigate";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? "";
      if (!url.includes("/auth/login")) {
        authStore.reset();
        navigateTo("/sign-in");
      }
    }
    return Promise.reject(error);
  }
);

export { Routes };
