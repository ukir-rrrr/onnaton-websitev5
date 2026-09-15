import { getSiteSlug, getSupabaseAdmin } from "./server";

export type IntlReservationInput = {
  reference: string;
  name: string;
  email: string;
  phoneCountry: string;
  phoneCountryCode: string;
  phoneNational: string;
  country: string;
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
};

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

  const { error } = await supabase.from("reservation_requests").insert({
    site_id: siteId,
    reference: input.reference,
    status: "pending",
    name: input.name,
    email: input.email,
    phone_country: input.phoneCountry,
    phone_country_code: input.phoneCountryCode,
    phone_national: input.phoneNational,
    country: input.country,
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
  });

  if (error) {
    console.error("[reservation/intl]", error);
    return { ok: false, error: "保存に失敗しました" };
  }

  return { ok: true };
}
