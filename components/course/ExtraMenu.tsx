"use client";

import Image from "next/image";
import { extraGroups } from "@/lib/content/extras";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";
import { formatMenuPrice } from "@/lib/i18n/prices";
import { MultilineText } from "@/components/i18n/MultilineText";

export function ExtraMenu({ nextHref }: { nextHref?: string }) {
  const { t, tr, locale, isJa } = useT();
  return (
    <section
      id="extras"
      className="scroll-mt-24 w-full bg-ink px-5 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24"
    >
      <SectionEyebrow
        eyebrow="ADDITIONS"
        heading={t(copy.extras.heading)}
        className="mb-12 sm:mb-16"
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-16 sm:gap-20">
        {extraGroups.map((group) => {
          const photoAspect = group.photoAspectClass ?? "aspect-[4/3]";
          const photoClass = group.photoClassName ?? "object-cover object-center";

          return (
          <div
            key={group.heading}
            className={`grid grid-cols-1 items-start gap-8 xl:grid-cols-[1fr_0.85fr] xl:gap-14 ${group.sectionClassName ?? ""}`}
          >
            <div>
              <h3 className="font-serif-jp mb-3 border-b border-cream/25 pb-2 text-[20px] tracking-[0.12em] text-cream sm:text-[22px]">
                {tr(group.heading)}
              </h3>
              {group.note ? (
                <p className="mb-6 text-[13px] leading-[1.8] tracking-[0.04em] text-cream/90">
                  <MultilineText text={tr(group.note)} keepAll={false} />
                </p>
              ) : null}
              {group.items.length > 0 ? (
                <ul className="font-serif-jp divide-y divide-cream/10">
                  {group.items.map((item) => (
                    <li
                      key={`${item.name}-${item.amount ?? item.price}`}
                      className="flex items-baseline justify-between gap-4 py-3.5"
                    >
                      <span className="text-[15px] tracking-[0.06em] text-cream sm:text-[16px]">
                        {tr(item.name)}
                        {item.amount ? (
                          <span className="ml-3 text-[13px] text-cream/85">
                            {item.amount}
                          </span>
                        ) : null}
                      </span>
                      <span className="shrink-0 text-[15px] tracking-[0.04em] text-cream sm:text-[16px]">
                        {isJa ? item.price : formatMenuPrice(locale, item.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {group.photos.length > 0 ? (
              <div
                className={`grid gap-3 ${
                  group.photos.length > 1 ? "grid-cols-1 sm:grid-cols-3 xl:grid-cols-1" : ""
                }`}
              >
                {group.photos.map((photo) => (
                  <div
                    key={photo.src + photo.alt}
                    className={`relative overflow-hidden ${photoAspect}`}
                  >
                    <Image
                      src={photo.src}
                      alt={tr(photo.alt)}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      quality={90}
                      className={photoClass}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <ReserveButton className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] tracking-[0.14em] hover:bg-wipe hover:text-cream sm:w-auto sm:min-w-[280px]" />
      </div>

      {nextHref ? (
        <a
          href={nextHref}
          className="mt-10 flex min-h-11 items-center justify-center text-[22px] leading-none text-gold-ink/80 transition-colors hover:text-gold-ink sm:mt-12 sm:text-[26px]"
          aria-label={t(copy.extras.next)}
        >
          ▽
        </a>
      ) : null}
    </section>
  );
}
