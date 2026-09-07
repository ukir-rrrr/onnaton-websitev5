import { childrenPolicy } from "./childrenPolicy";

/**
 * Store-wide facts (name, phone, address, hours, ...).
 * `reservationPhoneHref` drives Japanese "電話で予約する" buttons.
 * EN / KO / ZH use the online form at `/reserve/intl`.
 *
 * Source: Google Business Profile + https://www.onnaton.com/access/
 */

export const siteConfig = {
  name: "恩納豚",
  // nameReading: "おんなとん",
  nameRomaji: "ONNATON",
  formalName: "沖縄しゃぶしゃぶ恩納豚 那覇｜あぐー豚×特選石垣牛",
  /** JA phone-only: break after `｜`. sm+ keeps one line. */
  formalNameMobile: "沖縄しゃぶしゃぶ恩納豚 那覇｜\nあぐー豚×特選石垣牛",
  reservationPhoneDisplay: "090-3650-0710",
  reservationPhoneHref: "tel:09036500710",
  instagramUrl: "https://www.instagram.com/onnaton_okinawa/",
  instagramHandle: "@onnaton_okinawa",
  mapEmbedSrc:
    "https://www.google.com/maps?q=%E6%B2%96%E7%B8%84%E7%9C%8C%E9%82%A3%E8%A6%87%E5%B8%82%E8%BE%BB1-2-5+%E6%81%A9%E7%B4%8D%E8%B1%9A&hl=ja&z=16&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=%E6%B2%96%E7%B8%84%E7%9C%8C%E9%82%A3%E8%A6%87%E5%B8%82%E8%BE%BB1-2-5+%E6%81%A9%E7%B4%8D%E8%B1%9A",
};

export interface StoreInfoRow {
  label: string;
  value: string;
  href?: string;
  icon?: "instagram";
}

/** 店舗情報・アクセス — aligned with Google / official site listing. */
export const storeInfoRows: StoreInfoRow[] = [
  // ヘッダー／フッターの `siteConfig.name` とは別。ここだけアクセス欄の店名。
  { label: "店名", value: siteConfig.formalName },
  { label: "住所", value: "〒900-0037 沖縄県那覇市辻1-2-5" },
  {
    label: "電話番号",
    value: siteConfig.reservationPhoneDisplay,
    href: siteConfig.reservationPhoneHref,
  },
  {
    label: "営業時間",
    value: "17:30〜21:00",
  },
  {
    label: "通常定休日",
    value: "火曜日・水曜日\n※臨時営業・臨時休業については、お知らせをご確認ください。",
  },
  { label: "形態", value: "コース料理専門店・完全予約制（前日まで要予約）" },
  { label: "ご予約", value: "お電話のみ／受付 13:30〜21:00（1ヶ月前〜）" },
  {
    label: "お子様連れ",
    value: childrenPolicy.accessValue,
    href: "/#children",
  },
  { label: "駐車場", value: "なし（近隣のコインパーキングをご利用ください）" },
  {
    label: "アクセス",
    value:
      "ゆいレール「旭橋駅」より徒歩約9分\n那覇空港より車で約10〜15分",
  },
  {
    label: "SNS",
    value: `Instagram ${siteConfig.instagramHandle}`,
    href: siteConfig.instagramUrl,
    icon: "instagram",
  },
];

export interface InteriorFact {
  label: string;
  value: string;
}

/** 店内・お席の基本情報 */
export const interiorFacts: InteriorFact[] = [
  { label: "席の種類", value: "テーブル席 ／ お座敷" },
  { label: "席数", value: "42席" },
  { label: "貸切", value: "可能（お問い合わせください）" },
  { label: "個室", value: "なし" },
  { label: "喫煙の可否", value: "全席禁煙" },
];
