"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { photos } from "@/lib/content/photos";
import { MultilineText } from "@/components/i18n/MultilineText";
import { Reveal } from "@/components/motion/Reveal";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";
import { revealFadeUp, revealScale, staggerContainer, staggerItem } from "@/lib/motion/presets";

/**
 * ⑫ Mobile shows the text as one naturally-wrapped block (text-pretty avoids
 * mid-phrase breaks and 1-2 char orphans); PC keeps the designed `\n` breaks.
 */
function CardText({ text }: { text: string }) {
  return (
    <>
      <span className="sm:hidden">{text.replace(/\n/g, "")}</span>
      <span className="hidden sm:inline">
        <MultilineText text={text} keepAll={false} />
      </span>
    </>
  );
}

function PolicyCard({
  id,
  heading,
  lead,
  paragraphs,
  note,
  closing,
  reduceMotion,
}: {
  id: string;
  heading: string;
  lead: string;
  paragraphs: readonly string[];
  note?: string;
  closing?: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      id={id}
      className="scroll-mt-24 w-full min-w-0 overflow-x-clip overflow-y-clip rounded-sm border border-cream/10 bg-ink-raised px-5 py-10 sm:px-12 sm:py-14"
      variants={staggerItem(reduceMotion, 32)}
    >
      <h3 className="font-serif-jp mb-6 max-w-full break-words text-center text-[18px] font-normal leading-[1.75] tracking-[0.04em] text-cream sm:mb-8 sm:text-[28px] sm:leading-[1.6] sm:tracking-[0.12em] xl:text-[30px]">
        {heading}
      </h3>
      <p className="font-serif-jp mb-8 max-w-full text-pretty break-words text-[15px] leading-[2.05] tracking-[0.04em] text-cream sm:mb-10 sm:text-[18px] sm:leading-[2.15]">
        <CardText text={lead} />
      </p>
      <div className="font-serif-jp max-w-full space-y-6 text-pretty break-words text-[15px] leading-[2.1] tracking-[0.04em] text-cream/92 sm:space-y-7 sm:text-[18px] sm:leading-[2.2]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>
            <CardText text={paragraph} />
          </p>
        ))}
      </div>
      {note ? (
        <p className="mt-8 max-w-full text-pretty break-words text-[14px] leading-[2.05] tracking-[0.04em] text-cream/82 sm:mt-10 sm:text-[16px] sm:leading-[2.15]">
          ※<CardText text={note} />
        </p>
      ) : null}
      {closing ? (
        <p className="mt-6 max-w-full text-pretty break-words text-[15px] leading-[2.05] tracking-[0.04em] text-cream/95 sm:text-[17px] sm:leading-[2.15]">
          <CardText text={closing} />
        </p>
      ) : null}
    </motion.article>
  );
}

export function Reserve() {
  const { t } = useT();
  const reduceMotion = useReducedMotion() === true;

  const policies = [
    {
      id: "children",
      heading: t(copy.children.heading),
      lead: t(copy.children.lead),
      paragraphs: [t(copy.children.p1), t(copy.children.p2)],
      note: t(copy.children.note),
      closing: t(copy.children.closing),
    },
    {
      id: "tattoo",
      heading: t(copy.tattoo.heading),
      lead: t(copy.tattoo.lead),
      paragraphs: [t(copy.tattoo.p1)],
    },
    {
      id: "fragrance",
      heading: t(copy.fragrance.heading),
      lead: t(copy.fragrance.lead),
      paragraphs: [t(copy.fragrance.p1)],
    },
  ];

  return (
    <section id="reserve" className="scroll-mt-24 min-w-0 overflow-x-clip overflow-y-clip">
      <div className="relative w-full min-w-0 sm:min-h-[560px] xl:aspect-[19/10] xl:max-h-[min(90vh,820px)]">
        <motion.div className="absolute inset-0" {...revealScale(reduceMotion, 0, 1.06)}>
          <Image
            src={photos.reservation01}
            alt=""
            fill
            aria-hidden
            sizes="100vw"
            className="object-cover object-[100%_52%] sm:object-[90%_52%] xl:object-[50%_85%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 flex w-full min-w-0 flex-col items-center px-6 py-20 text-center sm:px-10 sm:py-16 md:py-20 lg:px-14 xl:absolute xl:inset-0 xl:justify-center xl:overflow-visible xl:py-16">
          <Reveal variant="fadeUp" delay={0.08} amount={0.2} className="mb-8 w-full min-w-0 max-w-full">
            <SectionEyebrow
              eyebrow="RESERVATION"
              heading={t(copy.reserveSection.heading)}
              tone="onDark"
            />
          </Reveal>

          <Reveal variant="fadeUp" delay={0.18} amount={0.2} className="w-full min-w-0 max-w-full">
            <p className="mx-auto mb-6 min-w-0 max-w-[720px] break-words text-[14px] leading-[2] text-on-dark/80 sm:mb-8 sm:text-base">
              <MultilineText text={t(copy.reserveSection.body)} keepAll={false} />
            </p>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.28} amount={0.2} className="w-full min-w-0 max-w-full">
            <div className="mx-auto mb-8 min-w-0 max-w-[720px] sm:mb-10">
              <p className="break-words text-[13px] leading-[1.9] tracking-[0.04em] text-gold sm:text-[14px]">
                <MultilineText text={t(copy.children.lead)} keepAll={false} />
              </p>
              <a
                href="#children"
                className="mt-1 inline-flex min-h-11 items-center text-[12px] tracking-[0.06em] text-on-dark/55 underline-offset-4 transition-colors hover:text-gold hover:underline sm:text-[13px]"
              >
                {t(copy.children.more)} →
              </a>
            </div>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.38} amount={0.2} className="w-full min-w-0 max-w-full">
            <ReserveButton
              variant="outline"
              tone="onDark"
              className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] sm:min-w-[320px] sm:w-auto sm:px-16"
            />
            <p className="mx-auto mt-6 max-w-[720px] break-words text-[12px] leading-[1.9] tracking-[0.04em] text-on-dark/55 sm:text-[13px]">
              <MultilineText text={t(copy.hero.note)} keepAll={false} />
            </p>
          </Reveal>
        </div>
      </div>

      <div className="min-w-0 overflow-x-clip overflow-y-clip px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <motion.div
          className="mx-auto flex w-full min-w-0 max-w-[42rem] flex-col gap-8 sm:gap-10 xl:max-w-[46rem]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={staggerContainer(0.14)}
        >
          {policies.map((policy) => (
            <PolicyCard key={policy.id} {...policy} reduceMotion={reduceMotion} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
