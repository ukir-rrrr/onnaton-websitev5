"use client";

import { loginAdminForm } from "@/app/actions/admin-notices";
import { adminLabelClass } from "@/app/admin/adminStyles";
import { PasswordInput } from "./PasswordInput";

const loginErrors: Record<string, string> = {
  config:
    "ONNATON_ADMIN_PASSWORD が読み込まれていません。.env.local を保存して dev サーバーを再起動してください",
  empty: "パスワードを入力してください",
  bad_password: "パスワードが正しくありません",
  locked: "試行回数の上限に達しました。しばらくしてから再度お試しください。",
};

type AdminLoginFormProps = {
  error?: string;
  retryAfterSeconds?: number;
  passwordConfigured: boolean;
  next?: "/admin/notices" | "/admin/calendar";
};

function formatLockMessage(retryAfterSeconds?: number): string {
  if (!retryAfterSeconds || retryAfterSeconds <= 0) {
    return loginErrors.locked;
  }
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return `試行回数の上限に達しました。約${minutes}分後に再度お試しください。`;
}

export function AdminLoginForm({
  error,
  retryAfterSeconds,
  passwordConfigured,
  next = "/admin/notices",
}: AdminLoginFormProps) {
  const message =
    error === "locked"
      ? formatLockMessage(retryAfterSeconds)
      : error
        ? loginErrors[error]
        : null;

  return (
    <div className="mx-auto max-w-sm space-y-4">
      {!passwordConfigured ? (
        <p className="rounded border border-amber-800/35 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          {loginErrors.config}
        </p>
      ) : null}
      <form action={loginAdminForm} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block space-y-2" htmlFor="admin-password">
          <span className={adminLabelClass}>パスワード</span>
          <PasswordInput id="admin-password" disabled={error === "locked"} />
        </label>
        {message ? (
          <p
            className="rounded border border-red-800/35 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
            role="alert"
          >
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={error === "locked"}
          className="w-full rounded bg-gold px-6 py-3 text-sm font-medium tracking-[0.08em] text-ink transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
