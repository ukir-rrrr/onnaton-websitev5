"use server";

import { courseMenus } from "@/lib/content/executiveCourse";
import {
  isBookableDate,
  isReservationCourseId,
  isReservationGuestId,
  isReservationSeatingId,
  isReservationTimeSlot,
  toDateOverrides,
} from "@/lib/content/reservation";
import { getReservationDateOverrideLists } from "@/lib/supabase/date-overrides";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { copy } from "@/lib/i18n/copy";
import { t, type Localized } from "@/lib/i18n/types";

export type ReservationState = {
  ok: boolean;
  error?: string;
  reference?: string;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function localeFromForm(formData: FormData): Locale {
  const value = str(formData, "locale");
  return isLocale(value) ? value : "en";
}

function err(locale: Locale, message: Localized): ReservationState {
  return { ok: false, error: t(locale, message) };
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15 && value.length <= 32;
}

function referenceCode(): string {
  const stamp = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ONN-${stamp}-${rand}`;
}

export async function submitReservation(
  _prev: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const locale = localeFromForm(formData);

  if (str(formData, "website")) {
    return { ok: true, reference: referenceCode() };
  }

  const name = str(formData, "name");
  const email = str(formData, "email");
  const phone = str(formData, "phone");
  const date = str(formData, "date");
  const time = str(formData, "time");
  const guests = str(formData, "guests");
  const courseId = str(formData, "course");
  const seating = str(formData, "seating");
  const notes = str(formData, "notes");
  const agreeChildren = formData.get("agreeChildren") === "on";
  const agreeTattoo = formData.get("agreeTattoo") === "on";

  if (!name || !email || !phone || !date || !time || !guests || !courseId || !seating) {
    return err(locale, copy.form.errorRequired);
  }
  if (!looksLikeEmail(email)) return err(locale, copy.form.errorEmail);
  if (!looksLikePhone(phone)) return err(locale, copy.form.errorPhone);
  const dateOverrides = toDateOverrides(await getReservationDateOverrideLists());
  if (!isBookableDate(date, new Date(), dateOverrides)) {
    return err(locale, copy.form.errorDate);
  }
  if (!isReservationTimeSlot(time)) return err(locale, copy.form.errorTime);
  if (!isReservationGuestId(guests)) return err(locale, copy.form.errorRequired);
  if (!isReservationCourseId(courseId)) return err(locale, copy.form.errorCourse);
  if (!isReservationSeatingId(seating)) return err(locale, copy.form.errorRequired);
  if (!agreeChildren || !agreeTattoo) return err(locale, copy.form.errorAgree);
  if (notes.length > 1000) return err(locale, copy.form.errorGeneric);
  if (name.length > 80) return err(locale, copy.form.errorRequired);

  const course =
    courseId === "undecided"
      ? t(locale, copy.form.courseUndecided)
      : (courseMenus.find((item) => item.id === courseId)?.name ?? courseId);

  const seatingLabel =
    seating === "tatami"
      ? t(locale, copy.form.seatingTatami)
      : seating === "table"
        ? t(locale, copy.form.seatingTable)
        : t(locale, copy.form.seatingEither);

  const guestsLabel =
    guests === "9plus" ? t(locale, copy.form.guests9) : guests;

  const reference = referenceCode();
  const payload = {
    reference,
    locale,
    name,
    email,
    phone,
    date,
    time,
    guests: guestsLabel,
    courseId,
    course,
    seating: seatingLabel,
    notes: notes || null,
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.RESERVATION_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error("[reservation] webhook failed", response.status);
        return err(locale, copy.form.errorGeneric);
      }
    } catch (error) {
      console.error("[reservation] webhook error", error);
      return err(locale, copy.form.errorGeneric);
    }
  }

  console.info("[reservation]", payload);
  return { ok: true, reference };
}
