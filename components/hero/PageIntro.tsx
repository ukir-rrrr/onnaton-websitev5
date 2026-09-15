"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { INTRO_LOGO_FADE_DURATION } from "@/lib/motion/diagonalWipe";

export type IntroPhase = "logo" | "fadeOut" | "ready";

interface PageIntroProps {
  phase: IntroPhase;
  onFadeOutComplete: () => void;
}

/** Logo hold → cross-fade to the hero image already rendered underneath. */
export function PageIntro({ phase, onFadeOutComplete }: PageIntroProps) {
  const showLogoPlate = phase === "logo" || phase === "fadeOut";

  return (
    <AnimatePresence>
      {showLogoPlate && (
        <motion.div
          key="intro-logo"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "fadeOut" ? 0 : 1 }}
          transition={{
            duration: INTRO_LOGO_FADE_DURATION,
            ease: "linear",
          }}
          onAnimationComplete={() => {
            if (phase === "fadeOut") onFadeOutComplete();
          }}
        >
          <Image
            src="/images/onnaton-logo.jpg"
            alt="恩納豚 ONNATON"
            width={200}
            height={200}
            priority
            className="h-auto w-[200px] object-contain sm:w-[240px] lg:w-[260px]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
