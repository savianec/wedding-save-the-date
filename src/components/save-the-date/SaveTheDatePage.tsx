import { Hero } from "./Hero";
import { IntroText } from "./IntroText";
import { FormCard } from "./FormCard";

export function SaveTheDatePage() {
  return (
    <div className="min-h-[100dvh] bg-[#FAF7F2] pb-[env(safe-area-inset-bottom)]">
      <Hero />
      <IntroText />
      <FormCard />
    </div>
  );
}
