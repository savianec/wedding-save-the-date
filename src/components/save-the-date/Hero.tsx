"use client";

import { motion } from "framer-motion";
import { FloatingAnimation } from "./FloatingAnimation";

export function Hero() {
  return (
    <header className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 py-8 text-center">
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] to-[#F1EDE7]"
        aria-hidden
      />
      <FloatingAnimation />

      <div className="relative z-10 flex max-w-md flex-col items-center gap-4">
        <motion.h1
          className="font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-medium leading-tight tracking-tight text-[#2F2C28]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        >
          Christian &amp; Annanikka
        </motion.h1>

        <motion.div
          className="h-px w-16 bg-[#E5E2DC]"
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
          aria-hidden
        />

        <motion.p
          className="font-serif text-lg tracking-[0.1em] text-[#5C5853]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
        >
          — 12.12.2026 —
        </motion.p>

        <motion.p
          className="max-w-[320px] font-serif text-[15px] leading-relaxed text-[#6F6B66]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.05, ease: "easeOut" }}
        >
          Save the date, we can&apos;t wait to celebrate with you.
        </motion.p>
      </div>
    </header>
  );
}
