"use client";

import { motion } from "framer-motion";

const CALENDAR_HREF = "/calendar/christian-annanikka-wedding.ics";
const CALENDAR_FILENAME = "Christian-Annanikka-Wedding-Save-The-Date.ics";

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
      <p className="max-w-[280px] font-sans text-sm leading-relaxed text-[#6F6B66]">
        Add our wedding to your calendar so you don&apos;t miss the day.
      </p>
      <a
        href={CALENDAR_HREF}
        download={CALENDAR_FILENAME}
        className="flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full bg-[#A8B5A2] px-6 text-base font-medium text-white transition-colors hover:bg-[#96a590] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A8B5A2]"
      >
        Save the date in my calendar
      </a>
      <p className="max-w-xs font-sans text-xs text-[#9A9590]">
        Opens or downloads an{" "}
        <span className="whitespace-nowrap">.ics</span> file you can import into
        Apple, Google, or Outlook calendar.
      </p>
    </motion.div>
  );
}
