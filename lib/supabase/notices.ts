import { getSiteSlug, getSupabaseAdmin } from "./server";

export interface SiteNotice {
  sortOrder: number;
  bodyEn: string;
  bodyJa: string;
}

export interface AdminNotice extends SiteNotice {
  id: string;
  enabled: boolean;
  visibleUntil: string | null;
  updatedAt: string;
}

function todayJst(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isVisible(row: {
  body_en: string;
  body_ja: string;
  visible_until: string | null;
}): boolean {
  if (!row.body_en.trim() && !row.body_ja.trim()) return false;
  if (row.visible_until && row.visible_until < todayJst()) return false;
  return true;
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

/** Active notices for the current site (JST date for expiry). */
export async function getActiveNotices(
  siteSlug = getSiteSlug(),
): Promise<SiteNotice[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const siteId = await getSiteId(siteSlug);
  if (!siteId) return [];

  const { data, error } = await supabase
    .from("notices")
    .select("sort_order, enabled, body_en, body_ja, visible_until")
    .eq("site_id", siteId)
    .order("sort_order");

  if (error || !data) {
    console.error("[notices]", error);
    return [];
  }

  return data
    .filter(isVisible)
    .map((row) => ({
      sortOrder: row.sort_order,
      bodyEn: row.body_en,
      bodyJa: row.body_ja,
    }));
}

/** All notice slots for admin (includes disabled / empty). */
export type AdminNoticesLoadResult =
  | { status: "ok"; notices: AdminNotice[] }
  | { status: "supabase_not_configured" }
  | { status: "site_not_found"; siteSlug: string }
  | { status: "query_failed" };

export async function getNoticesForAdmin(
  siteSlug = getSiteSlug(),
): Promise<AdminNoticesLoadResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { status: "supabase_not_configured" };

  const siteId = await getSiteId(siteSlug);
  if (!siteId) return { status: "site_not_found", siteSlug };

  const { data, error } = await supabase
    .from("notices")
    .select("id, sort_order, enabled, body_en, body_ja, visible_until, updated_at")
    .eq("site_id", siteId)
    .order("sort_order");

  if (error || !data) {
    console.error("[notices/admin]", error);
    return { status: "query_failed" };
  }

  return {
    status: "ok",
    notices: data.map((row) => ({
      id: row.id,
      sortOrder: row.sort_order,
      enabled: row.enabled,
      bodyEn: row.body_en,
      bodyJa: row.body_ja,
      visibleUntil: row.visible_until,
      updatedAt: row.updated_at,
    })),
  };
}

export type NoticeUpdateInput = {
  sortOrder: number;
  enabled: boolean;
  bodyEn: string;
  bodyJa: string;
  visibleUntil: string | null;
};

export async function updateNotices(
  rows: NoticeUpdateInput[],
  siteSlug = getSiteSlug(),
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase not configured" };

  const siteId = await getSiteId(siteSlug);
  if (!siteId) return { ok: false, error: "Site not found" };

  for (const row of rows) {
    const { error } = await supabase
      .from("notices")
      .update({
        enabled: row.enabled,
        body_en: row.bodyEn.slice(0, 2000),
        body_ja: row.bodyJa.slice(0, 2000),
        visible_until: row.visibleUntil || null,
        updated_at: new Date().toISOString(),
      })
      .eq("site_id", siteId)
      .eq("sort_order", row.sortOrder);

    if (error) {
      console.error("[notices/update]", error);
      return { ok: false, error: "保存に失敗しました" };
    }
  }

  return { ok: true };
}
