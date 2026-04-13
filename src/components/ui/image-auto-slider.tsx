"use client";

import Image from "next/image";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type ImageAutoSliderItem = {
  src: string;
  alt: string;
};

export type ImageAutoSliderProps = {
  images: ImageAutoSliderItem[];
  /** Loop duration in seconds (default 20, matching reference). */
  durationSec?: number;
  /** Visual style: `light` for cream wedding page, `dark` for full-bleed black hero. */
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Infinite horizontal image strip (duplicated row + translateX animation).
 * Does not set global `html`/`body` styles — safe inside any layout.
 */
export function ImageAutoSlider({
  images,
  durationSec = 20,
  variant = "light",
  className,
}: ImageAutoSliderProps) {
  const loop = useMemo(() => [...images, ...images], [images]);

  if (!images.length) {
    return null;
  }

  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-6",
        isDark ? "min-h-[min(420px,55vh)] bg-black" : "py-2",
        className,
      )}
    >
      {isDark ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-24 bg-gradient-to-t from-black to-transparent" />
        </>
      ) : null}

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center",
          isDark ? "py-8" : "",
        )}
      >
        <div
          className={cn(
            "w-full overflow-hidden",
            isDark
              ? "[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
              : "[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
          )}
        >
          <div
            className="flex w-max gap-6 hover:[animation-play-state:paused]"
            style={{
              animation: `wedding-image-slider-x ${durationSec}s linear infinite`,
            }}
          >
            {loop.map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                className="h-48 w-48 shrink-0 overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-[transform,filter] duration-300 ease-out hover:scale-105 hover:brightness-110 md:h-64 md:w-64 lg:h-80 lg:w-80"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={640}
                  height={640}
                  sizes="(max-width: 768px) 192px, 320px"
                  className="h-full w-full object-cover"
                  priority={index < 4}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Default Unsplash strip — use for demos only (requires `remotePatterns`). */
export function ImageAutoSliderUnsplashDemo() {
  const images: ImageAutoSliderItem[] = [
    {
      src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 1",
    },
    {
      src: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 2",
    },
    {
      src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 3",
    },
    {
      src: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 4",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 5",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 6",
    },
    {
      src: "https://plus.unsplash.com/premium_photo-1675705721263-0bbeec261c49?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 7",
    },
    {
      src: "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Gallery image 8",
    },
  ];

  return <ImageAutoSlider images={images} variant="dark" />;
}

/** Back-compat name from the reference snippet. */
export const Component = ImageAutoSliderUnsplashDemo;

export default ImageAutoSlider;
