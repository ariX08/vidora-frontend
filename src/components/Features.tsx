"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Music2, Smartphone, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Powered by yt-dlp and optimized servers for quick processing.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: Music2,
    title: "High-quality audio",
    description: "Extract crystal-clear MP3 up to 320 kbps from any video.",
    color: "from-fuchsia-400 to-pink-500",
  },
  {
    icon: Shield,
    title: "Private & secure",
    description: "No accounts. Files auto-delete after 24 hours. Your data stays yours.",
    color: "from-violet-400 to-purple-500",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "Fully responsive. Use it on desktop, tablet or mobile.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Clock,
    title: "Multiple qualities",
    description: "Choose from 360p up to best available 4K when supported.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: Sparkles,
    title: "Beautiful UX",
    description: "Thoughtful animations and a polished interface that feels premium.",
    color: "from-rose-400 to-red-500",
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Everything you need
          </h2>
          <p className="mt-2 text-foreground/55">
            Simple tools that just work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md hover:border-violet-200/60 transition-all"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-foreground/55 leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
