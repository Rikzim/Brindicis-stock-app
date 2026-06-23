const FALLBACK_FALLBACK = "";

function readSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export function writeSearchParams(params: Record<string, string | number | undefined>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "" || value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  window.history.replaceState({}, "", url.toString());
}

export function getStringParam(key: string, fallback = ""): string {
  if (typeof window === "undefined") return fallback;
  return readSearchParams().get(key) || fallback;
}

export function getNumberParam(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = readSearchParams().get(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

// Keep this export so existing imports still work; it now safely no-ops on the server.
export { FALLBACK_FALLBACK };
