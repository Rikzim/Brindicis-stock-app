import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path?: string | null, width?: number): string | undefined {
  if (!path) return undefined;
  if (path.startsWith(API_URL)) path = path.slice(API_URL.length);
  if (!path) return undefined;
  if (width) return `${path}?w=${width}`;
  return path;
}

export function getSrcSet(path: string | null | undefined, widths: number[]): string | undefined {
  if (!path) return undefined;
  if (path.startsWith(API_URL)) path = path.slice(API_URL.length);
  if (!path) return undefined;
  return widths.map((w) => `${path}?w=${w} ${w}w`).join(", ");
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
