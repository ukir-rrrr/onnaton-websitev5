import type { IntlReservationInput } from "@/lib/supabase/reservations";
import { findCountryDialCode } from "@/lib/content/countryCodes";
import {
  isReferralSourceId,
  referralSourceLabelJa,
} from "@/lib/content/referralSources";
import { getResendReplyTo, sendResendEmail } from "./resend";

function formatDates(input: IntlReservationInput): string {
  const lines = [`1. ${input.datePreference1}`];
  if (input.datePreference2) lines.push(`2. ${input.datePreference2}`);
  if (input.datePreference3) lines.push(`3. ${input.datePreference3}`);
  return lines.join("\n");
}

export async function notifyOwnerIntlReservation(
  input: IntlReservationInput,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const to = process.env.RESEND_OWNER_TO?.trim();
  if (!to) {
    console.info("[reservation/intl/owner] email skipped (RESEND_OWNER_TO not set)", {
      reference: input.reference,
    });
    return { ok: true, skipped: true };
  }

  const hasInfants = input.age0to5 > 0;
  const referralLabel = isReferralSourceId(input.referralSource)
    ? referralSourceLabelJa[input.referralSource]
    : input.referralSource;
  const subject = `[恩納豚] 海外予約リクエスト ${input.reference}${
    hasInfants ? "【0〜5歳あり】" : ""
  }`;
  const text = [
    "海外向け予約リクエストが届きました。",
    ...(hasInfants
      ? [
          `【要確認】0〜5歳のお子様 ${input.age0to5} 名を含むリクエストです。受け入れ可否をご判断のうえ、\nお客様へのご返信でご案内ください。`,
        ]
      : []),
    "空席確認後、お客様へ確認メールをお送りください。",
    "",
    `受付番号: ${input.reference}`,
    `お名前: ${input.name}`,
    `メール: ${input.email}`,
    `電話番号: ${input.phoneCountryCode} ${input.phoneNational} （${findCountryDialCode(input.phoneCountry)?.name ?? input.phoneCountry}）`,
    `国・地域: ${input.country}`,
    `当店を知ったきっかけ: ${referralLabel}`,
    `locale: ${input.locale ?? "—"}`,
    "",
    "希望日（第1〜3希望）:",
    formatDates(input),
    "",
    `大人: ${input.adults} 名`,
    `0〜5歳: ${input.age0to5} 名`,
    `6〜12歳: ${input.age6to12} 名`,
    `13〜19歳: ${input.age13to19} 名`,
    "",
    `宿泊先: ${input.accommodation}`,
    input.accommodationAddress
      ? `宿泊先住所: ${input.accommodationAddress}`
      : "宿泊先住所: （未入力）",
    "",
    `同意日時: ${input.agreedAt}`,
    "",
    "※ お客様には受付確認の自動返信メールを送信済みです。",
  ].join("\n");

  return sendResendEmail({
    to: [to],
    subject,
    text,
    replyTo: input.email,
    logLabel: "reservation/intl/owner",
  });
}
