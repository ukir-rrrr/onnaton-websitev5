"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin/session";
import { readAdminPassword } from "@/lib/admin/config";
import {
  updateNotices,
  type NoticeUpdateInput,
} from "@/lib/supabase/notices";
import { getClientIp } from "@/lib/security/client-ip";
import {
  ADMIN_LOGIN_POLICY,
  checkLockout,
  clearRateLimit,
  recordLockoutFailure,
} from "@/lib/security/rate-limit";

export type AdminNoticesState = {
  ok: boolean;
  error?: string;
  saved?: boolean;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "")
    .trim()
    .normalize("NFKC");
}

function adminNextPath(formData: FormData): "/admin/notices" | "/admin/calendar" {
  return str(formData, "next") === "/admin/calendar"
    ? "/admin/calendar"
    : "/admin/notices";
}

function adminLoginRedirect(
  next: "/admin/notices" | "/admin/calendar",
  error?: string,
  retry?: number,
): never {
  const params = new URLSearchParams();
  if (error) params.set("error", error);
  if (retry != null) params.set("retry", String(retry));
  const query = params.toString();
  redirect(query ? `${next}?${query}` : next);
}

function parseNoticeRows(formData: FormData): NoticeUpdateInput[] {
  return [0, 1, 2].map((sortOrder) => {
    const visibleUntil = str(formData, `visible_until_${sortOrder}`);
    const bodyJa = str(formData, `body_ja_${sortOrder}`);
    const bodyEn = str(formData, `body_en_${sortOrder}`);
    return {
      sortOrder,
      enabled: Boolean(bodyJa || bodyEn),
      bodyJa,
      bodyEn,
      visibleUntil: visibleUntil || null,
    };
  });
}

export async function loginAdminForm(formData: FormData): Promise<void> {
  const next = adminNextPath(formData);

  if (!readAdminPassword()) {
    adminLoginRedirect(next, "config");
  }

  const password = str(formData, "password");
  if (!password) {
    adminLoginRedirect(next, "empty");
  }

  const ip = await getClientIp();
  const loginBucket = `admin_login:ip:${ip}`;
  const lockStatus = await checkLockout(loginBucket, ADMIN_LOGIN_POLICY);
  if (!lockStatus.allowed) {
    const retry = lockStatus.retryAfterSeconds ?? 900;
    adminLoginRedirect(next, "locked", retry);
  }

  if (!verifyAdminPassword(password)) {
    const failure = await recordLockoutFailure(loginBucket, ADMIN_LOGIN_POLICY);
    if (!failure.allowed) {
      const retry = failure.retryAfterSeconds ?? 900;
      adminLoginRedirect(next, "locked", retry);
    }
    adminLoginRedirect(next, "bad_password");
  }

  await clearRateLimit(loginBucket);
  await setAdminSession();
  redirect(next);
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/notices");
}

export async function saveNotices(
  _prev: AdminNoticesState,
  formData: FormData,
): Promise<AdminNoticesState> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "ログインが必要です" };
  }

  const rows = parseNoticeRows(formData);
  const result = await updateNotices(rows);
  if (!result.ok) {
    return { ok: false, error: result.error ?? "保存に失敗しました" };
  }

  revalidatePath("/");
  revalidatePath("/admin/notices");

  return { ok: true, saved: true };
}
