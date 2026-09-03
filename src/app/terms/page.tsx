import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Terms of Service — Vidora" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-10">
        <article className="mx-auto max-w-2xl">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Vidora
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: September 2026</p>

          <div className="mt-6 space-y-4 text-foreground/80 text-[15px] leading-relaxed">
            <p>
              By using Vidora you agree to these terms. If you do not agree, do not use the service.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Personal use only</h2>
            <p>
              Vidora is provided for personal, non-commercial use. You are solely responsible for
              ensuring that your use of downloaded content complies with applicable law and with
              YouTube&apos;s Terms of Service.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">No copyright infringement</h2>
            <p>
              Do not use Vidora to download or redistribute copyrighted material without permission.
              We may suspend access for abuse or repeated violations.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Service availability</h2>
            <p>
              The service is provided "as is" without warranties. We may change, suspend, or
              discontinue features at any time. We are not liable for lost downloads, data, or damages
              arising from use of the service.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Acceptable use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>No automated bulk scraping or denial-of-service activity</li>
              <li>No attempts to bypass rate limits or security controls</li>
              <li>No uploading of malware or harmful content via the service</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground pt-2">Contact</h2>
            <p>
              <a
                href="https://arix.faltuworkonly91.workers.dev/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ARITRA.DESIGN
              </a>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
