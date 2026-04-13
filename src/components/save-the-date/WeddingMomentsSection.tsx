"use client";

import { motion } from "framer-motion";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { WEDDING_MOMENTS } from "@/lib/wedding-photos";

export function WeddingMomentsSection() {
  return (
    <div className="w-full max-w-3xl px-3 pb-2 sm:px-4">
      <motion.div
        className="mb-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-serif text-xl font-medium text-[#2F2C28] md:text-2xl">
          Eight little frames
        </p>
        <a
          href="#rsvp"
          className="mt-3 inline-block font-sans text-sm font-medium text-[#6F8570] underline decoration-[#A8B5A2] decoration-2 underline-offset-4 hover:text-[#5a6b55]"
        >
          Skip to your details
        </a>
      </motion.div>

      <motion.div
        className="mb-8 -mx-2 sm:-mx-4"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        aria-label="Photo moments, auto-playing strip — hover to pause"
      >
        <ImageAutoSlider
          variant="light"
          durationSec={20}
          images={WEDDING_MOMENTS.map((m) => ({ src: m.src, alt: m.alt }))}
        />
      </motion.div>
    </div>
  );
}
