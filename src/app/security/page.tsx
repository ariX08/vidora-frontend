import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Security — Vidora" };

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-10">
        <article className="mx-auto max-w-2xl">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Vidora
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-foreground">Security</h1>
          <p className="text-muted-foreground text-sm">Last updated: September 2026</p>

          <div className="mt-6 space-y-4 text-foreground/80 text-[15px] leading-relaxed">
            <p>
              We take practical steps to keep Vidora safe for users and operators.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Infrastructure</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>HTTPS encryption in transit for the web app and API</li>
              <li>Temporary processing files stored on the server and deleted within 24 hours</li>
              <li>Input validation on all YouTube URLs and request bodies</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground pt-2">Abuse prevention</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Duration and file-size limits on downloads</li>
              <li>Job timeouts to prevent runaway processes</li>
              <li>Server-side execution isolation for media tools</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground pt-2">Reporting issues</h2>
            <p>
              If you discover a security vulnerability, please report it responsibly via{" "}
              <a
                href="https://arix.faltuworkonly91.workers.dev/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ARITRA.DESIGN
              </a>
              . Do not publicly disclose details until we have had a reasonable chance to fix the issue.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
