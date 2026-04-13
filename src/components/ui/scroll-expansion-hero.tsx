"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WeddingEnvelopeIntro } from "@/components/ui/wedding-envelope-intro";

export interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  /** Video URL, or single image when `mediaGallery` is not used. */
  mediaSrc?: string;
  /** Image mode: multiple URLs crossfaded in the expanding frame as scroll progresses. */
  mediaGallery?: string[];
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  /** Short line above the split title (same serif/size as names). */
  headlineEyebrow?: string;
  textBlend?: boolean;
  /** When true, a tap-to-open envelope plays before wheel/touch expansion is enabled. */
  envelopeIntro?: boolean;
  children?: ReactNode;
}

function imageLayerOpacities(scrollProgress: number, count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [1];
  const span = count - 1;
  const pos = Math.min(Math.max(scrollProgress, 0), 1) * span;
  const i0 = Math.min(Math.floor(pos), span);
  const i1 = Math.min(i0 + 1, count - 1);
  const t = pos - i0;
  return Array.from({ length: count }, (_, i) => {
    if (i0 === i1) return i === i0 ? 1 : 0;
    if (i === i0) return 1 - t;
    if (i === i1) return t;
    return 0;
  });
}

/** Hero titles + date: Times New Roman stack (web-safe). */
const headlineText =
  "text-4xl font-normal tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] md:text-5xl lg:text-6xl [font-family:'Times_New_Roman','Times',serif]";
const metaText =
  "font-serif text-lg text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] md:text-xl";

function ScrollExpandMedia({
  mediaType = "video",
  mediaSrc,
  mediaGallery,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  headlineEyebrow,
  textBlend,
  envelopeIntro = false,
  children,
}: ScrollExpandMediaProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);
  const [envelopePhase, setEnvelopePhase] = useState<"closed" | "opening" | "done">(() =>
    envelopeIntro ? "closed" : "done",
  );
  const heroHeadlineRef = useRef<HTMLDivElement>(null);

  const envelopeGesturesActive = !envelopeIntro || envelopePhase === "done";

  useEffect(() => {
    if (!envelopeIntro) {
      setEnvelopePhase("done");
    }
  }, [envelopeIntro]);

  const handleRequestEnvelopeOpen = useCallback(() => {
    setEnvelopePhase("opening");
  }, []);

  const handleEnvelopeIntroComplete = useCallback(() => {
    setEnvelopePhase((p) => (p === "opening" ? "done" : p));
  }, []);

  useEffect(() => {
    if (!envelopeIntro || envelopePhase !== "done") return;
    const id = requestAnimationFrame(() => {
      heroHeadlineRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [envelopeIntro, envelopePhase]);

  useEffect(() => {
    const handleWheel = (e: Event) => {
      if (!envelopeGesturesActive) return;
      const we = e as WheelEvent;
      if (mediaFullyExpanded && we.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        we.preventDefault();
      } else if (!mediaFullyExpanded) {
        we.preventDefault();
        const scrollDelta = we.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: Event) => {
      const te = e as TouchEvent;
      setTouchStartY(te.touches[0].clientY);
    };

    const handleTouchMove = (e: Event) => {
      if (!envelopeGesturesActive) return;
      const te = e as TouchEvent;
      if (!touchStartY) return;

      const touchY = te.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        te.preventDefault();
      } else if (!mediaFullyExpanded) {
        te.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY, envelopeGesturesActive]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  const imageLayers =
    mediaType === "image" && mediaGallery && mediaGallery.length > 0
      ? mediaGallery
      : mediaType === "image" && mediaSrc
        ? [mediaSrc]
        : [];

  const layerOpacities = imageLayerOpacities(scrollProgress, imageLayers.length);

  const headlineBlendActive = Boolean(textBlend && envelopeGesturesActive);

  if (mediaType === "video" && !mediaSrc) {
    return null;
  }

  return (
    <div className="overflow-x-hidden transition-colors duration-700 ease-in-out">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <Image
              src={bgImageSrc}
              alt=""
              width={1920}
              height={1080}
              sizes="100vw"
              className="h-screen w-screen"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              priority
            />
            <div className="absolute inset-0 bg-black/10" aria-hidden />
          </motion.div>

          {envelopeIntro && envelopePhase !== "done" ? (
            <motion.div
              className="pointer-events-none absolute inset-0 z-[4] bg-gradient-to-b from-emerald-950/50 via-emerald-900/40 to-emerald-950/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: envelopePhase === "opening" ? 0.22 : 0.48 }}
              transition={{ duration: 0.35 }}
              aria-hidden
            />
          ) : null}

          <div className="relative z-10 flex w-full max-w-none flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full max-w-none flex-col items-center justify-start pt-24 md:pt-10 lg:pt-12">
              <div
                ref={heroHeadlineRef}
                tabIndex={-1}
                className={cn(
                  "relative z-20 flex w-full max-w-5xl flex-col items-center gap-2 px-4 pb-0 text-center transition-none pointer-events-none outline-none md:gap-3 md:pb-4",
                  headlineBlendActive ? "mix-blend-difference" : "mix-blend-normal",
                  envelopeIntro &&
                    envelopePhase !== "done" &&
                    "select-none opacity-0 transition-opacity duration-300",
                )}
                aria-hidden={envelopeIntro && envelopePhase !== "done" ? true : undefined}
              >
                {headlineEyebrow ? (
                  <motion.p
                    className={cn(headlineText, "italic leading-tight")}
                    style={{ transform: "translateX(0)" }}
                  >
                    {headlineEyebrow}
                  </motion.p>
                ) : null}
                <motion.h2
                  className={cn(headlineText, "text-center transition-none")}
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className={cn(headlineText, "text-center transition-none")}
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>

              <div
                className={cn(
                  "absolute inset-x-0 z-0 flex -translate-y-1/2 justify-center px-3 transition-opacity duration-500 max-md:px-4 md:px-6",
                  envelopeIntro && envelopePhase !== "done" && "pointer-events-none opacity-0",
                )}
                style={{
                  top: isMobileState
                    ? "calc(52% + clamp(3rem, 11vh, 6rem))"
                    : "calc(50% + clamp(2.5rem, 10vh, 5rem))",
                }}
                aria-hidden={envelopeIntro && envelopePhase !== "done" ? true : undefined}
              >
                <div
                  className="shrink-0 rounded-2xl"
                  style={{
                    width: `${mediaWidth}px`,
                    height: `${mediaHeight}px`,
                    maxWidth: "min(95vw, calc(100vw - 2rem))",
                    maxHeight: "85vh",
                    boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.3)",
                  }}
                >
                {mediaType === "video" && mediaSrc ? (
                  mediaSrc.includes("youtube.com") ? (
                    <div className="pointer-events-none relative h-full w-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          mediaSrc.includes("embed")
                            ? `${mediaSrc}${mediaSrc.includes("?") ? "&" : "?"}autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1`
                            : `${mediaSrc.replace("watch?v=", "embed/")}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=${mediaSrc.split("v=")[1]}`
                        }
                        className="h-full w-full rounded-xl"
                        title={title || "Background video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{ pointerEvents: "none" }}
                      />

                      <motion.div
                        className="absolute inset-0 rounded-xl bg-black/30"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  ) : (
                    <div className="pointer-events-none relative h-full w-full">
                      <video
                        src={mediaSrc}
                        poster={posterSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        className="h-full w-full rounded-xl object-cover"
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                      />
                      <div
                        className="absolute inset-0 z-10"
                        style={{ pointerEvents: "none" }}
                      />

                      <motion.div
                        className="absolute inset-0 rounded-xl bg-black/30"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  )
                ) : imageLayers.length > 0 ? (
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    {imageLayers.map((src, index) => (
                      <Image
                        key={src}
                        src={src}
                        alt={title ? `${title} — moment ${index + 1}` : `Photo ${index + 1}`}
                        width={1200}
                        height={1600}
                        sizes="(max-width: 768px) 95vw, 900px"
                        className="absolute inset-0 h-full w-full rounded-xl object-cover"
                        style={{ opacity: layerOpacities[index] ?? 0 }}
                        priority={index === 0}
                      />
                    ))}

                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-xl bg-black/50"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#E8E4DD] text-sm text-[#6F6B66]">
                    Add an image URL
                  </div>
                )}

                <div className="relative z-10 mt-4 flex flex-col items-center text-center transition-none">
                  {date ? (
                    <p
                      className={cn(headlineText, "leading-tight")}
                      style={{ transform: "translateX(0)" }}
                    >
                      {date}
                    </p>
                  ) : null}
                  {scrollToExpand ? (
                    <p
                      className={cn(metaText, "mt-2")}
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {scrollToExpand}
                    </p>
                  ) : null}
                </div>
                </div>
              </div>

              {envelopeIntro && envelopePhase !== "done" ? (
                <WeddingEnvelopeIntro
                  phase={envelopePhase === "closed" ? "closed" : "opening"}
                  onRequestOpen={handleRequestEnvelopeOpen}
                  onAnimationEnd={handleEnvelopeIntroComplete}
                  headlineEyebrow={headlineEyebrow}
                  firstNameLine={firstWord}
                  secondNameLine={restOfTitle}
                  date={date ?? ""}
                />
              ) : null}
            </div>

            <motion.section
              className="mx-auto flex w-full max-w-7xl flex-col px-4 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ScrollExpandMedia;
export { ScrollExpandMedia };
