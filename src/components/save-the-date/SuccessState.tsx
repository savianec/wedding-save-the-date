"use client";

import { motion } from "framer-motion";

export function SuccessState() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 py-10 text-center"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      role="status"
      aria-live="polite"
    >
      <motion.span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF2EA] text-2xl text-[#6F8570]"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.05 }}
        aria-hidden
      >
        ✓
      </motion.span>
      <h2 className="font-serif text-2xl font-medium text-[#2F2C28]">
        Thank you!
      </h2>
      <p className="max-w-xs font-sans text-base leading-relaxed text-[#5C5853]">
        We&apos;ll send your official invitation soon 💌
      </p>
    </motion.div>
  );
}
