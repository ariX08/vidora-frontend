"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Download,
  Music,
  Video,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn, isValidYouTubeUrl, extractVideoId } from "@/lib/utils";

type FormatType = "video" | "audio";
type Quality = "best" | "1080p" | "720p" | "480p" | "360p" | "128k" | "192k" | "320k";

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  formats?: { format_id: string; ext: string; resolution?: string; filesize?: number }[];
}

interface DownloadState {
  status: "idle" | "fetching" | "ready" | "downloading" | "success" | "error";
  progress: number;
  message?: string;
  downloadUrl?: string;
  filename?: string;
}

const VIDEO_QUALITIES: { value: Quality; label: string }[] = [
  { value: "best", label: "Best available" },
  { value: "1080p", label: "1080p Full HD" },
  { value: "720p", label: "720p HD" },
  { value: "480p", label: "480p" },
  { value: "360p", label: "360p" },
];

const AUDIO_QUALITIES: { value: Quality; label: string }[] = [
  { value: "320k", label: "320 kbps (High)" },
  { value: "192k", label: "192 kbps" },
  { value: "128k", label: "128 kbps" },
];

function getApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.replace(/\/$/, "");
}

export function Downloader() {
  const [url, setUrl] = useState("");
  const [formatType, setFormatType] = useState<FormatType>("video");
  const [quality, setQuality] = useState<Quality>("best");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [state, setState] = useState<DownloadState>({ status: "idle", progress: 0 });

  const apiBase = getApiBase();

  const fetchInfo = useCallback(async () => {
    if (!isValidYouTubeUrl(url)) {
      setState({ status: "error", progress: 0, message: "Please enter a valid YouTube URL" });
      return;
    }

    if (!apiBase) {
      setState({
        status: "error",
        progress: 0,
        message: "Backend URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel to your Railway URL.",
      });
      return;
    }

    setState({ status: "fetching", progress: 0 });
    setInfo(null);

    try {
      const res = await fetch(`${apiBase}/api/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch video info");
      }

      const data = await res.json();
      setInfo(data);
      setState({ status: "ready", progress: 0 });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not fetch video details";
      // Still show a basic preview so the UI isn't empty
      const id = extractVideoId(url);
      if (id) {
        setInfo({
          title: "YouTube Video",
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
          duration: "\u2014",
          uploader: "YouTube",
        });
      }
      setState({
        status: "error",
        progress: 0,
        message:
          msg === "Failed to fetch"
            ? `Cannot reach backend at ${apiBase}. Check NEXT_PUBLIC_API_URL and that Railway is online.`
            : msg,
      });
    }
  }, [url, apiBase]);

  const pollJob = async (jobId: string) => {
    const maxAttempts = 120;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      try {
        const res = await fetch(`${apiBase}/api/job/${jobId}`);
        if (!res.ok) continue;
        const data = await res.json();
        setState((s) => ({
          ...s,
          progress: data.progress || s.progress,
          message: data.message || s.message,
        }));
        if (data.status === "completed" && data.downloadUrl) {
          setState({
            status: "success",
            progress: 100,
            downloadUrl: data.downloadUrl,
            filename: data.filename,
          });
          const a = document.createElement("a");
          a.href = data.downloadUrl;
          a.download = data.filename || "download";
          a.click();
          return;
        }
        if (data.status === "failed") {
          throw new Error(data.error || "Processing failed");
        }
      } catch (err) {
        if (err instanceof Error && err.message !== "Failed to fetch") {
          // only rethrow real job failures, keep polling on network blips
          if (String(err.message).includes("Processing") || String(err.message).includes("failed")) {
            throw err;
          }
        }
      }
    }
    throw new Error("Download timed out");
  };

  const startDownload = useCallback(async () => {
    if (!info || !url) return;

    if (!apiBase) {
      setState({
        status: "error",
        progress: 0,
        message: "Backend URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel.",
      });
      return;
    }

    setState({ status: "downloading", progress: 5, message: "Starting download\u2026" });

    try {
      const res = await fetch(`${apiBase}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          type: formatType,
          quality,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Download failed");
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.downloadUrl) {
          setState({
            status: "success",
            progress: 100,
            downloadUrl: data.downloadUrl,
            filename: data.filename || "vidora-download",
          });
          const a = document.createElement("a");
          a.href = data.downloadUrl;
          a.download = data.filename || "download";
          a.click();
        } else if (data.jobId) {
          await pollJob(data.jobId);
        }
      } else {
        const blob = await res.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const disposition = res.headers.get("content-disposition");
        let filename = "vidora-download";
        if (disposition) {
          const match = disposition.match(/filename="?([^\"]+)"?/);
          if (match) filename = match[1];
        }
        setState({
          status: "success",
          progress: 100,
          downloadUrl,
          filename,
        });
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        a.click();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Download failed";
      setState({
        status: "error",
        progress: 0,
        message:
          msg === "Failed to fetch"
            ? `Cannot reach backend at ${apiBase}. Is Railway online?`
            : msg,
      });
    }
  }, [info, url, formatType, quality, apiBase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.status === "ready" || state.status === "success") {
      startDownload();
    } else if (state.status === "error" && info) {
      startDownload();
    } else {
      fetchInfo();
    }
  };

  const reset = () => {
    setUrl("");
    setInfo(null);
    setState({ status: "idle", progress: 0 });
    setQuality("best");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-white border border-border shadow-xl shadow-violet-500/5 overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400">
              <Link2 className="h-5 w-5" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (state.status !== "idle" && state.status !== "fetching") {
                  setState({ status: "idle", progress: 0 });
                  setInfo(null);
                }
              }}
              placeholder="Paste YouTube URL here\u2026"
              className={cn(
                "w-full rounded-xl border border-border bg-muted/40 pl-11 pr-4 py-3.5 text-[15px]",
                "placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400",
                "transition-all"
              )}
              disabled={state.status === "fetching" || state.status === "downloading"}
            />
          </div>

          <div className="flex gap-2 p-1 rounded-xl bg-muted/60">
            <button
              type="button"
              onClick={() => {
                setFormatType("video");
                setQuality("best");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                formatType === "video"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              <Video className="h-4 w-4" />
              Video
            </button>
            <button
              type="button"
              onClick={() => {
                setFormatType("audio");
                setQuality("192k");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                formatType === "audio"
                  ? "bg-white text-fuchsia-700 shadow-sm"
                  : "text-foreground/60 hover:text-foreground"
              )}
            >
              <Music className="h-4 w-4" />
              Audio (MP3)
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
              Quality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(formatType === "video" ? VIDEO_QUALITIES : AUDIO_QUALITIES).map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => setQuality(q.value)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm transition-all",
                    quality === q.value
                      ? "border-violet-400 bg-violet-50 text-violet-700 font-medium"
                      : "border-border bg-white text-foreground/70 hover:border-violet-200"
                  )}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              !url.trim() ||
              state.status === "fetching" ||
              state.status === "downloading"
            }
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-semibold text-white",
              "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600",
              "hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500",
              "shadow-lg shadow-violet-500/25 transition-all",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            )}
          >
            {state.status === "fetching" && (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Fetching info\u2026
              </>
            )}
            {state.status === "downloading" && (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing\u2026 {state.progress}%
              </>
            )}
            {(state.status === "idle" || (state.status === "error" && !info)) && (
              <>
                <Sparkles className="h-5 w-5" />
                Get Video Info
              </>
            )}
            {(state.status === "ready" || state.status === "success") && (
              <>
                <Download className="h-5 w-5" />
                Download {formatType === "audio" ? "MP3" : "Video"}
              </>
            )}
            {state.status === "error" && info && (
              <>
                <Download className="h-5 w-5" />
                Retry Download
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {(state.status === "downloading" || state.status === "error" || state.status === "success") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border"
            >
              <div className="px-5 sm:px-6 py-4">
                {state.status === "downloading" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">{state.message || "Working\u2026"}</span>
                      <span className="font-medium text-violet-600">{state.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${state.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
                {state.status === "error" && (
                  <div className="flex items-start gap-3 text-sm text-red-600">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Something went wrong</p>
                      <p className="text-red-500/80 mt-0.5">{state.message}</p>
                    </div>
                  </div>
                )}
                {state.status === "success" && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-sm text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Ready! Download started.</span>
                    </div>
                    {state.downloadUrl && (
                      <a
                        href={state.downloadUrl}
                        download={state.filename}
                        className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1"
                      >
                        Save again <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {info && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border bg-muted/30"
            >
              <div className="p-5 sm:p-6 flex gap-4">
                <div className="relative w-28 sm:w-36 shrink-0 aspect-video rounded-lg overflow-hidden bg-muted shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={info.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[15px] leading-snug line-clamp-2">
                    {info.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/50">
                    {info.uploader}
                    {info.duration !== "\u2014" && ` \u00b7 ${info.duration}`}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-3 text-xs font-medium text-violet-600 hover:text-violet-700"
                  >
                    Clear & start over
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-6 text-center text-xs text-foreground/40 max-w-md mx-auto">
        Vidora is for personal use. Please respect copyright and YouTube Terms of Service.
        Downloads are processed on secure servers and files are automatically deleted after 24 hours.
      </p>
    </div>
  );
}
