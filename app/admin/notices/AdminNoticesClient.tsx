"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import {
  saveNotices,
  type AdminNoticesState,
} from "@/app/actions/admin-notices";
import type { AdminNotice } from "@/lib/supabase/notices";
import {
  adminFieldsetClass,
  adminInputClass,
  adminLabelClass,
  adminLegendClass,
  adminMutedClass,
} from "@/app/admin/adminStyles";

const initialState: AdminNoticesState = { ok: false };

type AdminNoticesClientProps = {
  notices: AdminNotice[];
  formKey: string;
};

export function AdminNoticesClient({ notices, formKey }: AdminNoticesClientProps) {
  const router = useRouter();
  const [saveState, saveAction, savePending] = useActionState(
    saveNotices,
    initialState,
  );

  useEffect(() => {
    if (saveState.saved) router.refresh();
  }, [saveState.saved, router]);

  return (
    <div className="space-y-8">
      <div className="rounded border border-[#a68c6e]/35 bg-white/40 px-4 py-3">
        <p className={`${adminMutedClass} leading-relaxed`}>
          <span className="font-medium text-[#2a2520]">編集のしかた：</span>
          お知らせ1〜3は固定枠です。開くと 保存済みの内容が表示されます。文言を変えて「保存する」を押すと上書き更新されます。本文があるものはトップに出ます。消すときは本文を空にするか、表示期限を過ぎてください。
        </p>
      </div>

      <p className={adminMutedClass}>
        本文があるものだけトップページに出ます。表示期限は日本標準時の日付です。
      </p>

      {saveState.error ? (
        <p
          className="rounded border border-red-800/35 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
          role="alert"
        >
          {saveState.error}
        </p>
      ) : null}

      <form key={formKey} action={saveAction} className="space-y-8">
        {notices.map((notice) => (
          <fieldset key={notice.id} className={adminFieldsetClass}>
            <legend className={adminLegendClass}>
              お知らせ {notice.sortOrder + 1}
            </legend>

            <label className="block space-y-2">
              <span className={adminLabelClass}>日本語</span>
              <textarea
                name={`body_ja_${notice.sortOrder}`}
                defaultValue={notice.bodyJa}
                rows={4}
                className={`${adminInputClass} resize-y leading-relaxed`}
                placeholder="例：臨時休業のお知らせ"
              />
            </label>

            <label className="block space-y-2">
              <span className={adminLabelClass}>English</span>
              <textarea
                name={`body_en_${notice.sortOrder}`}
                defaultValue={notice.bodyEn}
                rows={4}
                className={`${adminInputClass} resize-y leading-relaxed`}
                placeholder="Optional English notice"
              />
            </label>

            <label className="block space-y-2">
              <span className={adminLabelClass}>
                表示期限（任意・この日を過ぎると非表示）
              </span>
              <input
                type="date"
                name={`visible_until_${notice.sortOrder}`}
                defaultValue={notice.visibleUntil ?? ""}
                className={adminInputClass}
              />
            </label>
          </fieldset>
        ))}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={savePending}
            className="rounded bg-gold px-6 py-3 text-sm font-medium tracking-[0.08em] text-[#2a2520] transition hover:bg-gold/90 disabled:opacity-60"
          >
            {savePending ? "保存中…" : "保存する"}
          </button>
          {saveState.saved ? (
            <p
              className="text-sm font-medium text-[#2a2520]"
              role="status"
              aria-live="polite"
            >
              保存しました
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
