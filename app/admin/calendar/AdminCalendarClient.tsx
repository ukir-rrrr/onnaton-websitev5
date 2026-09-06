"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveDateOverrides,
  type AdminCalendarState,
} from "@/app/actions/admin-calendar";
import {
  adminMutedClass,
} from "@/app/admin/adminStyles";
import {
  isRegularClosedDate,
  maxOverrideDate,
  minBookableDate,
  tokyoTodayYmd,
  type DateOverrideLists,
} from "@/lib/content/reservation";
import { buildMonthGrid, monthsBetween } from "@/lib/date/calendar";
import { datePickerLabels, formatPickerMonthTitle } from "@/lib/i18n/datePicker";

const initialState: AdminCalendarState = { ok: false };
const labels = datePickerLabels("ja");

type AdminCalendarClientProps = {
  initialOverrides: DateOverrideLists;
  formKey: string;
};

function listsEqual(a: DateOverrideLists, b: DateOverrideLists): boolean {
  return (
    a.open.join(",") === b.open.join(",") &&
    a.closed.join(",") === b.closed.join(",")
  );
}

function toggleDate(ymd: string, lists: DateOverrideLists): DateOverrideLists {
  if (lists.open.includes(ymd)) {
    return { open: lists.open.filter((date) => date !== ymd), closed: lists.closed };
  }
  if (lists.closed.includes(ymd)) {
    return { open: lists.open, closed: lists.closed.filter((date) => date !== ymd) };
  }
  if (isRegularClosedDate(ymd)) {
    return { open: [...lists.open, ymd].sort(), closed: lists.closed };
  }
  return { open: lists.open, closed: [...lists.closed, ymd].sort() };
}

function dateStatus(
  ymd: string,
  lists: DateOverrideLists,
): "open" | "closed" | "regular-open" | "regular-closed" {
  if (lists.open.includes(ymd)) return "open";
  if (lists.closed.includes(ymd)) return "closed";
  return isRegularClosedDate(ymd) ? "regular-closed" : "regular-open";
}

export function AdminCalendarClient({
  initialOverrides,
  formKey,
}: AdminCalendarClientProps) {
  const router = useRouter();
  const [saveState, saveAction, savePending] = useActionState(
    saveDateOverrides,
    initialState,
  );
  const [draft, setDraft] = useState<DateOverrideLists>(initialOverrides);

  useEffect(() => {
    if (saveState.saved) router.refresh();
  }, [saveState.saved, router]);

  const today = tokyoTodayYmd();
  const minDate = minBookableDate();
  const maxDate = maxOverrideDate();
  const months = useMemo(
    () => monthsBetween(today, maxDate),
    [today, maxDate],
  );
  const dirty = !listsEqual(draft, initialOverrides);

  return (
    <div className="space-y-8">
      <div className="rounded border border-[#8a7355] bg-[#efe8dc] px-4 py-3">
        <p className={`${adminMutedClass} leading-relaxed`}>
          <span className="font-medium text-[#2a2520]">使い方：</span>
          日付をタップすると切り替わります。通常の定休日（火・水）は臨時営業、通常の営業日は臨時休業にできます。もう一度押すと元に戻ります。「保存する」を押すまで予約フォームには反映されません。お客様への案内は、必要ならお知らせにも書いてください。
        </p>
      </div>

      <form key={formKey} action={saveAction} className="space-y-8">
        <input type="hidden" name="open_dates" value={draft.open.join(",")} />
        <input type="hidden" name="closed_dates" value={draft.closed.join(",")} />

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#2a2520]">
          <Legend swatch="bg-[#fffdf8] ring-1 ring-[#8a7355]" label="通常営業" />
          <Legend swatch="bg-[#7d7163]" label="通常定休" />
          <Legend swatch="bg-[#c9a063]" label="臨時営業" />
          <Legend swatch="bg-[#b42318]" label="臨時休業" />
        </div>

        {saveState.error ? (
          <p
            className="rounded border border-red-800/35 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
            role="alert"
          >
            {saveState.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={savePending || !dirty}
            className="rounded bg-gold px-6 py-3 text-sm font-medium tracking-[0.08em] text-[#2a2520] transition hover:bg-gold/90 disabled:opacity-60"
          >
            {savePending ? "保存中…" : "保存する"}
          </button>
          {dirty ? (
            <p className="text-sm font-medium text-[#2a2520]">未保存の変更があります</p>
          ) : null}
          {saveState.saved && !dirty ? (
            <p
              className="text-sm font-medium text-[#2a2520]"
              role="status"
              aria-live="polite"
            >
              保存しました
            </p>
          ) : null}
        </div>

        <div className="space-y-8">
          {months.map(({ year, month }) => (
            <section
              key={`${year}-${month}`}
              className="rounded border-2 border-[#8a7355] bg-[#efe8dc] p-4 shadow-sm sm:p-6"
            >
              <h2 className="mb-4 text-center font-display-jp text-lg tracking-[0.08em]">
                {formatPickerMonthTitle("ja", year, month)}
              </h2>
              <div className="mb-1 grid grid-cols-7 gap-1">
                {labels.weekdays.map((label) => (
                  <div
                    key={label}
                    className="py-1 text-center text-[11px] tracking-[0.08em] text-[#5c5348]"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {buildMonthGrid(year, month).map((cell, index) => {
                  if (cell.kind === "empty") {
                    return <div key={`empty-${index}`} aria-hidden className="aspect-square" />;
                  }

                  const editable = cell.ymd >= minDate && cell.ymd <= maxDate;
                  const status = dateStatus(cell.ymd, draft);
                  const isToday = cell.ymd === today;

                  return (
                    <button
                      key={cell.ymd}
                      type="button"
                      disabled={!editable}
                      onClick={() => setDraft((current) => toggleDate(cell.ymd, current))}
                      aria-label={`${cell.ymd} ${statusLabel(status)}`}
                      className={`aspect-square rounded-sm text-[13px] transition-colors sm:text-[14px] ${cellClass(status, editable, isToday)}`}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </form>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-4 shrink-0 rounded-sm ${swatch}`} aria-hidden />
      {label}
    </span>
  );
}

function statusLabel(
  status: "open" | "closed" | "regular-open" | "regular-closed",
): string {
  if (status === "open") return "臨時営業";
  if (status === "closed") return "臨時休業";
  if (status === "regular-closed") return "通常定休";
  return "通常営業";
}

function cellClass(
  status: "open" | "closed" | "regular-open" | "regular-closed",
  editable: boolean,
  isToday: boolean,
): string {
  const ring = isToday ? " ring-2 ring-[#2a2520]" : "";

  if (!editable) {
    return `cursor-not-allowed bg-[#d8d0c2] text-[#2a2520]/40${ring}`;
  }

  if (status === "open") {
    return `bg-[#c9a063] font-medium text-[#2a2520] hover:bg-[#d4b06e]${ring}`;
  }
  if (status === "closed") {
    return `bg-[#b42318] font-medium text-white line-through hover:bg-[#9b1c14]${ring}`;
  }
  if (status === "regular-closed") {
    return `bg-[#7d7163] text-[#f4efe6] hover:bg-[#6e6356]${ring}`;
  }
  return `bg-[#fffdf8] text-[#2a2520] ring-1 ring-[#8a7355]/70 hover:bg-white${ring}`;
}
