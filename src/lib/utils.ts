import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/i,
    /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/i,
  ];
  return patterns.some((p) => p.test(url.trim()));
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}
