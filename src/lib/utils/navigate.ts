export function navigateTo(path: string) {
  window.history.pushState({}, "", path);
  queueMicrotask(() => window.dispatchEvent(new Event("popstate")));
}
