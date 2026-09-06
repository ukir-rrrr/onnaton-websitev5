import type { Metadata } from "next";
import { AdminNav } from "@/app/admin/AdminNav";
import { AdminLoginForm } from "@/app/admin/notices/AdminLoginForm";
import { AdminCalendarClient } from "./AdminCalendarClient";
import { adminMutedClass } from "@/app/admin/adminStyles";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { readAdminPassword } from "@/lib/admin/config";
import { getDateOverridesForAdmin } from "@/lib/supabase/date-overrides";

export const metadata: Metadata = {
  title: "予約カレンダー | 恩納豚",
  robots: { index: false, follow: false },
};

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; retry?: string }>;
}) {
  const { error, retry } = await searchParams;
  const retryAfterSeconds = retry ? Number.parseInt(retry, 10) : undefined;
  const authed = await isAdminAuthenticated();
  const configuredPassword = readAdminPassword();
  const passwordConfigured = Boolean(configuredPassword);

  if (!authed) {
    return (
      <div className="min-h-screen bg-ink px-6 py-16 text-[#2a2520]">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-center font-display-jp text-2xl font-medium tracking-[0.08em] text-[#2a2520]">
            予約カレンダー
          </h1>
          <p className={`mb-8 text-center ${adminMutedClass}`}>
            臨時営業・臨時休業を予約フォームに反映します
          </p>
          <AdminLoginForm
            next="/admin/calendar"
            error={error}
            retryAfterSeconds={
              Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : undefined
            }
            passwordConfigured={passwordConfigured}
          />
        </div>
      </div>
    );
  }

  const loadResult = await getDateOverridesForAdmin();

  const loadErrorMessage =
    loadResult.status === "supabase_not_configured"
      ? "Supabase の環境変数が Cloudflare に設定されていません。NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を Variables and secrets に追加し、再デプロイしてください。"
      : loadResult.status === "site_not_found"
        ? `Supabase に site slug「${loadResult.siteSlug}」が見つかりません。SITE_SLUG の値と supabase/schema.sql の seed を確認してください。`
        : loadResult.status === "query_failed"
          ? "予約日の例外を取得できませんでした。supabase/migrations/20260906_reservation_date_overrides.sql を Supabase の SQL Editor で実行したか確認してください。"
          : null;

  const formKey =
    loadResult.status === "ok"
      ? `${loadResult.overrides.open.join(",")}|${loadResult.overrides.closed.join(",")}`
      : "empty";

  return (
    <div className="min-h-screen bg-ink px-6 py-16 text-[#2a2520]">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-center font-display-jp text-2xl font-medium tracking-[0.08em] text-[#2a2520]">
          予約カレンダー
        </h1>
        <p className={`mb-10 text-center ${adminMutedClass}`}>
          恩納豚 — 予約フォーム選択
        </p>
        <AdminNav current="calendar" />
        {loadResult.status !== "ok" ? (
          <p className={`text-center leading-relaxed ${adminMutedClass}`}>
            {loadErrorMessage}
          </p>
        ) : (
          <AdminCalendarClient
            initialOverrides={loadResult.overrides}
            formKey={formKey}
          />
        )}
      </div>
    </div>
  );
}
