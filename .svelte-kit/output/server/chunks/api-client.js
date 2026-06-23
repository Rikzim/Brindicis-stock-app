import axios from "axios";
import "clsx";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils2.js";
import "@sveltejs/kit/internal/server";
import "./root.js";
import "./state.svelte.js";
import { g as getAuthToken, a as authStore } from "./auth-store.js";
const API_URL = "http://localhost:3000";
const apiClient = axios.create({
  baseURL: API_URL
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
      }
    }
    return Promise.reject(error);
  }
);
export {
  apiClient as a
};
