import { writable } from "svelte/store";

interface SettingsState {
  theme: "light" | "dark";
  panelPosition: "left" | "right";
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

function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function createSettingsStore() {
  const initialTheme = getStoredTheme();
  applyTheme(initialTheme);

  const { subscribe, update } = writable<SettingsState>({
    theme: initialTheme,
    panelPosition: getStoredPanelPosition(),
  });

  return {
    subscribe,
    setTheme(theme: "light" | "dark") {
      try {
        localStorage.setItem("brindicis-theme", theme);
      } catch {}
      applyTheme(theme);
      update((s) => ({ ...s, theme }));
    },
    setPanelPosition(panelPosition: "left" | "right") {
      try {
        localStorage.setItem("brindicis-panel-position", panelPosition);
      } catch {}
      update((s) => ({ ...s, panelPosition }));
    },
    toggleTheme() {
      update((s) => {
        const newTheme = s.theme === "light" ? "dark" : "light";
        try {
          localStorage.setItem("brindicis-theme", newTheme);
        } catch {}
        applyTheme(newTheme);
        return { ...s, theme: newTheme };
      });
    },
    togglePanelPosition() {
      update((s) => {
        const newPosition = s.panelPosition === "right" ? "left" : "right";
        try {
          localStorage.setItem("brindicis-panel-position", newPosition);
        } catch {}
        return { ...s, panelPosition: newPosition };
      });
    },
  };
}

export const settingsStore = createSettingsStore();
