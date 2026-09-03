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
  X,
} from "lucide-react";
import {
  cn,
  isValidYouTubeUrl,
  extractVideoId,
  normalizeYouTubeUrl,
} from "@/lib/utils";

type FormatType = "video" | "audio";
type Quality =
  | "best"
  | "1080p"
  | "720p"
  | "480p"
  | "360p"
  | "128k"
  | "192k"
  | "320k";

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  uploader: string;
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
  return (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

async function triggerBlobDownload(fileUrl: string, filename: string) {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error("Could not download the file from the server");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename || "vidora-download";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
  return objectUrl;
}

export function Downloader() {
  const [url, setUrl] = useState("");
  const [formatType, setFormatType] = useState<FormatType>("video");
  const [quality, setQuality] = useState<Quality>("best");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [state, setState] = useState<DownloadState>({
    status: "idle",
    progress: 0,
  });

  const apiBase = getApiBase();

  const fetchInfo = useCallback(async () => {
    if (!isValidYouTubeUrl(url)) {
      setState({
        status: "error",
        progress: 0,
        message: "Please enter a valid YouTube URL",
      });
      return;
    }
    if (!apiBase) {
      setState({
        status: "error",
        progress: 0,
        message:
          "Backend URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel.",
      });
      return;
    }

    const normalized = normalizeYouTubeUrl(url);
    setState({ status: "fetching", progress: 0 });
    setInfo(null);

    try {
      const res = await fetch(`${apiBase}/api/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch video info");
      }
      const data = await res.json();
      setInfo(data);
      setState({ status: "ready", progress: 0 });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not fetch video details";
      const id = extractVideoId(url);
      if (id) {
        setInfo({
          title: "YouTube Video",
          thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
          duration: "-",
          uploader: "YouTube",
        });
      }
      setState({
        status: "error",
        progress: 0,
        message:
          msg === "Failed to fetch"
            ? `Cannot reach backend at ${apiBase}.`
            : msg,
      });
    }
  }, [url, apiBase]);

  const pollJob = async (jobId: string) => {
    for (let i = 0; i < 120; i++) {
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
          const filename = data.filename || "vidora-download";
          setState((s) => ({ ...s, progress: 95, message: "Saving file..." }));
          const objectUrl = await triggerBlobDownload(
            data.downloadUrl,
            filename
          );
          setState({
            status: "success",
            progress: 100,
            downloadUrl: objectUrl,
            filename,
          });
          return;
        }
        if (data.status === "failed")
          throw new Error(data.error || "Processing failed");
      } catch (err) {
        if (err instanceof Error) {
          const m = err.message;
          if (
            m.includes("failed") ||
            m.includes("Could not download") ||
            m.includes("timed out")
          ) {
            throw err;
          }
        }
      }
    }
    throw new Error("Download timed out");
  };

  const startDownload = useCallback(async () => {
    if (!info || !url || !apiBase) return;
    const normalized = normalizeYouTubeUrl(url);
    setState({
      status: "downloading",
      progress: 5,
      message: "Starting download...",
    });
    try {
      const res = await fetch(`${apiBase}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: normalized,
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
          const filename = data.filename || "vidora-download";
          const objectUrl = await triggerBlobDownload(
            data.downloadUrl,
            filename
          );
          setState({
            status: "success",
            progress: 100,
            downloadUrl: objectUrl,
            filename,
          });
        } else if (data.jobId) {
          await pollJob(data.jobId);
        }
      } else {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        let filename = "vidora-download";
        const disposition = res.headers.get("content-disposition");
        if (disposition) {
          const match = disposition.match(
            /filename\*?=(?:UTF-8''|")?([^\";]+)/i
          );
          if (match)
            filename = decodeURIComponent(match[1].replace(/"/g, ""));
        }
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
        setState({
          status: "success",
          progress: 100,
          downloadUrl: objectUrl,
          filename,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Download failed";
      setState({
        status: "error",
        progress: 0,
        message:
          msg === "Failed to fetch"
            ? `Cannot reach backend at ${apiBase}.`
            : msg,
      });
    }
  }, [info, url, formatType, quality, apiBase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      state.status === "ready" ||
      state.status === "success" ||
      (state.status === "error" && info)
    ) {
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
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border shadow-xl shadow-violet-500/5 overflow-hidden"
      >
        <AnimatePresence>
          {info && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-border bg-muted/40"
            >
              <div className="p-4 flex gap-3 items-center">
                <div className="relative w-24 sm:w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={info.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
                    {info.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {info.uploader}
                    {info.duration !== "-" && ` - ${info.duration}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/70">
              <Link2 className="h-4 w-4" />
            </div>
            <input
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (state.status !== "idle" && state.status !== "fetching") {
                  setState({ status: "idle", progress: 0 });
                  setInfo(null);
                }
              }}
              placeholder="Paste YouTube URL here..."
              className={cn(
                "w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3 py-3 text-sm text-foreground",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              )}
              disabled={
                state.status === "fetching" || state.status === "downloading"
              }
            />
          </div>

          <div className="flex gap-1.5 p-1 rounded-xl bg-muted/60">
            <button
              type="button"
              onClick={() => {
                setFormatType("video");
                setQuality("best");
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all",
                formatType === "video"
                  ? "bg-card text-violet-600 dark:text-violet-300 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
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
                "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all",
                formatType === "audio"
                  ? "bg-card text-fuchsia-600 dark:text-fuchsia-300 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Music className="h-4 w-4" />
              Audio (MP3)
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
              Quality
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(formatType === "video" ? VIDEO_QUALITIES : AUDIO_QUALITIES).map(
                (q) => (
                  <button
                    key={q.value}
                    type="button"
                    onClick={() => setQuality(q.value)}
                    className={cn(
                      "rounded-lg border px-2 py-1.5 text-xs transition-all",
                      quality === q.value
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {q.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={
                !url.trim() ||
                state.status === "fetching" ||
                state.status === "downloading"
              }
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
                "bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500",
                "hover:opacity-95 shadow-lg shadow-violet-500/20 transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              )}
            >
              {state.status === "fetching" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Fetching info...
                </>
              )}
              {state.status === "downloading" && (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...{" "}
                  {state.progress}%
                </>
              )}
              {(state.status === "idle" ||
                (state.status === "error" && !info)) && (
                <>
                  <Sparkles className="h-4 w-4" /> Get Video Info
                </>
              )}
              {(state.status === "ready" || state.status === "success") && (
                <>
                  <Download className="h-4 w-4" /> Download{" "}
                  {formatType === "audio" ? "MP3" : "Video"}
                </>
              )}
              {state.status === "error" && info && (
                <>
                  <Download className="h-4 w-4" /> Retry Download
                </>
              )}
            </button>

            {(info || url.trim()) && (
              <button
                type="button"
                onClick={reset}
                disabled={
                  state.status === "fetching" || state.status === "downloading"
                }
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium",
                  "border border-border bg-muted/50 text-muted-foreground",
                  "hover:bg-muted hover:text-foreground transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                title="Clear and start over"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </form>

        <AnimatePresence>
          {(state.status === "downloading" ||
            state.status === "error" ||
            state.status === "success") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border"
            >
              <div className="px-4 sm:px-5 py-3">
                {state.status === "downloading" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {state.message}
                      </span>
                      <span className="font-medium text-primary">
                        {state.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                        animate={{ width: `${state.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                {state.status === "error" && (
                  <div className="flex items-start gap-2 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Something went wrong</p>
                      <p className="text-red-400/90 text-xs mt-0.5">
                        {state.message}
                      </p>
                    </div>
                  </div>
                )}
                {state.status === "success" && (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">
                        Saved to your downloads
                      </span>
                    </div>
                    {state.downloadUrl && (
                      <a
                        href={state.downloadUrl}
                        download={state.filename}
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        Save again <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground max-w-sm mx-auto">
        For personal use only. Respect copyright and YouTube Terms of Service.
      </p>
    </div>
  );
}
