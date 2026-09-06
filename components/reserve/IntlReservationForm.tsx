"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import {
  submitIntlReservation,
} from "@/app/actions/intl-reservation";
import {
  defaultIntlReservationFormValues,
  type IntlReservationFormValues,
  type IntlReservationState,
} from "@/lib/reserve/intl-form";
import {
  emptyDateOverrideLists,
  isClosedDate,
  maxBookableDate,
  minBookableDate,
  toDateOverrides,
  type DateOverrideLists,
} from "@/lib/content/reservation";
import { countryDialCodes } from "@/lib/content/countryCodes";
import { referralSourceIds } from "@/lib/content/referralSources";
import { MultilineText } from "@/components/i18n/MultilineText";
import { DateField } from "@/components/ui/DateField";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";

const initialState: IntlReservationState = { ok: false };

const fieldClass =
  "w-full rounded-sm border border-cream/18 bg-ink-raised px-4 py-3.5 text-[15px] text-cream placeholder:text-cream/30 outline-none transition-colors [color-scheme:light] focus:border-gold";

const labelClass =
  "mb-2 block text-[11px] tracking-[0.18em] text-gold-ink sm:text-[12px]";

type DateFieldKey = "datePreference1" | "datePreference2" | "datePreference3";

const dateFieldNames: Record<DateFieldKey, string> = {
  datePreference1: "date_preference_1",
  datePreference2: "date_preference_2",
  datePreference3: "date_preference_3",
};

function closedDateHints(
  values: IntlReservationFormValues,
  overrides: DateOverrideLists,
): Record<DateFieldKey, boolean> {
  const map = toDateOverrides(overrides);
  return {
    datePreference1: Boolean(values.datePreference1 && isClosedDate(values.datePreference1, map)),
    datePreference2: Boolean(values.datePreference2 && isClosedDate(values.datePreference2, map)),
    datePreference3: Boolean(values.datePreference3 && isClosedDate(values.datePreference3, map)),
  };
}

export function IntlReservationForm({
  overrides = emptyDateOverrideLists,
}: {
  overrides?: DateOverrideLists;
}) {
  const [formKey, setFormKey] = useState(0);
  return (
    <IntlReservationFormInner
      key={formKey}
      overrides={overrides}
      onReset={() => setFormKey((n) => n + 1)}
    />
  );
}

function IntlReservationFormInner({
  overrides,
  onReset,
}: {
  overrides: DateOverrideLists;
  onReset: () => void;
}) {
  const { t, locale } = useT();
  const [state, formAction, pending] = useActionState(
    submitIntlReservation,
    initialState,
  );
  const [fields, setFields] = useState(defaultIntlReservationFormValues);

  const minDate = useMemo(() => minBookableDate(), []);
  const maxDate = useMemo(() => maxBookableDate(), []);
  const dateHints = useMemo(() => closedDateHints(fields, overrides), [fields, overrides]);

  const setField = <K extends keyof IntlReservationFormValues>(
    key: K,
    value: IntlReservationFormValues[K],
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  if (state.ok) {
    return (
      <div className="px-1 py-8 text-center sm:py-10">
        <p className="mb-4 text-[11px] tracking-[0.32em] text-gold-ink sm:text-[12px]">
          {t(copy.intlForm.successKicker)}
        </p>
        <div className="mx-auto mb-6 h-px w-12 bg-gold-ink/55" />
        <h2 className="font-serif-jp mb-5 text-[24px] font-normal tracking-[0.12em] text-cream sm:text-[30px]">
          {t(copy.intlForm.successTitle)}
        </h2>
        <p className="mx-auto mb-8 max-w-md text-[14px] leading-[2] tracking-[0.04em] text-cream/90 sm:text-[15px]">
          <MultilineText text={t(copy.intlForm.successBody)} keepAll={false} />
        </p>
        <p className="mx-auto mb-10 max-w-md border-y border-gold-ink/40 py-4 text-[14px] font-medium leading-[1.9] tracking-[0.04em] text-gold-ink sm:text-[15px]">
          <MultilineText text={t(copy.intlForm.successFinalNote)} keepAll={false} />
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-gold px-8 text-[14px] font-bold tracking-[0.08em] text-ink transition-colors hover:bg-cream sm:w-auto"
          >
            {t(copy.intlForm.home)}
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-cream/25 px-8 text-[14px] font-bold tracking-[0.08em] text-cream transition-colors hover:border-gold-ink hover:text-gold-ink sm:w-auto"
          >
            {t(copy.intlForm.another)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative flex w-full min-w-0 max-w-full flex-col gap-10 overflow-x-clip">
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="border border-gold-ink/40 bg-gold/10 px-4 py-3 text-center text-[13px] leading-[1.8] text-gold-ink"
        >
          {state.error}
        </p>
      ) : null}

      <label className="flex cursor-pointer items-start gap-3 border-b border-cream/12 pb-8 text-[14px] leading-[1.9] text-cream/95">
        <input
          type="checkbox"
          name="agreePolicy"
          checked={fields.agreePolicy}
          onChange={(event) => setField("agreePolicy", event.target.checked)}
          required
          className="mt-1 size-4 shrink-0 accent-gold"
        />
        <span>{t(copy.intlForm.agreePolicy)}</span>
      </label>

      <fieldset>
        <legend className="font-serif-jp mb-5 text-[18px] tracking-[0.12em] text-cream sm:text-[20px]">
          {t(copy.intlForm.details)}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <p className="sm:col-span-2">
            <label htmlFor="intl-name" className={labelClass}>
              {t(copy.intlForm.name)} *
            </label>
            <input
              id="intl-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              maxLength={80}
              value={fields.name}
              onChange={(event) => setField("name", event.target.value)}
              className={fieldClass}
            />
          </p>
          <p className="sm:col-span-2">
            <label htmlFor="intl-email" className={labelClass}>
              {t(copy.intlForm.email)} *
            </label>
            <input
              id="intl-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={fields.email}
              onChange={(event) => setField("email", event.target.value)}
              className={fieldClass}
            />
          </p>
          <p className="sm:col-span-2">
            <label htmlFor="intl-phone-national" className={labelClass}>
              {t(copy.intlForm.phone)} *
            </label>
            <span className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
              <select
                id="intl-phone-country"
                name="phone_country"
                required
                aria-label={t(copy.intlForm.phoneCountry)}
                value={fields.phoneCountry}
                onChange={(event) => setField("phoneCountry", event.target.value)}
                className={fieldClass}
              >
                <option value="" disabled>
                  {t(copy.intlForm.phoneCountryPh)}
                </option>
                {countryDialCodes.map((code) => (
                  <option key={code.id} value={code.id}>
                    {`${code.name} (${code.dial})`}
                  </option>
                ))}
              </select>
              <input
                id="intl-phone-national"
                name="phone_national"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                required
                maxLength={20}
                value={fields.phoneNational}
                onChange={(event) => setField("phoneNational", event.target.value)}
                className={fieldClass}
              />
            </span>
          </p>
        </div>
      </fieldset>

      <fieldset className="min-w-0 w-full max-w-full">
        <legend className="font-serif-jp mb-3 text-[18px] tracking-[0.12em] text-cream sm:text-[20px]">
          {t(copy.intlForm.visit)}
        </legend>
        <p className="mb-5 text-[13px] leading-[1.9] tracking-[0.04em] text-cream/88 sm:text-[14px]">
          {t(copy.intlForm.dateHint)}
        </p>
        {locale !== "ja" ? (
          <p className="mb-5 text-[12px] tracking-[0.06em] text-cream/65 sm:text-[13px]">
            {t(copy.intlForm.dateFormat)}
          </p>
        ) : null}
        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          {(
            [
              ["datePreference1", copy.intlForm.date1, true],
              ["datePreference2", copy.intlForm.date2, false],
              ["datePreference3", copy.intlForm.date3, false],
            ] as const
          ).map(([key, label, required]) => (
            <div
              key={key}
              className={`min-w-0 max-w-full ${key === "datePreference1" ? "sm:col-span-2" : ""}`}
            >
              <label htmlFor={`intl-${key}`} className={labelClass}>
                {t(label)} {required ? "*" : ""}
              </label>
              <DateField
                id={`intl-${key}`}
                name={dateFieldNames[key]}
                required={required}
                min={minDate}
                max={maxDate}
                value={fields[key]}
                overrides={overrides}
                onChange={(event) => setField(key, event.target.value)}
              />
              {dateHints[key] ? (
                <span className="mt-2 block text-[12px] leading-[1.7] text-gold-ink/80">
                  {t(copy.intlForm.errorDate)}
                </span>
              ) : null}
            </div>
          ))}
          <p>
            <label htmlFor="intl-adults" className={labelClass}>
              {t(copy.intlForm.adults)} *
            </label>
            <input
              id="intl-adults"
              name="adults"
              type="number"
              required
              min={1}
              max={20}
              value={fields.adults}
              onChange={(event) => setField("adults", event.target.value)}
              className={fieldClass}
            />
          </p>
          <p>
            <label htmlFor="intl-age-0-5" className={labelClass}>
              {t(copy.intlForm.age0to5)}
            </label>
            <input
              id="intl-age-0-5"
              name="age_0_5"
              type="number"
              min={0}
              max={10}
              value={fields.age0to5}
              onChange={(event) => setField("age0to5", event.target.value)}
              className={fieldClass}
            />
          </p>
          <p>
            <label htmlFor="intl-age-6-12" className={labelClass}>
              {t(copy.intlForm.age6to12)}
            </label>
            <input
              id="intl-age-6-12"
              name="age_6_12"
              type="number"
              min={0}
              max={10}
              value={fields.age6to12}
              onChange={(event) => setField("age6to12", event.target.value)}
              className={fieldClass}
            />
          </p>
          <p>
            <label htmlFor="intl-age-13-19" className={labelClass}>
              {t(copy.intlForm.age13to19)}
            </label>
            <input
              id="intl-age-13-19"
              name="age_13_19"
              type="number"
              min={0}
              max={10}
              value={fields.age13to19}
              onChange={(event) => setField("age13to19", event.target.value)}
              className={fieldClass}
            />
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend className="sr-only">{t(copy.intlForm.details)}</legend>
        <p className="mb-5">
          <label htmlFor="intl-country" className={labelClass}>
            {t(copy.intlForm.country)} *
          </label>
          <input
            id="intl-country"
            name="country"
            type="text"
            required
            autoComplete="country-name"
            maxLength={80}
            value={fields.country}
            onChange={(event) => setField("country", event.target.value)}
            className={fieldClass}
          />
        </p>
        <p className="mb-5">
          <label htmlFor="intl-referral" className={labelClass}>
            {t(copy.intlForm.referralLabel)} *
          </label>
          <select
            id="intl-referral"
            name="referral_source"
            required
            value={fields.referralSource}
            onChange={(event) => setField("referralSource", event.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              {t(copy.intlForm.referralPh)}
            </option>
            {referralSourceIds.map((id) => (
              <option key={id} value={id}>
                {t(copy.intlForm[id])}
              </option>
            ))}
          </select>
        </p>
      </fieldset>

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-gold px-8 text-[14px] font-bold tracking-[0.14em] text-ink transition-colors hover:bg-cream disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[280px]"
        >
          {pending ? t(copy.intlForm.sending) : t(copy.intlForm.submit)}
        </button>
        <p className="max-w-md text-center text-[12px] leading-[1.75] tracking-[0.02em] text-cream/70">
          <MultilineText text={t(copy.intlForm.submitDisclaimer)} keepAll={false} />
        </p>
      </div>
    </form>
  );
}
