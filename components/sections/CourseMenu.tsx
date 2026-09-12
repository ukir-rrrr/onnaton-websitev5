"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { photos } from "@/lib/content/photos";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";
import { revealFadeUp, revealScale } from "@/lib/motion/presets";

/**
 * Top-page course teaser: full-bleed photo → /course.
 * Hover: full dim + centered copy/CTA. Touch: bottom label + outline button.
 */
export function CourseMenu() {
  const { t } = useT();
  const reduceMotion = useReducedMotion() === true;

  return (
    <section id="course" className="scroll-mt-24 w-full">
      <Link
        href="/course"
        className="group relative block w-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-gold"
        aria-label={t(copy.courseTeaser.cta)}
      >
        <div className="relative h-[50vh] min-h-[300px] w-full sm:h-[90vh] sm:min-h-[360px]">
          <motion.div className="absolute inset-0" {...revealScale(reduceMotion, 0, 1.06)}>
            <Image
              src={photos.courseMenu}
              alt={t(copy.courseTeaser.alt)}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-[380ms] ease-out group-hover:scale-[1.03]"
              priority={false}
            />
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-black/0 transition-colors duration-[380ms] ease-out group-hover:bg-black/50 [@media(hover:hover)_and_(pointer:fine)]:block"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 hidden translate-y-3 flex-col items-center justify-center gap-4 px-6 text-center opacity-0 transition-all duration-[380ms] ease-out group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:flex">
          <p className="font-display-jp text-[28px] tracking-[0.14em] text-on-dark sm:text-[36px]">
            {t(copy.courseTeaser.heading)}
          </p>
          <p className="max-w-md text-[13px] leading-relaxed tracking-[0.04em] text-on-dark/80 sm:text-[14px]">
            {t(copy.courseTeaser.body)}
          </p>
          <span className="mt-2 inline-flex items-center border border-on-dark/75 px-8 py-3 text-[12px] tracking-[0.22em] text-on-dark">
            {t(copy.courseTeaser.cta)}
          </span>
        </div>

        <motion.div
          className="absolute right-5 bottom-5 left-5 flex justify-end sm:right-10 sm:bottom-8 sm:left-auto [@media(hover:hover)_and_(pointer:fine)]:hidden"
          {...revealFadeUp(reduceMotion, 0.28, 12)}
        >
          <span className="inline-flex min-h-11 items-center border border-on-dark/70 px-6 py-3 text-[13px] tracking-[0.18em] text-on-dark">
            {t(copy.courseTeaser.cta)}
          </span>
        </motion.div>
      </Link>
    </section>
  );
}
