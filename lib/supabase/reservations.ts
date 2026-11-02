import { getSiteSlug, getSupabaseAdmin } from "./server";

export type IntlReservationInput = {
  reference: string;
  name: string;
  email: string;
  phoneCountry: string;
  phoneCountryCode: string;
  phoneNational: string;
  /** English label from `phoneCountry` dial-code id at submit time (not user free text). */
  country: string;
  okinawaArrivalDate: string | null;
  okinawaReturnDate: string | null;
  okinawaLongTermStay: boolean;
  datePreference1: string;
  datePreference2: string | null;
  datePreference3: string | null;
  adults: number;
  age0to5: number;
  age6to12: number;
  age13to19: number;
  children: number;
  referralSource: string;
  accommodation: string;
  accommodationAddress: string | null;
  notes: string | null;
  locale: string | null;
  agreedAt: string;
  /** キャンセルポリシーへの同意日時（ISO） */
  cancellationPolicyAgreedAt: string;
  /** 同意したキャンセルポリシーの版（`CANCELLATION_POLICY_VERSION`） */
  cancellationPolicyVersion: string;
};

/** PGRST204 / 42703 for the new consent columns only (other errors are not retried). */
function isMissingColumnError(error: { code?: string; message?: string }): boolean {
  return (
    (error.code === "PGRST204" || error.code === "42703") &&
    /cancellation_policy_/.test(error.message ?? "")
  );
}

async function getSiteId(siteSlug: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data: site } = await supabase
    .from("sites")
    .select("id")
    .eq("slug", siteSlug)
    .maybeSingle();

  return site?.id ?? null;
}

export async function insertIntlReservation(
  input: IntlReservationInput,
  siteSlug = getSiteSlug(),
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const siteId = await getSiteId(siteSlug);
  if (!siteId) return { ok: false, error: "Site not found" };

  const row = {
    site_id: siteId,
    reference: input.reference,
    status: "pending",
    name: input.name,
    email: input.email,
    phone_country: input.phoneCountry,
    phone_country_code: input.phoneCountryCode,
    phone_national: input.phoneNational,
    country: input.country,
    okinawa_arrival_date: input.okinawaArrivalDate,
    okinawa_return_date: input.okinawaReturnDate,
    okinawa_long_term_stay: input.okinawaLongTermStay,
    date_preference_1: input.datePreference1,
    date_preference_2: input.datePreference2,
    date_preference_3: input.datePreference3,
    adults: input.adults,
    age_0_5: input.age0to5,
    age_6_12: input.age6to12,
    age_13_19: input.age13to19,
    children: input.children,
    referral_source: input.referralSource,
    accommodation: input.accommodation,
    accommodation_address: input.accommodationAddress,
    notes: input.notes,
    locale: input.locale,
    agreed_at: input.agreedAt,
  };
  const consentColumns = {
    cancellation_policy_agreed_at: input.cancellationPolicyAgreedAt,
    cancellation_policy_version: input.cancellationPolicyVersion,
  };

  let { error } = await supabase
    .from("reservation_requests")
    .insert({ ...row, ...consentColumns });

  // Migration 20261102 not applied yet: keep accepting reservations without the
  // consent columns (consent is still in the owner email and `agreed_at`).
  if (error && isMissingColumnError(error)) {
    console.error(
      "[reservation/intl] cancellation_policy_* columns missing; apply migration 20261102_cancellation_policy_consent.sql",
    );
    ({ error } = await supabase.from("reservation_requests").insert(row));
  }

  if (error) {
    console.error("[reservation/intl]", error);
    return { ok: false, error: "保存に失敗しました" };
  }

  return { ok: true };
}
