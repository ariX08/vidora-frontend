export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 mt-auto">
      <div className="mx-auto max-w-3xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Vidora.{" "}
          <a
            href="https://arix.faltuworkonly91.workers.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            MADE BY ARITRA.DESIGN
          </a>
        </p>
        <nav className="flex flex-wrap justify-center gap-4 text-xs">
          <a href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="/security" className="hover:text-foreground transition-colors">
            Security
          </a>
          <a href="/cookies" className="hover:text-foreground transition-colors">
            Cookies
          </a>
        </nav>
      </div>
    </footer>
  );
}
