import { Header } from "@/components/Header";
import { Downloader } from "@/components/Downloader";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">
        <section className="pt-8 pb-6 sm:pt-10 sm:pb-8 px-4 flex-1">
          <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Download YouTube & Instagram Reels
              <span className="block mt-1 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                beautifully & fast
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Convert to MP4 or high-quality MP3 in seconds. No account required.
            </p>
          </div>
          <Downloader />
        </section>
      </main>
      <Footer />
    </>
  );
}
