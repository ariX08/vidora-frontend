import { Header } from "@/components/Header";
import { Downloader } from "@/components/Downloader";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 px-4">
          <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Download YouTube videos
              <span className="block mt-1 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                beautifully &amp; fast
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-foreground/60 max-w-xl mx-auto">
              Convert to MP4 or high-quality MP3 in seconds. No account required.
              Clean interface, premium experience.
            </p>
          </div>
          <Downloader />
        </section>
        <Features />
      </main>
      <Footer />
    </>
  );
}
