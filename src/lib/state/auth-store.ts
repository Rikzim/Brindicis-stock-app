import { writable, get } from "svelte/store";

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
  permissions?: string[];
}

const tokenKey = "brindicis-stock-token";

function getStoredToken(): string {
  try {
    return localStorage.getItem(tokenKey) || "";
  } catch {
    return "";
  }
}

function createAuthStore() {
  const { subscribe, set, update } = writable<{
    user: AuthUser | null;
    accessToken: string;
  }>({
    user: null,
    accessToken: getStoredToken(),
  });

  return {
    subscribe,
    setUser(user: AuthUser | null) {
      update((s) => ({ ...s, user }));
    },
    setAccessToken(accessToken: string) {
      try {
        localStorage.setItem(tokenKey, accessToken);
      } catch {}
      update((s) => ({ ...s, accessToken }));
    },
    reset() {
      try {
        localStorage.removeItem(tokenKey);
      } catch {}
      set({ user: null, accessToken: "" });
    },
    getState() {
      return get({ subscribe });
    },
  };
}

export const authStore = createAuthStore();

// Convenience getters for use in non-reactive contexts
export function getAuthToken(): string {
  return get(authStore).accessToken;
}

export function getAuthUser(): AuthUser | null {
  return get(authStore).user;
}
