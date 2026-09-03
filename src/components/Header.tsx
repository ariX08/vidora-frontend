"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="w-full border-b border-border/60 bg-card/70 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vidora-icon.svg"
            alt="Vidora"
            className="h-8 w-8 rounded-lg"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Vidora
          </span>
        </motion.a>

        <motion.button
          type="button"
          onClick={toggle}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          aria-label="Toggle dark mode"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </motion.button>
      </div>
    </header>
  );
}
