import {
  emptyDateOverrideLists,
  isRegularClosedDate,
  maxOverrideDate,
  minBookableDate,
  type DateOverrideLists,
} from "@/lib/content/reservation";
import { getSiteSlug, getSupabaseAdmin } from "./server";

export type DateOverridesLoadResult =
  | { status: "ok"; overrides: DateOverrideLists }
  | { status: "supabase_not_configured" }
  | { status: "site_not_found"; siteSlug: string }
  | { status: "query_failed" };

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

function listsFromRows(
  rows: { date: string; status: string }[],
): DateOverrideLists {
  const open: string[] = [];
  const closed: string[] = [];
  for (const row of rows) {
    if (row.status === "open") open.push(row.date);
    if (row.status === "closed") closed.push(row.date);
  }
  return { open, closed };
}

/** Public booking calendar. Empty lists if Supabase is unavailable. */
export async function getReservationDateOverrideLists(
  siteSlug = getSiteSlug(),
): Promise<DateOverrideLists> {
  const result = await getDateOverridesForAdmin(siteSlug);
  return result.status === "ok" ? result.overrides : emptyDateOverrideLists;
}

export async function getDateOverridesForAdmin(
  siteSlug = getSiteSlug(),
): Promise<DateOverridesLoadResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "supabase_not_configured" };

  const siteId = await getSiteId(siteSlug);
  if (!siteId) return { status: "site_not_found", siteSlug };

  const { data, error } = await supabase
    .from("reservation_date_overrides")
    .select("date, status")
    .eq("site_id", siteId)
    .gte("date", minBookableDate())
    .lte("date", maxOverrideDate())
    .order("date");

  if (error || !data) {
    console.error("[date-overrides]", error);
    return { status: "query_failed" };
  }

  return { status: "ok", overrides: listsFromRows(data) };
}

export function parseOverrideDateList(raw: string): string[] | null {
  if (!raw.trim()) return [];
  const dates = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (dates.some((ymd) => !/^\d{4}-\d{2}-\d{2}$/.test(ymd))) return null;
  return [...new Set(dates)].sort();
}

export function validateOverrideLists(
  lists: DateOverrideLists,
  now = new Date(),
): string | null {
  const min = minBookableDate(now);
  const max = maxOverrideDate(now);
  const seen = new Set<string>();

  for (const ymd of lists.open) {
    if (ymd < min || ymd > max) return "選べる期間の外の日付があります";
    if (!isRegularClosedDate(ymd)) {
      return "臨時営業にできるのは、通常の定休日だけです";
    }
    seen.add(ymd);
  }

  for (const ymd of lists.closed) {
    if (ymd < min || ymd > max) return "選べる期間の外の日付があります";
    if (isRegularClosedDate(ymd)) {
      return "臨時休業にできるのは、通常の営業日だけです";
    }
    if (seen.has(ymd)) return "同じ日付が重複しています";
  }

  return null;
}

export async function replaceDateOverrides(
  lists: DateOverrideLists,
  siteSlug = getSiteSlug(),
  now = new Date(),
): Promise<{ ok: boolean; error?: string }> {
  const invalid = validateOverrideLists(lists, now);
  if (invalid) return { ok: false, error: invalid };

  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const siteId = await getSiteId(siteSlug);
  if (!siteId) return { ok: false, error: "Site not found" };

  const from = minBookableDate(now);
  const { data: existing, error: existingError } = await supabase
    .from("reservation_date_overrides")
    .select("date")
    .eq("site_id", siteId)
    .gte("date", from);

  if (existingError) {
    console.error("[date-overrides/existing]", existingError);
    return { ok: false, error: "保存に失敗しました" };
  }

  const rows = [
    ...lists.open.map((date) => ({
      site_id: siteId,
      date,
      status: "open" as const,
      updated_at: new Date().toISOString(),
    })),
    ...lists.closed.map((date) => ({
      site_id: siteId,
      date,
      status: "closed" as const,
      updated_at: new Date().toISOString(),
    })),
  ];

  if (rows.length > 0) {
    const { error: upsertError } = await supabase
      .from("reservation_date_overrides")
      .upsert(rows, { onConflict: "site_id,date" });

    if (upsertError) {
      console.error("[date-overrides/upsert]", upsertError);
      return { ok: false, error: "保存に失敗しました" };
    }
  }

  const keep = new Set(rows.map((row) => row.date));
  const stale = (existing ?? [])
    .map((row) => row.date)
    .filter((date) => !keep.has(date));

  if (stale.length > 0) {
    const { error: deleteError } = await supabase
      .from("reservation_date_overrides")
      .delete()
      .eq("site_id", siteId)
      .in("date", stale);

    if (deleteError) {
      console.error("[date-overrides/delete]", deleteError);
      return { ok: false, error: "保存に失敗しました" };
    }
  }

  return { ok: true };
}
