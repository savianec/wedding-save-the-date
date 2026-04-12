"use client";

import { motion } from "framer-motion";

const SHAPE_COUNT = 8;

function randomBetween(min: number, max: number, seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return min + (x - Math.floor(x)) * (max - min);
}

export function FloatingAnimation() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {Array.from({ length: SHAPE_COUNT }, (_, i) => {
        const duration = randomBetween(6, 12, i + 1);
        const delay = randomBetween(0, 3, i + 3);
        const xDrift = randomBetween(-10, 10, i + 5);
        const size = randomBetween(48, 96, i + 7);
        const left = `${randomBetween(5, 85, i + 9)}%`;
        const top = `${randomBetween(5, 85, i + 11)}%`;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#A8B5A2] blur-2xl"
            style={{
              width: size,
              height: size * 0.85,
              left,
              top,
              opacity: 0.07,
            }}
            initial={{ y: 0, x: 0, opacity: 0.05 }}
            animate={{
              y: [0, -40, 0, 20, 0],
              x: [0, xDrift, -xDrift * 0.6, 0],
              opacity: [0.05, 0.1, 0.08, 0.1, 0.05],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
