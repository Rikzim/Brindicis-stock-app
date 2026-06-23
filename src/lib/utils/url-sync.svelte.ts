export function readSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export function writeSearchParams(params: Record<string, string | number | undefined>) {
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
  return readSearchParams().get(key) || fallback;
}

export function getNumberParam(key: string, fallback: number): number {
  const raw = readSearchParams().get(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}
