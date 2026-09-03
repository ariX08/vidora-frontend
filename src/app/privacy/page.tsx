import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Privacy Policy — Vidora" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 px-4 py-10">
        <article className="mx-auto max-w-2xl prose prose-sm dark:prose-invert">
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Back to Vidora
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: September 2026</p>

          <div className="mt-6 space-y-4 text-foreground/80 text-[15px] leading-relaxed">
            <p>
              Vidora ("we", "our") respects your privacy. This policy explains what information
              we process when you use our YouTube media download service.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Information we process</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>YouTube URLs you submit for download or conversion</li>
              <li>Technical logs (IP address, browser type, request timestamps) for abuse prevention</li>
              <li>Optional analytics cookies if you consent (see Cookies policy)</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground pt-2">What we do not collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>No account registration is required</li>
              <li>We do not sell personal data</li>
              <li>Downloaded media files are temporary and auto-deleted within 24 hours</li>
            </ul>

            <h2 className="text-lg font-semibold text-foreground pt-2">How we use data</h2>
            <p>
              Submitted URLs are used solely to fetch and process the requested media.
              Logs may be used to investigate abuse, rate limits, and service reliability.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Third parties</h2>
            <p>
              Processing may involve cloud infrastructure (e.g. hosting providers). YouTube content
              remains subject to Google&apos;s Terms of Service. We do not share your data with advertisers.
            </p>

            <h2 className="text-lg font-semibold text-foreground pt-2">Contact</h2>
            <p>
              Questions about privacy: visit{" "}
              <a
                href="https://arix.faltuworkonly91.workers.dev/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ARITRA.DESIGN
              </a>
              .
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
