import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prepend https:// if the user pasted youtube.com/... without a protocol */
export function normalizeYouTubeUrl(raw: string): string {
  let u = raw.trim();
  if (!u) return u;
  // Strip surrounding whitespace / accidental quotes
  u = u.replace(/^["']|["']$/g, "");
  if (/^https?:\/\//i.test(u)) return u;
  if (/^(www\.)?(youtube\.com|youtu\.be)\//i.test(u)) {
    return `https://${u}`;
  }
  return u;
}

export function isValidYouTubeUrl(url: string): boolean {
  const u = normalizeYouTubeUrl(url);
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/i,
  ];
  return patterns.some((p) => p.test(u));
}

export function extractVideoId(url: string): string | null {
  const u = normalizeYouTubeUrl(url);
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = u.match(p);
    if (match) return match[1];
  }
  return null;
}
