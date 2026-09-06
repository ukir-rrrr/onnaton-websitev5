"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { submitReservation, type ReservationState } from "@/app/actions/reservation";
import { courseMenus } from "@/lib/content/executiveCourse";
import {
  emptyDateOverrideLists,
  isClosedDate,
  isReservationCourseId,
  maxBookableDate,
  minBookableDate,
  reservationGuestIds,
  reservationTimeSlots,
  toDateOverrides,
  type DateOverrideLists,
} from "@/lib/content/reservation";
import { MultilineText } from "@/components/i18n/MultilineText";
import { DateField } from "@/components/ui/DateField";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";
import { ReserveButton } from "@/components/ui/ReserveButton";

const initialState: ReservationState = { ok: false };

const fieldClass =
  "w-full rounded-sm border border-cream/18 bg-ink-raised px-4 py-3.5 text-[15px] text-cream placeholder:text-cream/30 outline-none transition-colors [color-scheme:light] focus:border-gold";

const labelClass =
  "mb-2 block text-[11px] tracking-[0.18em] text-gold-ink sm:text-[12px]";

export function ReservationForm({
  initialCourse = "",
  overrides = emptyDateOverrideLists,
}: {
  initialCourse?: string;
  overrides?: DateOverrideLists;
}) {
  const [formKey, setFormKey] = useState(0);
  return (
    <ReservationFormInner
      key={formKey}
      initialCourse={initialCourse}
      overrides={overrides}
      onReset={() => setFormKey((n) => n + 1)}
    />
  );
}

function ReservationFormInner({
  initialCourse = "",
  overrides,
  onReset,
}: {
  initialCourse?: string;
  overrides: DateOverrideLists;
  onReset: () => void;
}) {
  const { t, trName, locale, isJa } = useT();
  const [state, formAction, pending] = useActionState(
    submitReservation,
    initialState,
  );
  const [dateValue, setDateValue] = useState("");
  const [dateHint, setDateHint] = useState(false);
  const [guests, setGuests] = useState("2");

  const minDate = useMemo(() => minBookableDate(), []);
  const maxDate = useMemo(() => maxBookableDate(), []);
  const dateOverrides = useMemo(() => toDateOverrides(overrides), [overrides]);
  const defaultCourse = isReservationCourseId(initialCourse)
    ? initialCourse
    : "";

  if (state.ok) {
    return (
      <div className="px-1 py-8 text-center sm:py-10">
        <p className="mb-4 text-[11px] tracking-[0.32em] text-gold-ink sm:text-[12px]">
          {t(copy.form.successKicker)}
        </p>
        <div className="mx-auto mb-6 h-px w-12 bg-gold-ink/55" />
        <h2 className="font-serif-jp mb-5 text-[24px] font-normal tracking-[0.12em] text-cream sm:text-[30px]">
          {t(copy.form.successTitle)}
        </h2>
        <p className="mx-auto mb-8 max-w-md text-[14px] leading-[2] tracking-[0.04em] text-cream/90 sm:text-[15px]">
          <MultilineText text={t(copy.form.successBody)} />
        </p>
        {state.reference ? (
          <p className="mb-10 text-[13px] tracking-[0.12em] text-gold-ink">
            {t(copy.form.reference)}
            <span className="mt-2 block font-serif-jp text-[20px] tracking-[0.14em] text-cream">
              {state.reference}
            </span>
          </p>
        ) : null}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-gold px-8 text-[14px] font-bold tracking-[0.08em] text-ink transition-colors hover:bg-cream sm:w-auto"
          >
            {t(copy.form.home)}
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-cream/25 px-8 text-[14px] font-bold tracking-[0.08em] text-cream transition-colors hover:border-gold-ink hover:text-gold-ink sm:w-auto"
          >
            {t(copy.form.another)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative flex flex-col gap-10">
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {isJa ? (
        <div className="border border-gold/30 bg-ink-raised px-5 py-6 text-center sm:px-8">
          <p className="mb-5 text-[14px] leading-[1.9] text-cream/92">
            {t(copy.form.jaPhoneNote)}
          </p>
          <ReserveButton className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] sm:w-auto sm:px-12" />
        </div>
      ) : null}

      {state.error ? (
        <p
          role="alert"
          className="border border-gold-ink/40 bg-gold/10 px-4 py-3 text-center text-[13px] leading-[1.8] text-gold-ink"
        >
          {state.error}
        </p>
      ) : null}

      <fieldset>
        <legend className="font-serif-jp mb-5 text-[18px] tracking-[0.12em] text-cream sm:text-[20px]">
          {t(copy.form.details)}
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <p className="sm:col-span-2">
            <label htmlFor="reserve-name" className={labelClass}>
              {t(copy.form.name)} *
            </label>
            <input
              id="reserve-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              maxLength={80}
              className={fieldClass}
            />
          </p>
          <p>
            <label htmlFor="reserve-email" className={labelClass}>
              {t(copy.form.email)} *
            </label>
            <input
              id="reserve-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClass}
            />
          </p>
          <p>
            <label htmlFor="reserve-phone" className={labelClass}>
              {t(copy.form.phone)} *
            </label>
            <input
              id="reserve-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className={fieldClass}
            />
          </p>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-serif-jp mb-5 text-[18px] tracking-[0.12em] text-cream sm:text-[20px]">
          {t(copy.form.visit)}
        </legend>
        <div className="grid min-w-0 gap-5 sm:grid-cols-2">
          <div className="min-w-0 max-w-full">
            <label htmlFor="reserve-date" className={labelClass}>
              {t(copy.form.date)} *
            </label>
            <DateField
              id="reserve-date"
              name="date"
              required
              min={minDate}
              max={maxDate}
              value={dateValue}
              overrides={overrides}
              onChange={(event) => {
                const next = event.target.value;
                if (next && isClosedDate(next, dateOverrides)) {
                  setDateValue("");
                  setDateHint(true);
                  return;
                }
                setDateHint(false);
                setDateValue(next);
              }}
            />
            {dateHint ? (
              <span className="mt-2 block text-[12px] leading-[1.7] text-gold-ink/80">
                {t(copy.form.errorDate)}
              </span>
            ) : null}
          </div>
          <p>
            <label htmlFor="reserve-time" className={labelClass}>
              {t(copy.form.time)} *
            </label>
            <select
              id="reserve-time"
              name="time"
              required
              defaultValue=""
              className={fieldClass}
            >
              <option value="" disabled>
                —
              </option>
              {reservationTimeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </p>
          <p>
            <label htmlFor="reserve-guests" className={labelClass}>
              {t(copy.form.guests)} *
            </label>
            <select
              id="reserve-guests"
              name="guests"
              required
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className={fieldClass}
            >
              {reservationGuestIds.map((id) => (
                <option key={id} value={id}>
                  {id === "9plus" ? t(copy.form.guests9) : id}
                </option>
              ))}
            </select>
            {guests === "9plus" ? (
              <span className="mt-2 block text-[12px] leading-[1.7] text-cream/75">
                {t(copy.form.guests9note)}
              </span>
            ) : null}
          </p>
          <fieldset className="sm:col-span-2">
            <legend className={labelClass}>{t(copy.form.seating)} *</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(
                [
                  ["tatami", copy.form.seatingTatami],
                  ["table", copy.form.seatingTable],
                  ["either", copy.form.seatingEither],
                ] as const
              ).map(([id, label]) => (
                <label
                  key={id}
                  className="flex min-h-12 cursor-pointer items-center justify-center border border-cream/18 bg-ink-raised px-3 text-[13px] tracking-[0.08em] text-cream/92 has-[:checked]:border-gold-ink has-[:checked]:text-gold-ink"
                >
                  <input
                    type="radio"
                    name="seating"
                    value={id}
                    defaultChecked={id === "either"}
                    required
                    className="sr-only"
                  />
                  {t(label)}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-serif-jp mb-5 text-[18px] tracking-[0.12em] text-cream sm:text-[20px]">
          {t(copy.form.courseHeading)} *
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {courseMenus.map((course) => (
            <label
              key={course.id}
              className="flex cursor-pointer flex-col gap-1 border border-cream/18 bg-ink-raised px-4 py-4 has-[:checked]:border-gold"
            >
              <input
                type="radio"
                name="course"
                value={course.id}
                defaultChecked={defaultCourse === course.id}
                required
                className="sr-only"
              />
              <span className="font-serif-jp text-[15px] tracking-[0.06em] text-cream">
                {trName(course.name)}
              </span>
              <span className="text-[13px] text-gold-ink">
                {course.priceMainMobile}
                <span className="ml-2 text-[11px] tracking-[0.08em] text-cream/70">
                  {t(copy.form.perPerson)}
                </span>
              </span>
            </label>
          ))}
          <label className="flex cursor-pointer items-center border border-cream/18 bg-ink-raised px-4 py-4 has-[:checked]:border-gold sm:col-span-2">
            <input
              type="radio"
              name="course"
              value="undecided"
              defaultChecked={defaultCourse === "undecided"}
              required
              className="sr-only"
            />
            <span className="text-[14px] tracking-[0.06em] text-cream/92">
              {t(copy.form.courseUndecided)}
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-serif-jp mb-5 text-[18px] tracking-[0.12em] text-cream sm:text-[20px]">
          {t(copy.form.notesHeading)}
        </legend>
        <p className="mb-6">
          <label htmlFor="reserve-notes" className={labelClass}>
            {t(copy.form.notes)}
          </label>
          <textarea
            id="reserve-notes"
            name="notes"
            rows={4}
            maxLength={1000}
            placeholder={t(copy.form.notesPh)}
            className={`${fieldClass} resize-y`}
          />
        </p>
        <div className="flex flex-col gap-4">
          <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[1.8] text-cream/92">
            <input
              type="checkbox"
              name="agreeChildren"
              required
              className="mt-1 size-4 shrink-0 accent-gold"
            />
            <span>
              {t(copy.form.agreeChildren)}
              <Link
                href="/#children"
                className="ml-2 text-gold-ink underline-offset-4 hover:underline"
              >
                {t(copy.form.childrenLink)}
              </Link>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-[1.8] text-cream/92">
            <input
              type="checkbox"
              name="agreeTattoo"
              required
              className="mt-1 size-4 shrink-0 accent-gold"
            />
            <span>
              {t(copy.form.agreeTattoo)}
              <Link
                href="/#tattoo"
                className="ml-2 text-gold-ink underline-offset-4 hover:underline"
              >
                {t(copy.form.tattooLink)}
              </Link>
            </span>
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-sm bg-gold px-8 text-[14px] font-bold tracking-[0.14em] text-ink transition-colors hover:bg-cream disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[280px] sm:self-center"
      >
        {pending ? t(copy.form.sending) : t(copy.form.submit)}
      </button>
    </form>
  );
}
