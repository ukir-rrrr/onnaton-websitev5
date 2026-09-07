"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { heroSlides } from "@/lib/content/heroSlides";
import {
  CLIP_COVER,
  CLIP_FULL,
  CLIP_OFF_RIGHT,
  INTRO_LOGO_HOLD_MS,
  WIPE_DURATION,
  WIPE_EASE,
} from "@/lib/motion/diagonalWipe";
import { PageIntro, type IntroPhase } from "@/components/hero/PageIntro";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { MultilineText } from "@/components/i18n/MultilineText";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const SLIDE_INTERVAL_MS = 6000;

export function Hero() {
  const { t, locale } = useT();
  const reduceMotion = useReducedMotion() === true;
  const [phase, setPhase] = useState<IntroPhase>("logo");
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const currentRef = useRef(0);
  const effectivePhase: IntroPhase = reduceMotion ? "ready" : phase;

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // ① logo hold → ② fade out (cross-fade to hero)
  useEffect(() => {
    if (reduceMotion || phase !== "logo") return;
    const id = window.setTimeout(() => setPhase("fadeOut"), INTRO_LOGO_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [phase, reduceMotion]);

  // Block scroll during intro without hiding the scrollbar (avoids layout jump)
  useEffect(() => {
    if (effectivePhase === "ready") return;
    const prevent = (event: Event) => {
      event.preventDefault();
    };
    document.addEventListener("wheel", prevent, { passive: false });
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      document.removeEventListener("wheel", prevent);
      document.removeEventListener("touchmove", prevent);
    };
  }, [effectivePhase]);

  // ④ auto slideshow — start after the copy rises from below
  useEffect(() => {
    if (effectivePhase !== "ready") return;
    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIncoming((pending) => {
          if (pending !== null) return pending;
          return (currentRef.current + 1) % heroSlides.length;
        });
      }, SLIDE_INTERVAL_MS);
    }, 1200);
    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [effectivePhase]);

  const showHeroMotion =
    effectivePhase === "fadeOut" || effectivePhase === "ready";
  const activeDot = incoming ?? current;
  const showCopy = effectivePhase === "ready";

  return (
    <>
      {effectivePhase !== "ready" && (
        <PageIntro
          phase={effectivePhase}
          onFadeOutComplete={() => setPhase("ready")}
        />
      )}

      <section
        id="top"
        className="relative aspect-[4/5] min-h-[560px] w-full overflow-hidden sm:aspect-[19/10] sm:min-h-[540px] md:min-h-[580px] sm:max-h-[100vh]"
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ scale: showHeroMotion ? 1 : 1.08 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0">
            <Image
              src={heroSlides[current].src}
              alt={heroSlides[current].alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[55%_72%] sm:object-[60%_center]"
            />
          </div>

          <AnimatePresence>
            {incoming !== null && (
              <motion.div
                key={`incoming-${incoming}`}
                className="absolute inset-0"
                initial={{ clipPath: CLIP_OFF_RIGHT }}
                animate={{
                  clipPath: [CLIP_OFF_RIGHT, CLIP_COVER, CLIP_FULL],
                }}
                transition={{
                  duration: WIPE_DURATION,
                  ease: WIPE_EASE,
                  times: [0, 0.85, 1],
                }}
                onAnimationComplete={() => {
                  setCurrent(incoming);
                  setIncoming(null);
                }}
              >
                <Image
                  src={heroSlides[incoming].src}
                  alt={heroSlides[incoming].alt}
                  fill
                  sizes="100vw"
                  className="object-cover object-[55%_72%] sm:object-[60%_center]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* PC: left-rail + light bottom wash */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/35 via-black/15 to-transparent sm:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-black/0 via-transparent to-black/35 sm:block" />
        {/* Mobile: darker full scrim so copy stays readable on bright meat */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/75 sm:hidden" />
        {/* Mobile: extra shade over the lower text band */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/55 via-black/25 to-transparent sm:hidden" />

        <motion.div
          className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: showCopy ? 1 : 0 }}
          transition={{ duration: 0.45, delay: showCopy ? 0.35 : 0 }}
          aria-label={`スライド ${activeDot + 1} / ${heroSlides.length}`}
        >
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={
                i === activeDot
                  ? "h-1.5 w-1.5 rounded-full bg-on-dark"
                  : "h-1.5 w-1.5 rounded-full bg-on-dark/35"
              }
            />
          ))}
        </motion.div>

        <motion.div
          className="absolute inset-0 z-10 flex items-start overflow-y-auto overscroll-contain px-5 pb-12 pt-28 sm:items-end sm:overflow-visible sm:px-12 sm:pb-10 sm:pt-20 md:pb-12 xl:items-center xl:px-16 xl:pb-0 xl:pt-14"
          initial={false}
          animate={{
            opacity: showCopy ? 1 : 0,
            y: showCopy ? 0 : 56,
          }}
          transition={{
            duration: 0.65,
            delay: showCopy ? 0.12 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className={`w-full ${locale === "en" ? "max-w-[42rem]" : "max-w-[36rem]"}`}
          >
            <p
              className={`font-serif-jp mb-1.5 font-normal tracking-[0.12em] text-[#e0c89a] [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:mb-2.5 sm:text-[#c4a574] sm:[text-shadow:none] ${
                locale === "en"
                  ? "text-[15px] leading-[1.5] sm:text-[18px] sm:tracking-[0.08em]"
                  : "text-[17px] sm:text-[20px]"
              }`}
            >
              {t(copy.hero.kicker)}
            </p>

            <p
              className={`font-serif-jp mb-4 font-normal tracking-[0.12em] text-[#e0c89a] [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:mb-6 sm:text-[#c4a574] sm:[text-shadow:none] ${
                locale === "en"
                  ? "flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-[1.5] sm:text-[15px]"
                  : "text-[13px] sm:text-[16px]"
              }`}
            >
              <span>{t(copy.hero.specialty)}</span>
              <span
                className="text-[#e0c89a]/80 sm:text-[#c4a574]/70"
                aria-hidden
              >
                ｜
              </span>
              <span>{t(copy.hero.reservation)}</span>
            </p>

            <h1
              className={`font-serif-jp mb-4 font-medium leading-[1.6] tracking-[0.06em] text-on-dark [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:mb-6 sm:leading-[1.7] sm:[text-shadow:none] ${
                locale === "en"
                  ? "text-[21px] sm:text-[36px] xl:text-[44px]"
                  : "text-[23px] sm:text-[40px] xl:text-[48px]"
              }`}
            >
              <span className="block">{t(copy.hero.h1a)}</span>
              <span className="block">{t(copy.hero.h1b)}</span>
              <span className="block">{t(copy.hero.h1c)}</span>
            </h1>

            <p
              className={`font-serif-jp mb-6 max-w-[28rem] leading-[1.9] tracking-[0.06em] text-on-dark/95 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:mb-8 sm:text-on-dark/85 sm:[text-shadow:none] ${
                locale === "en"
                  ? "max-w-none break-words text-[13px] leading-[1.85] sm:text-[14px] sm:leading-[2]"
                  : "text-[14px] sm:text-[15px] sm:leading-[2.1]"
              }`}
            >
              <span className="sm:hidden">
                <MultilineText
                  text={t(locale === "ja" ? copy.hero.bodyMobile : copy.hero.body)}
                  keepAll={locale !== "en"}
                />
              </span>
              <span className="hidden sm:inline">
                <MultilineText text={t(copy.hero.body)} keepAll={locale !== "en"} />
              </span>
            </p>

            <ReserveButton
              className="font-serif-jp mb-3 min-h-11 w-full max-w-sm rounded-none px-9 py-3.5 text-[14px] font-medium tracking-[0.18em] text-white hover:bg-on-dark hover:text-cream sm:w-auto sm:px-24 sm:py-3 sm:text-[14px]"
            />

            <p className="text-[12px] tracking-[0.04em] text-on-dark/75 [text-shadow:0_1px_3px_rgba(0,0,0,0.5)] sm:text-[13px] sm:text-on-dark/55 sm:[text-shadow:none]">
              <MultilineText text={t(copy.hero.note)} />
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
}
