import { create } from "zustand";

interface SettingsState {
  theme: "light" | "dark";
  panelPosition: "left" | "right";
  setTheme: (theme: "light" | "dark") => void;
  setPanelPosition: (panelPosition: "left" | "right") => void;
  toggleTheme: () => void;
  togglePanelPosition: () => void;
}

const getStoredTheme = (): "light" | "dark" => {
  try {
    return (localStorage.getItem("brindicis-theme") as "light" | "dark") || "light";
  } catch {
    return "light";
  }
};

const getStoredPanelPosition = (): "left" | "right" => {
  try {
    return (localStorage.getItem("brindicis-panel-position") as "left" | "right") || "right";
  } catch {
    return "right";
  }
};

export const useSettingsStore = create<SettingsState>()((set) => ({
  theme: getStoredTheme(),
  panelPosition: getStoredPanelPosition(),
  setTheme: (theme) => {
    try {
      localStorage.setItem("brindicis-theme", theme);
    } catch {}
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },
  setPanelPosition: (panelPosition) => {
    try {
      localStorage.setItem("brindicis-panel-position", panelPosition);
    } catch {}
    set({ panelPosition });
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      try {
        localStorage.setItem("brindicis-theme", newTheme);
      } catch {}
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { theme: newTheme };
    });
  },
  togglePanelPosition: () => {
    set((state) => {
      const newPosition = state.panelPosition === "right" ? "left" : "right";
      try {
        localStorage.setItem("brindicis-panel-position", newPosition);
      } catch {}
      return { panelPosition: newPosition };
    });
  },
}));

// Initialize theme on load
if (typeof window !== "undefined") {
  const initialTheme = getStoredTheme();
  if (initialTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
