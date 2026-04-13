import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { WEDDING_LANDSCAPE_SRC, WEDDING_SCROLL_PORTRAITS } from "@/lib/wedding-photos";
import { FormCard } from "./FormCard";
import { IntroText } from "./IntroText";
import { WeddingMomentsSection } from "./WeddingMomentsSection";

export function SaveTheDatePage() {
  return (
    <div className="min-h-[100dvh] bg-[#FAF7F2] pb-[env(safe-area-inset-bottom)]">
      <ScrollExpandMedia
        mediaType="image"
        mediaGallery={WEDDING_SCROLL_PORTRAITS}
        bgImageSrc={WEDDING_LANDSCAPE_SRC}
        headlineEyebrow="Save the date!"
        title="Christian & Annanikka's Wedding"
        date="12.12.2026"
        textBlend
        envelopeIntro
      >
        <div className="mx-auto flex w-full max-w-[520px] flex-col items-center rounded-t-[32px] bg-[#FAF7F2] px-1 pb-4 sm:px-2">
          <IntroText />
          <WeddingMomentsSection />
          <FormCard />
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
