"use client";

import { motion } from "framer-motion";
import { Film, Github } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-border/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
            Vidora
          </span>
        </motion.div>

        <motion.a
          href="https://github.com/ariX08/vidora-frontend"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors rounded-lg px-3 py-1.5 hover:bg-muted"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">GitHub</span>
        </motion.a>
      </div>
    </header>
  );
}
