"use client";

import { motion } from "framer-motion";

export function IntroText() {
  return (
    <motion.section
      className="mx-auto max-w-[480px] px-8 py-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p className="font-serif text-base leading-[1.5] text-[#5C5853]">
        We&apos;re getting married on the 12th of December 2026 and we&apos;re
        so excited to celebrate with you. Please leave your details so we can
        send your official invitation.
      </p>
    </motion.section>
  );
}
