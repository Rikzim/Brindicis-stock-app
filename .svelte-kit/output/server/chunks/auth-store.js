import { w as writable, g as get } from "./index.js";
const tokenKey = "brindicis-stock-token";
function getStoredToken() {
  try {
    return localStorage.getItem(tokenKey) || "";
  } catch {
    return "";
  }
}
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    accessToken: getStoredToken()
  });
  return {
    subscribe,
    setUser(user) {
      update((s) => ({ ...s, user }));
    },
    setAccessToken(accessToken) {
      try {
        localStorage.setItem(tokenKey, accessToken);
      } catch {
      }
      update((s) => ({ ...s, accessToken }));
    },
    reset() {
      try {
        localStorage.removeItem(tokenKey);
      } catch {
      }
      set({ user: null, accessToken: "" });
    },
    getState() {
      return get({ subscribe });
    }
  };
}
const authStore = createAuthStore();
function getAuthToken() {
  return get(authStore).accessToken;
}
export {
  authStore as a,
  getAuthToken as g
};
