import { create } from "zustand";

export interface AuthUser {
  id: number;
  image_path: string | null;
  name: string;
  email: string;
  role: { id: number; code: string; name: string };
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (accessToken: string) => void;
  reset: () => void;
}

const tokenKey = "brindicis-stock-token";

function getStoredToken(): string {
  try {
    return localStorage.getItem(tokenKey) || "";
  } catch {
    return "";
  }
}

function setStoredToken(token: string) {
  try {
    localStorage.setItem(tokenKey, token);
  } catch {}
}

function removeStoredToken() {
  try {
    localStorage.removeItem(tokenKey);
  } catch {}
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  accessToken: getStoredToken(),
  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => {
    setStoredToken(accessToken);
    set({ accessToken });
  },
  reset: () => {
    removeStoredToken();
    set({ user: null, accessToken: "" });
  },
}));
