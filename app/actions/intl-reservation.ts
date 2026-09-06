"use server";

import { notifyOwnerIntlReservation } from "@/lib/email/ownerNotification";
import { sendCustomerAutoReply } from "@/lib/email/customerAutoReply";
import { isBookableDate, toDateOverrides } from "@/lib/content/reservation";
import { getReservationDateOverrideLists } from "@/lib/supabase/date-overrides";
import { findCountryDialCode } from "@/lib/content/countryCodes";
import { isReferralSourceId } from "@/lib/content/referralSources";
import {
  type IntlReservationState,
  valuesFromIntlFormData,
} from "@/lib/reserve/intl-form";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { copy } from "@/lib/i18n/copy";
import { t, type Localized } from "@/lib/i18n/types";
import { insertIntlReservation } from "@/lib/supabase/reservations";
import { getClientIp } from "@/lib/security/client-ip";
import {
  checkQuota,
  INTL_AUTOREPLY_COOLDOWN_MS,
  INTL_SUBMIT_EMAIL_MAX,
  INTL_SUBMIT_EMAIL_WINDOW_MS,
  INTL_SUBMIT_IP_MAX,
  INTL_SUBMIT_IP_WINDOW_MS,
  isWithinCooldown,
  recordQuota,
  setCooldown,
} from "@/lib/security/rate-limit";

export type { IntlReservationFormValues, IntlReservationState } from "@/lib/reserve/intl-form";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function localeFromForm(formData: FormData): Locale {
  const value = str(formData, "locale");
  return isLocale(value) ? value : "en";
}

function err(
  locale: Locale,
  message: Localized,
  formData: FormData,
): IntlReservationState {
  return {
    ok: false,
    error: t(locale, message),
    values: valuesFromIntlFormData(formData),
  };
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

function parseOptionalDate(value: string): string | null {
  return value || null;
}

function parseCount(value: string, min: number, max: number): number | null {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

export async function submitIntlReservation(
  _prev: IntlReservationState,
  formData: FormData,
): Promise<IntlReservationState> {
  const locale = localeFromForm(formData);

  if (str(formData, "website")) {
    return { ok: true, reference: referenceCode() };
  }

  const values = valuesFromIntlFormData(formData);
  const name = values.name;
  const email = values.email;
  const phoneCountry = values.phoneCountry;
  const phoneNationalInput = values.phoneNational;
  const country = values.country;
  const date1 = values.datePreference1;
  const date2 = parseOptionalDate(values.datePreference2);
  const date3 = parseOptionalDate(values.datePreference3);
  const adults = parseCount(values.adults, 1, 20);
  const age0to5 = parseCount(values.age0to5, 0, 10);
  const age6to12 = parseCount(values.age6to12, 0, 10);
  const age13to19 = parseCount(values.age13to19, 0, 10);
  const referralSource = values.referralSource;
  const agreePolicy = values.agreePolicy;

  if (
    !name ||
    !email ||
    !phoneCountry ||
    !phoneNationalInput ||
    !country ||
    !referralSource ||
    !date1 ||
    adults === null ||
    age0to5 === null ||
    age6to12 === null ||
    age13to19 === null
  ) {
    return err(locale, copy.intlForm.errorRequired, formData);
  }
  if (!isReferralSourceId(referralSource)) {
    return err(locale, copy.intlForm.errorRequired, formData);
  }
  if (!looksLikeEmail(email)) return err(locale, copy.intlForm.errorEmail, formData);
  if (name.length > 80 || country.length > 80) {
    return err(locale, copy.intlForm.errorRequired, formData);
  }

  const dialInfo = findCountryDialCode(phoneCountry);
  if (!dialInfo) return err(locale, copy.intlForm.errorPhone, formData);
  if (!/^[0-9\s()-]+$/.test(phoneNationalInput)) {
    return err(locale, copy.intlForm.errorPhone, formData);
  }
  const phoneNational = phoneNationalInput.replace(/\D/g, "");
  if (phoneNational.length < 6 || phoneNational.length > 15) {
    return err(locale, copy.intlForm.errorPhone, formData);
  }
  const dateOverrides = toDateOverrides(await getReservationDateOverrideLists());
  if (!isBookableDate(date1, new Date(), dateOverrides)) {
    return err(locale, copy.intlForm.errorDate, formData);
  }
  if (date2 && !isBookableDate(date2, new Date(), dateOverrides)) {
    return err(locale, copy.intlForm.errorDate, formData);
  }
  if (date3 && !isBookableDate(date3, new Date(), dateOverrides)) {
    return err(locale, copy.intlForm.errorDate, formData);
  }

  const dates = [date1, date2, date3].filter(Boolean) as string[];
  if (new Set(dates).size !== dates.length) {
    return err(locale, copy.intlForm.errorDatesDistinct, formData);
  }

  if (!agreePolicy) {
    return err(locale, copy.intlForm.errorAgree, formData);
  }

  const ip = await getClientIp();
  const ipBucket = `intl_submit:ip:${ip}`;
  const emailBucket = `intl_submit:email:${email.toLowerCase()}`;

  const ipAllowed = await checkQuota(
    ipBucket,
    INTL_SUBMIT_IP_MAX,
    INTL_SUBMIT_IP_WINDOW_MS,
  );
  if (!ipAllowed) {
    return err(locale, copy.intlForm.errorRateLimit, formData);
  }

  const emailAllowed = await checkQuota(
    emailBucket,
    INTL_SUBMIT_EMAIL_MAX,
    INTL_SUBMIT_EMAIL_WINDOW_MS,
  );
  if (!emailAllowed) {
    return err(locale, copy.intlForm.errorRateLimit, formData);
  }

  const reference = referenceCode();
  const agreedAt = new Date().toISOString();
  const children = age0to5 + age6to12 + age13to19;
  const payload = {
    reference,
    name,
    email,
    phoneCountry,
    phoneCountryCode: dialInfo.dial,
    phoneNational,
    country,
    datePreference1: date1,
    datePreference2: date2,
    datePreference3: date3,
    adults,
    age0to5,
    age6to12,
    age13to19,
    children,
    referralSource,
    notes: null,
    locale,
    agreedAt,
  };

  const saved = await insertIntlReservation(payload);
  if (!saved.ok) return err(locale, copy.intlForm.errorGeneric, formData);

  await recordQuota(ipBucket, INTL_SUBMIT_IP_WINDOW_MS);
  await recordQuota(emailBucket, INTL_SUBMIT_EMAIL_WINDOW_MS);

  const ownerEmailed = await notifyOwnerIntlReservation(payload);
  if (!ownerEmailed.ok) {
    console.error("[reservation/intl] saved but owner email failed", reference);
  }

  const autoreplyBucket = `intl_autoreply:email:${email.toLowerCase()}`;
  if (await isWithinCooldown(autoreplyBucket)) {
    console.info("[reservation/intl] auto-reply skipped (cooldown)", reference);
  } else {
    const customerEmailed = await sendCustomerAutoReply(payload);
    if (!customerEmailed.ok) {
      console.error("[reservation/intl] saved but customer auto-reply failed", reference);
    } else if (!customerEmailed.skipped) {
      await setCooldown(autoreplyBucket, INTL_AUTOREPLY_COOLDOWN_MS);
    }
  }

  return { ok: true, reference };
}
