/**
 * All eight engagement photos (paths under /public/wedding).
 * Order is narrative: wide landscape first, then moments through the day.
 */
export type WeddingMoment = {
  id: string;
  src: string;
  label: string;
  alt: string;
};

export const WEDDING_MOMENTS: WeddingMoment[] = [
  {
    id: "vineyard",
    src: "/wedding/01-vineyard.png",
    label: "The view",
    alt: "Christian and Annanikka in the vineyard at golden hour",
  },
  {
    id: "engagement",
    src: "/wedding/02-engagement.png",
    label: "The yes",
    alt: "Christian and Annanikka celebrating their engagement outdoors",
  },
  {
    id: "proposal",
    src: "/wedding/03-proposal-bw.png",
    label: "The question",
    alt: "Proposal moment in black and white",
  },
  {
    id: "road",
    src: "/wedding/04-road.png",
    label: "The walk",
    alt: "Christian and Annanikka walking together down a tree-lined road",
  },
  {
    id: "garden",
    src: "/wedding/05-garden.png",
    label: "The garden",
    alt: "Christian and Annanikka walking through a garden with white flowers",
  },
  {
    id: "celebration",
    src: "/wedding/06-celebration.png",
    label: "The laughter",
    alt: "Christian and Annanikka laughing together on the lawn with wine",
  },
  {
    id: "together-bw",
    src: "/wedding/07-together-bw.png",
    label: "The quiet",
    alt: "Christian and Annanikka embracing, black and white",
  },
  {
    id: "aisle",
    src: "/wedding/08-aisle.png",
    label: "The path ahead",
    alt: "Christian and Annanikka walking toward a floral arrangement",
  },
];

/** Full-bleed background for the scroll hero (landscape). */
export const WEDDING_LANDSCAPE_SRC = WEDDING_MOMENTS[0].src;

/** Portraits cycled inside the expanding frame as the guest scrolls (all non-landscape). */
export const WEDDING_SCROLL_PORTRAITS = WEDDING_MOMENTS.slice(1).map((m) => m.src);
