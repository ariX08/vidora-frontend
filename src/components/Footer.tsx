export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white/50 mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/50">
        <p>
          © {new Date().getFullYear()} Vidora. Built with Next.js &amp; love.
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
