"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  INTRO_HERO_REVEAL_DURATION,
  INTRO_LOGO_FADE_DURATION,
} from "@/lib/motion/diagonalWipe";

export type IntroPhase = "logo" | "fadeLogo" | "fadeWhite" | "ready";

interface PageIntroProps {
  phase: IntroPhase;
}

/** Logo on white → white only → reveal hero underneath. Timing is driven by Hero. */
export function PageIntro({ phase }: PageIntroProps) {
  const showPlate = phase !== "ready";

  return (
    <AnimatePresence>
      {showPlate ? (
        <motion.div
          key="intro-plate"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "fadeWhite" ? 0 : 1 }}
          transition={{
            duration: INTRO_HERO_REVEAL_DURATION,
            ease: "linear",
          }}
        >
          <motion.div
            initial={false}
            animate={{
              opacity: phase === "logo" ? 1 : 0,
            }}
            transition={{
              duration: INTRO_LOGO_FADE_DURATION,
              ease: "linear",
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
