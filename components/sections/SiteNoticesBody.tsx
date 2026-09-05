"use client";

import { motion, useReducedMotion } from "motion/react";
import { MultilineText } from "@/components/i18n/MultilineText";
import { revealFadeUp, staggerContainer, staggerItem } from "@/lib/motion/presets";

export type NoticeItem = {
  sortOrder: number;
  bodyJa: string;
  bodyEn: string;
};

interface SiteNoticesBodyProps {
  heading: string;
  emptyText: string;
  notices: NoticeItem[];
}

export function SiteNoticesBody({
  heading,
  emptyText,
  notices,
}: SiteNoticesBodyProps) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <div className="relative mx-auto max-w-2xl px-6 py-12 sm:px-10 sm:py-16 lg:max-w-[42rem] lg:py-20">
      <motion.div
        className="mb-8 flex flex-col items-center gap-3 sm:mb-10 sm:gap-4"
        {...revealFadeUp(reduceMotion, 0, 20)}
      >
        <p className="text-base font-medium tracking-[0.35em] text-gold-ink sm:text-[18px]">
          NOTICE
        </p>
        <div className="flex items-center gap-4">
          <motion.span
            className="hidden h-9 w-px origin-top bg-gold/50 sm:block"
            aria-hidden
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
          <h2 className="font-display-jp text-center text-[24px] font-medium tracking-[0.12em] text-cream sm:text-[30px] lg:text-[34px]">
            {heading}
          </h2>
          <motion.span
            className="hidden h-9 w-px origin-top bg-gold/50 sm:block"
            aria-hidden
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>

      {notices.length === 0 ? (
        <motion.p
          className="font-serif-jp text-center text-[16px] leading-[2.1] tracking-[0.04em] text-cream/88 sm:text-[18px]"
          {...revealFadeUp(reduceMotion, 0.12, 16)}
        >
          {emptyText}
        </motion.p>
      ) : (
        <motion.ul
          className="space-y-5 sm:space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer(0.12)}
        >
          {notices.map((notice) => (
            <motion.li
              key={notice.sortOrder}
              className="relative min-w-0 overflow-hidden rounded-md border border-gold/40 bg-white/30 px-5 py-5 shadow-[0_8px_28px_rgba(42,37,32,0.08)] backdrop-blur-[2px] sm:px-7 sm:py-6"
              variants={staggerItem(reduceMotion, 20)}
            >
              <span
                className="absolute inset-y-3 left-0 w-1 rounded-full bg-gold/80"
                aria-hidden
              />
              <div className="min-w-0 space-y-4 pl-3 text-center font-serif-jp text-[17px] leading-[2.05] tracking-[0.04em] text-cream sm:pl-4 sm:text-[19px] sm:leading-[2.12]">
                {notice.bodyJa.trim() ? (
                  <p className="max-w-full break-all font-medium">
                    <MultilineText text={notice.bodyJa} keepAll={false} />
                  </p>
                ) : null}
                {notice.bodyEn.trim() ? (
                  <p className="max-w-full break-words text-[15px] leading-[1.95] text-cream/90 sm:text-[16px]">
                    <MultilineText text={notice.bodyEn} keepAll={false} />
                  </p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
