import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prepend https:// if the user pasted a URL without a protocol */
export function normalizeMediaUrl(raw: string): string {
  let u = raw.trim().replace(/^["']|["']$/g, "");
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  if (
    /^(www\.)?(youtube\.com|youtu\.be|instagram\.com)\//i.test(u)
  ) {
    return `https://${u}`;
  }
  return u;
}

/** @deprecated use normalizeMediaUrl */
export const normalizeYouTubeUrl = normalizeMediaUrl;

export function isValidMediaUrl(url: string): boolean {
  const u = normalizeMediaUrl(url);
  const patterns = [
    // YouTube
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/i,
    // Instagram Reels / posts / TV
    /^(https?:\/\/)?(www\.)?instagram\.com\/reel\/[\w-]+/i,
    /^(https?:\/\/)?(www\.)?instagram\.com\/reels\/[\w-]+/i,
    /^(https?:\/\/)?(www\.)?instagram\.com\/p\/[\w-]+/i,
    /^(https?:\/\/)?(www\.)?instagram\.com\/tv\/[\w-]+/i,
  ];
  return patterns.some((p) => p.test(u));
}

/** @deprecated use isValidMediaUrl */
export const isValidYouTubeUrl = isValidMediaUrl;

export function extractVideoId(url: string): string | null {
  const u = normalizeMediaUrl(url);
  const yt = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of yt) {
    const match = u.match(p);
    if (match) return match[1];
  }
  // Instagram shortcode
  const ig = u.match(/instagram\.com\/(?:reel|reels|p|tv)\/([\w-]+)/i);
  if (ig) return ig[1];
  return null;
}

export function isInstagramUrl(url: string): boolean {
  return /instagram\.com/i.test(normalizeMediaUrl(url));
}

export function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(normalizeMediaUrl(url));
}
