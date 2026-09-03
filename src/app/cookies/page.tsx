import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Cookies — Vidora" };

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-10">
        <article className="mx-auto max-w-2xl">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Vidora
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-foreground">Cookies Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: September 2026</p>

          <div className="mt-6 space-y-4 text-foreground/80 text-[15px] leading-relaxed">
            <p>
              Vidora uses a minimal set of cookies and local storage entries to make the product work.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Essential</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>vidora-theme</strong> — stored in localStorage to remember your light/dark mode preference
              </li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground pt-2">What we do not use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>No advertising cookies</li>
              <li>No third-party tracking pixels by default</li>
              <li>No cross-site profiling</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground pt-2">Managing preferences</h2>
            <p>
              You can clear localStorage and cookies in your browser settings at any time.
              Theme preference will reset to your system default after clearing.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
