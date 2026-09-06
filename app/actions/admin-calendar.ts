"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin/session";
import {
  parseOverrideDateList,
  replaceDateOverrides,
} from "@/lib/supabase/date-overrides";

export type AdminCalendarState = {
  ok: boolean;
  error?: string;
  saved?: boolean;
};

export async function saveDateOverrides(
  _prev: AdminCalendarState,
  formData: FormData,
): Promise<AdminCalendarState> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, error: "ログインが必要です" };
  }

  const open = parseOverrideDateList(String(formData.get("open_dates") ?? ""));
  const closed = parseOverrideDateList(String(formData.get("closed_dates") ?? ""));
  if (!open || !closed) {
    return { ok: false, error: "日付の形式が正しくありません" };
  }

  const result = await replaceDateOverrides({ open, closed });
  if (!result.ok) {
    return { ok: false, error: result.error ?? "保存に失敗しました" };
  }

  revalidatePath("/admin/calendar");
  revalidatePath("/reserve");
  revalidatePath("/reserve/intl");

  return { ok: true, saved: true };
}
