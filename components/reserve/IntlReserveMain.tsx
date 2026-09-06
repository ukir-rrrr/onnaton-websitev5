"use client";

import { useState } from "react";
import { IntlReservationForm } from "@/components/reserve/IntlReservationForm";
import { MultilineText } from "@/components/i18n/MultilineText";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";
import type { ReservationPolicy } from "@/lib/content/reservationPolicy";
import type { DateOverrideLists } from "@/lib/content/reservation";

export function IntlReserveMain({
  policy,
  overrides,
}: {
  policy: ReservationPolicy;
  overrides: DateOverrideLists;
}) {
  const { t, isJa } = useT();
  const [showOverseasForm, setShowOverseasForm] = useState(false);

  if (isJa && !showOverseasForm) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 sm:gap-12">
        <p className="text-center font-serif-jp text-[17px] font-medium tracking-[0.08em] text-cream sm:text-[19px]">
          <MultilineText text={t(copy.intlForm.closed)} keepAll={false} />
        </p>

        <div className="border border-cream/10 bg-ink-raised px-5 py-10 text-center sm:px-8 sm:py-12 lg:px-10 lg:py-14">
          <p className="mb-8 text-[14px] leading-[2.1] tracking-[0.04em] text-cream/92 sm:text-[15px] sm:leading-[2.2]">
            <MultilineText text={t(copy.intlForm.domesticLead)} />
          </p>

          <p className="mb-2 text-xs tracking-[0.28em] text-gold-ink sm:text-[12px]">
            {t(copy.reserve.phoneLabel)}
          </p>
          <p className="mb-10 text-[13px] leading-[1.8] tracking-[0.04em] text-cream/82">
            {t(copy.reserve.hours)}
          </p>

          <ReserveButton
            variant="solid"
            className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] sm:min-w-[280px] sm:w-auto sm:px-12"
          />
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowOverseasForm(true)}
            className="group inline-flex min-h-11 flex-col items-center justify-center gap-1 px-4 py-2 text-[13px] tracking-[0.06em] text-cream/75 transition-colors hover:text-gold-ink sm:text-[14px]"
          >
            <span className="underline-offset-4 group-hover:underline">
              {t(copy.intlForm.overseasToggle)}
            </span>
            <span className="text-[12px] tracking-[0.04em] text-cream/55 sm:text-[13px]">
              {t(copy.intlForm.overseasToggleHint)} →
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 sm:gap-12">
      <p className="text-center font-serif-jp text-[17px] font-medium tracking-[0.08em] text-cream sm:text-[19px]">
        <MultilineText text={t(copy.intlForm.closed)} keepAll={false} />
      </p>

      {isJa ? (
        <p className="border-y border-cream/12 py-8 text-center text-[14px] leading-[2] tracking-[0.04em] text-gold-ink/95 sm:text-[15px] sm:leading-[2.1]">
          <MultilineText text={t(copy.intlForm.overseasFormNote)} />
        </p>
      ) : (
        <p className="border-y border-cream/12 py-8 text-center text-[14px] leading-[2] tracking-[0.04em] text-cream/92 sm:text-[15px] sm:leading-[2.1]">
          <MultilineText text={t(copy.intlForm.phoneNotice)} />
        </p>
      )}

      <div>
        <h2 className="font-serif-jp mb-6 text-center text-[20px] tracking-[0.12em] text-cream sm:text-[22px]">
          {t(copy.intlForm.policyHeading)}
        </h2>
        <ul className="mx-auto max-w-2xl list-disc space-y-3 pl-5 text-[14px] leading-[2] tracking-[0.04em] text-cream/95 sm:text-[15px]">
          {policy.bullets.map((item) => (
            <li key={item}>
              <MultilineText text={item} keepAll={false} />
            </li>
          ))}
        </ul>
        {policy.notes.length > 0 ? (
          <div className="mx-auto mt-4 max-w-2xl space-y-2 text-[13px] leading-[1.9] tracking-[0.04em] text-cream/75">
            {policy.notes.map((note) => (
              <p key={note}>
                <MultilineText text={note} keepAll={false} />
              </p>
            ))}
          </div>
        ) : null}
      </div>

      <div className="min-w-0 overflow-x-clip border border-cream/10 bg-ink-raised px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <IntlReservationForm overrides={overrides} />
      </div>
    </div>
  );
}
