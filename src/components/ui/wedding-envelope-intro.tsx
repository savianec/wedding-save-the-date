"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type EnvelopeIntroPhase = "closed" | "opening";

export type WeddingEnvelopeIntroProps = {
  phase: EnvelopeIntroPhase;
  onRequestOpen: () => void;
  onAnimationEnd: () => void;
  headlineEyebrow?: string;
  firstNameLine: string;
  secondNameLine: string;
  date: string;
};

/** Classic envelope + card sequence timing (flap up, then card rises clear). */
const TOTAL_MS = { full: 3100, reduced: 1050 };

const EMERALD = {
  paper: "#ffffff",
  face: "#ecfdf5",
  faceDeep: "#d1fae5",
  stroke: "rgba(6, 95, 70, 0.45)",
  ink: "#064e3b",
  accent: "#047857",
};

const TIMES = "'Times New Roman', Times, serif";

export function WeddingEnvelopeIntro({
  phase,
  onRequestOpen,
  onAnimationEnd,
  headlineEyebrow,
  firstNameLine,
  secondNameLine,
  date,
}: WeddingEnvelopeIntroProps) {
  const reduceMotion = useReducedMotion();
  const endedRef = useRef(false);
  const durationMs = reduceMotion ? TOTAL_MS.reduced : TOTAL_MS.full;

  useEffect(() => {
    if (phase !== "opening") {
      endedRef.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      if (!endedRef.current) {
        endedRef.current = true;
        onAnimationEnd();
      }
    }, durationMs);
    return () => window.clearTimeout(id);
  }, [phase, durationMs, onAnimationEnd]);

  const isOpening = phase === "opening";

  const flapSpring = {
    duration: reduceMotion ? 0.38 : 0.78,
    ease: [0.33, 1, 0.36, 1] as const,
  };

  const topFlapRotate = isOpening ? (reduceMotion ? -158 : -178) : 0;

  const cardDelay = reduceMotion ? 0.14 : 0.44;

  const cardSlide = {
    duration: reduceMotion ? 0.42 : 0.88,
    delay: cardDelay,
    ease: [0.2, 1, 0.28, 1] as const,
  };

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col items-center justify-center px-4 py-8"
      role="presentation"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-950/88 via-emerald-900/82 to-emerald-950/88"
        aria-hidden
      />

      <div
        className="relative z-10 flex w-full max-w-[min(96vw,420px)] flex-col items-center overflow-visible pb-36 sm:pb-44"
        style={{
          perspective: reduceMotion ? 900 : 1400,
          fontFamily: TIMES,
        }}
      >
        <p className="mb-5 text-center text-sm font-normal tracking-[0.22em] text-emerald-100/90">
          An invitation for you
        </p>

        <div
          className={cn(
            "relative w-full max-w-[min(88vw,320px)] rounded-sm [transform-style:preserve-3d]",
            isOpening ? "overflow-visible" : "overflow-hidden",
          )}
          style={{ aspectRatio: "1.55 / 1" }}
        >
          {/* Back panel — always behind the card */}
          <div
            className="absolute inset-0 z-0 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
            style={{
              background: `linear-gradient(165deg, ${EMERALD.faceDeep} 0%, ${EMERALD.face} 45%, ${EMERALD.faceDeep} 100%)`,
              border: `1px solid ${EMERALD.stroke}`,
            }}
            aria-hidden
          />

          {/* Card: invisible when closed (inside pocket); slides up when opening; above pocket once open */}
          <motion.div
            className={cn(
              "absolute left-[14%] right-[14%] top-[14%] overflow-hidden rounded-sm bg-white",
              "flex min-h-[220px] flex-col sm:min-h-[260px]",
              isOpening ? "z-[6]" : "z-[1]",
            )}
            style={{
              border: `1px solid ${EMERALD.stroke}`,
              transformStyle: "preserve-3d",
              boxShadow: isOpening
                ? "0 20px 44px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.1)"
                : "0 4px 12px rgba(0,0,0,0.06)",
            }}
            initial={false}
            animate={
              isOpening
                ? {
                    y: reduceMotion ? "-18%" : "-28%",
                    scale: 1,
                    opacity: 1,
                  }
                : {
                    /* Tucked inside pocket — not visible until open */
                    y: "36%",
                    scale: 0.98,
                    opacity: 0,
                  }
            }
            transition={{
              y: cardSlide,
              scale: cardSlide,
              opacity: {
                duration: reduceMotion ? 0.28 : 0.42,
                delay: cardDelay,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
          >
            <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-2 px-5 py-6 text-center sm:gap-2.5 sm:px-7 sm:py-8">
              {headlineEyebrow ? (
                <motion.p
                  className="text-base italic leading-snug sm:text-lg"
                  style={{ color: EMERALD.ink }}
                  initial={false}
                  animate={isOpening ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={{
                    ...cardSlide,
                    delay: cardSlide.delay + 0.08,
                  }}
                >
                  {headlineEyebrow}
                </motion.p>
              ) : null}
              <motion.p
                className="text-2xl font-normal leading-tight sm:text-3xl"
                style={{ color: EMERALD.ink }}
                initial={false}
                animate={isOpening ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{
                  ...cardSlide,
                  delay: cardSlide.delay + 0.12,
                }}
              >
                {firstNameLine}
              </motion.p>
              <motion.p
                className="text-2xl font-normal leading-tight sm:text-3xl"
                style={{ color: EMERALD.ink }}
                initial={false}
                animate={isOpening ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{
                  ...cardSlide,
                  delay: cardSlide.delay + 0.16,
                }}
              >
                {secondNameLine}
              </motion.p>
              <motion.p
                className="text-base font-normal tracking-[0.14em] sm:text-lg"
                style={{ color: EMERALD.accent }}
                initial={false}
                animate={isOpening ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{
                  ...cardSlide,
                  delay: cardSlide.delay + 0.2,
                }}
              >
                {date}
              </motion.p>
            </div>
          </motion.div>

          {/* Pocket — in front of card while closed */}
          <div
            className="pointer-events-none absolute inset-0 z-[3]"
            style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.08))" }}
            aria-hidden
          >
            <div
              className="absolute bottom-0 left-0 right-0 top-[22%]"
              style={{
                clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
                background: `linear-gradient(180deg, ${EMERALD.face} 0%, ${EMERALD.faceDeep} 100%)`,
                borderBottom: `1px solid ${EMERALD.stroke}`,
              }}
            />
            <div
              className="absolute bottom-0 left-0 top-[22%] w-[50%]"
              style={{
                clipPath: "polygon(0% 100%, 100% 0%, 0% 0%)",
                background: EMERALD.faceDeep,
                opacity: 0.97,
                borderLeft: `1px solid ${EMERALD.stroke}`,
              }}
            />
            <div
              className="absolute bottom-0 right-0 top-[22%] w-[50%]"
              style={{
                clipPath: "polygon(100% 100%, 0% 0%, 100% 0%)",
                background: EMERALD.face,
                opacity: 0.98,
                borderRight: `1px solid ${EMERALD.stroke}`,
              }}
            />
          </div>

          <motion.div
            className={cn(
              "absolute left-0 right-0 top-0 [transform-style:preserve-3d]",
              isOpening ? "z-[1]" : "z-[4]",
            )}
            style={{
              height: "58%",
              transformOrigin: "50% 0%",
              clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
              borderBottom: `1px solid ${EMERALD.stroke}`,
              boxShadow: isOpening ? "none" : "0 6px 14px rgba(0,0,0,0.12)",
              backfaceVisibility: "hidden",
            }}
            initial={false}
            animate={{ rotateX: topFlapRotate }}
            transition={flapSpring}
            aria-hidden
          >
            <div
              className="absolute inset-0 rounded-t-sm"
              style={{
                background: `linear-gradient(180deg, ${EMERALD.paper} 0%, ${EMERALD.faceDeep} 100%)`,
              }}
            />
          </motion.div>

          {phase === "closed" ? (
            <button
              type="button"
              aria-expanded={false}
              aria-label="Open save the date envelope"
              onClick={onRequestOpen}
              className={cn(
                "absolute inset-0 z-[5] cursor-pointer rounded-sm outline-none ring-emerald-200/40 focus-visible:ring-2",
                "bg-transparent",
              )}
            >
              <span className="pointer-events-none absolute left-1/2 top-[14%] -translate-x-1/2 text-[15px] font-normal uppercase tracking-[0.35em] text-emerald-900/75 sm:top-[16%] sm:text-base">
                Open
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
