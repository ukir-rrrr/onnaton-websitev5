import type { ContentLocale } from "@/lib/i18n/types";
import { L } from "@/lib/i18n/types";

/**
 * キャンセルポリシー（オーナー指定文言・5言語）。
 * 金額・割合・適用条件は全言語で共通。海外向け4言語のみ JST 基準を明記。
 *
 * 日付基準（予約日を D とする）:
 *   D-2 23:59 (JST) まで … 無料
 *   D-1 0:00 から     … コース料金の80% ／ 1名様10,000円
 *   D   0:00 から     … コース料金の100% ／ 1名様10,000円
 * 人数減少時は減少した人数分のみが対象。
 *
 * 文言や金額を変えたら `CANCELLATION_POLICY_VERSION` を更新すること
 * （予約データに同意した版として記録される）。
 */
export const CANCELLATION_POLICY_VERSION = "2026-11-02";

/** 過去に公開した版。古いページから送信された場合もその版を記録できるよう残す。 */
export const cancellationPolicyVersions: readonly string[] = [CANCELLATION_POLICY_VERSION];

export function resolveCancellationPolicyVersion(value: string): string {
  return cancellationPolicyVersions.includes(value) ? value : CANCELLATION_POLICY_VERSION;
}

export const cancellationPolicyPath = "/cancellation-policy";

export type CancellationFeeRow = readonly [label: string, value: string];

export type CancellationPolicySection = {
  heading: string;
  /** 料金表（ラベル／料金） */
  fees?: readonly CancellationFeeRow[];
  /** 料金表の下の補足 */
  note?: string;
  /** 箇条書き */
  items?: readonly string[];
};

export type CancellationPolicyDoc = {
  title: string;
  intro: readonly string[];
  sections: readonly CancellationPolicySection[];
  closing: string;
};

export const cancellationPolicy: Record<ContentLocale, CancellationPolicyDoc> = {
  ja: {
    title: "キャンセルポリシー",
    intro: [
      "当店では、お客様に最高の状態でお料理をお楽しみいただけるよう、ご予約人数に合わせて厳選したお肉や新鮮な食材を仕入れ、一組一組のお客様のために準備を行っております。",
      "そのため、直前のキャンセルは、事前にご用意した食材や仕込みに大きな影響がございます。",
      "誠に恐縮ではございますが、お料理の品質を守るため、以下のキャンセル規定を設けております。",
    ],
    sections: [
      {
        heading: "コースが決定している場合",
        fees: [
          ["当日キャンセル", "コース料金の100%"],
          ["前日キャンセル", "コース料金の80%"],
          ["2日前まで", "無料"],
        ],
        note: "※キャンセル料は、キャンセルされた人数分のコース料金を基準に算出いたします。",
      },
      {
        heading: "コースが決定していない場合",
        fees: [
          ["当日キャンセル", "1名様につき10,000円"],
          ["前日キャンセル", "1名様につき10,000円"],
          ["2日前まで", "無料"],
        ],
        note: "※キャンセル料は、キャンセルされた人数分に対して発生いたします。",
      },
      {
        heading: "ご予約の変更・キャンセルについて",
        items: [
          "ご予約人数が減少した場合も、該当人数分に対して上記のキャンセル規定が適用されます。",
          "ご予約のキャンセルや人数変更の際は、お電話にてご連絡ください。",
        ],
      },
    ],
    closing:
      "皆様に上質なお料理をお届けするため、何卒ご理解とご協力をお願い申し上げます。",
  },
  en: {
    title: "Cancellation Policy",
    intro: [
      "At ONNATON, we carefully select premium meats and fresh ingredients specifically for each reservation, based on the number of guests.",
      "To ensure the highest quality, we purchase and prepare our ingredients in advance for each party. Last-minute cancellations can result in unused ingredients and significant preparation losses.",
      "To maintain the quality of our dining experience, we kindly ask all guests to understand and respect the following cancellation policy.",
    ],
    sections: [
      {
        heading: "Reservations with a Confirmed Course",
        fees: [
          ["Same-day cancellation", "100% of the course price"],
          ["Cancellation 1 day before", "80% of the course price"],
          ["Cancellation 2 or more days before", "No charge"],
        ],
        note: "Cancellation fees are calculated based on the course price per person multiplied by the number of guests cancelled.",
      },
      {
        heading: "Reservations without a Confirmed Course",
        fees: [
          ["Same-day cancellation", "10,000yen per person"],
          ["Cancellation 1 day before", "10,000yen per person"],
          ["Cancellation 2 or more days before", "No charge"],
        ],
        note: "Cancellation fees apply to each guest whose reservation is cancelled.",
      },
      {
        heading: "Reservation Changes and Cancellations",
        items: [
          "If the number of guests is reduced, the applicable cancellation fee will be charged for each cancelled guest.",
          "For cancellations or changes to your reservation, please contact us by email.",
          "All cancellation deadlines are determined by the reservation date and Japan Standard Time (JST, UTC+9).",
        ],
      },
    ],
    closing:
      "We sincerely appreciate your understanding and cooperation in helping us provide an exceptional dining experience.",
  },
  yue: {
    title: "取消預約政策",
    intro: [
      "本店會根據每組客人的預約人數，預先精心挑選及採購優質肉類和新鮮食材，並為每組客人作好準備，希望讓大家品嚐到最佳品質的料理。",
      "由於食材均按預約人數提前準備，臨時取消預約可能會導致食材浪費，亦會對本店的準備工作造成影響。",
      "為確保料理品質，敬請各位客人理解並遵守以下取消預約政策。",
    ],
    sections: [
      {
        heading: "已確認套餐的預約",
        fees: [
          ["用餐當日取消", "收取套餐價格的100%"],
          ["用餐前一日取消", "收取套餐價格的80%"],
          ["用餐前兩日或更早取消", "免費"],
        ],
        note: "取消費用將按被取消預約的人數及每位客人的套餐價格計算。",
      },
      {
        heading: "尚未確認套餐的預約",
        fees: [
          ["用餐當日取消", "每位10,000日圓"],
          ["用餐前一日取消", "每位10,000日圓"],
          ["用餐前兩日或更早取消", "免費"],
        ],
        note: "取消費用按被取消預約的人數計算。",
      },
      {
        heading: "更改及取消預約",
        items: [
          "如減少預約人數，被取消的客人亦須按上述規定支付相應的取消費用。",
          "如需取消或更改預約，請透過電子郵件與我們聯絡。",
          "所有取消期限均以日本標準時間（JST，UTC+9）及預約用餐日期為準。",
        ],
      },
    ],
    closing: "感謝各位客人的理解與合作，讓我們能為每一位客人提供優質的用餐體驗。",
  },
  zhTw: {
    title: "取消預約政策",
    intro: [
      "本店為了讓每位顧客享用最佳品質的料理，會依照預約人數，事先精心挑選並採購頂級肉品及新鮮食材，為每組顧客做好充分準備。",
      "因此，臨時取消預約可能造成已準備食材的浪費，並對餐廳的備餐安排產生重大影響。",
      "為維持料理品質，敬請各位顧客理解並遵守以下取消預約規定。",
    ],
    sections: [
      {
        heading: "已確認套餐的預約",
        fees: [
          ["用餐當日取消", "套餐價格的100%"],
          ["用餐前一天取消", "套餐價格的80%"],
          ["用餐前兩天或更早取消", "免費"],
        ],
        note: "取消費用將依照每位顧客的套餐價格及取消人數計算。",
      },
      {
        heading: "尚未確認套餐的預約",
        fees: [
          ["用餐當日取消", "每人10,000日圓"],
          ["用餐前一天取消", "每人10,000日圓"],
          ["用餐前兩天或更早取消", "免費"],
        ],
        note: "取消費用依照取消人數計算。",
      },
      {
        heading: "預約變更與取消",
        items: [
          "若減少預約人數，減少的人數也將依照上述規定收取取消費用。",
          "如需取消或更改預約，請透過電子郵件與我們聯絡。",
          "所有取消期限均以日本標準時間（JST，UTC+9）及預約用餐日期為準。",
        ],
      },
    ],
    closing: "感謝您的理解與配合，讓我們能持續提供高品質的餐飲體驗。",
  },
  ko: {
    title: "예약 취소 규정",
    intro: [
      "저희 매장은 고객님께 최상의 상태로 요리를 제공하기 위해 예약 인원에 맞춰 엄선한 고급 육류와 신선한 식재료를 미리 구입하고, 각 예약 팀을 위해 정성껏 준비하고 있습니다.",
      "따라서 예약일에 임박한 취소는 이미 준비한 식재료의 낭비와 매장 운영에 큰 영향을 줄 수 있습니다.",
      "요리의 품질을 유지하기 위해 아래의 예약 취소 규정을 마련하였으니 양해와 협조 부탁드립니다.",
    ],
    sections: [
      {
        heading: "코스가 확정된 예약",
        fees: [
          ["예약 당일 취소", "코스 요금의 100%"],
          ["예약 전날 취소", "코스 요금의 80%"],
          ["예약 2일 전까지 취소", "무료"],
        ],
        note: "취소 수수료는 취소된 인원수와 1인당 코스 요금을 기준으로 계산됩니다.",
      },
      {
        heading: "코스가 확정되지 않은 예약",
        fees: [
          ["예약 당일 취소", "1인당 10,000엔"],
          ["예약 전날 취소", "1인당 10,000엔"],
          ["예약 2일 전까지 취소", "무료"],
        ],
        note: "취소 수수료는 취소된 인원수에 따라 부과됩니다.",
      },
      {
        heading: "예약 변경 및 취소 안내",
        items: [
          "예약 인원이 줄어드는 경우에도 취소된 인원에 대해 위 규정에 따른 취소 수수료가 부과됩니다.",
          "예약 취소 또는 변경을 원하시는 경우 이메일로 연락해 주시기 바랍니다.",
          "모든 취소 기한은 예약 방문일과 일본 표준시(JST, UTC+9)를 기준으로 적용됩니다.",
        ],
      },
    ],
    closing: "최상의 식사 경험을 제공하기 위한 저희의 노력에 이해와 협조를 부탁드립니다.",
  },
};

/** 予約フォーム・モーダル・ページで使う UI 文言 */
export const cancellationUi = {
  eyebrow: "CANCELLATION POLICY",
  notice: L(
    "ご予約のキャンセルには、キャンセル料が発生する場合がございます。必ずキャンセルポリシーをご確認ください。",
    "Cancellation fees may apply when you cancel a reservation. Please be sure to review our Cancellation Policy.",
    "예약 취소 시 취소 수수료가 발생할 수 있습니다. 반드시 예약 취소 규정을 확인해 주시기 바랍니다.",
    "取消預約或須收取取消費用，請務必細閱取消預約政策。",
    "取消預約可能會產生取消費用，請務必確認取消預約政策。",
  ),
  link: L(
    "キャンセルポリシーを確認する",
    "View Cancellation Policy",
    "예약 취소 규정 확인하기",
    "查看取消預約政策",
    "查看取消預約政策",
  ),
  close: L("閉じる", "Close", "닫기", "關閉", "關閉"),
  back: L("戻る", "Back", "돌아가기", "返回", "返回"),
  contactEmail: L(
    "キャンセル・変更のご連絡（メール）",
    "Contact for cancellations / changes (email)",
    "취소·변경 연락처 (이메일)",
    "取消／更改預約聯絡方式（電子郵件）",
    "取消／變更預約聯絡方式（電子郵件）",
  ),
  contactEmailHint: L(
    "タップするとメールを作成できます",
    "Tap to write an email",
    "탭하면 이메일을 작성할 수 있습니다",
    "按此撰寫電子郵件",
    "點擊即可撰寫電子郵件",
  ),
  metaDesc: L(
    "恩納豚（おんなとん）のキャンセルポリシー。キャンセル料と適用条件のご案内です。",
    "ONNATON cancellation policy: fees and conditions for reservation cancellations.",
    "온나톤 예약 취소 규정: 취소 수수료 및 적용 조건 안내.",
    "恩納豚取消預約政策：取消費用及適用條件。",
    "恩納豚取消預約政策：取消費用及適用條件。",
  ),
} as const;

/** 海外向けのメール件名（mailto） */
export const cancellationMailSubject = "Reservation cancellation / change - ONNATON";
