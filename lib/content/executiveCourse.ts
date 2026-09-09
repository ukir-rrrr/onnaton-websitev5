import { photos } from "./photos";

/** Course slider only — zoom/crop specific photos; frame size unchanged. */
export const courseSlideImageCrop: Partial<
  Record<string, { scale: number; objectPosition?: string }>
> = {
  /** お出汁 — hide portable konro/flame at bottom */
  [photos.course013]: { scale: 1.03, objectPosition: "center top" },
  [photos.kodawariAguButa]: { scale: 1.03, objectPosition: "center top" },
};

export interface ExecutiveDish {
  name: string;
  /** Same column as name (e.g. １００ｇ, 補足文) */
  note?: string;
  /** Phone-only line breaks (md+ / tategaki keep `name` + `note`) */
  nameMobileLines?: readonly [string, string];
  /** Marked with ※ — part of the "set" portion of the course. */
  inSet?: boolean;
}

export interface CourseAltPrice {
  label: string;
  main: string;
  taxNote: string;
  mainMobile: string;
  taxNoteMobile: string;
}

export interface CourseMenuData {
  id: string;
  name: string;
  /**
   * Tategaki only: title before `nameTategakiRest`.
   * When set, `name` is still used for yokogaki / accessibility.
   */
  nameTategakiLead?: string;
  /** Tategaki only: smaller continuation (e.g. 極 withシャトーブリアン). */
  nameTategakiRest?: string;
  /** Short line under the title (e.g. 増量コース) */
  subtitle?: string;
  /** Phone-only line break (md+ / tategaki keep `subtitle`) */
  subtitleMobileLines?: readonly [string, string];
  /** Prominent label near the course name (e.g. 人気) */
  badge?: string;
  /** Tategaki only: horizontal tail after vertical badge (e.g. No.1) */
  badgeTail?: string;
  priceLabel?: string;
  priceMain: string;
  priceTaxNote: string;
  /** Phone-only Arabic numerals (md+ keeps kanji above). */
  priceMainMobile: string;
  priceTaxNoteMobile: string;
  altPrice?: CourseAltPrice;
  /** Hide all prices and show the "inquire" copy instead (chateaubriand). */
  priceInquiry?: boolean;
  /** Leftmost vertical note (e.g. chateaubriand rare-cut caveat). Phrase key. */
  leftNote?: string;
  slides: readonly { src: string; alt: string }[];
  dishes: readonly ExecutiveDish[];
}

const executiveSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course014, alt: "もとぶ牛・特選肉" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
] as const;

const kiwamiSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course018, alt: "もとぶ牛・山城牛・特選石垣牛" },
  { src: photos.course019, alt: "チーズ" },
  { src: photos.course023, alt: "焼きチーズリゾット" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.course017, alt: "デザート" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
] as const;

const kouSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course022, alt: "もとぶ牛・山城牛・特選石垣牛" },
  { src: photos.course021, alt: "しゃぶしゃぶ" },
  { src: photos.course019, alt: "チーズ" },
  { src: photos.course023, alt: "焼きチーズリゾット" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course024, alt: "チーズリゾット" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.course017, alt: "デザート" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
] as const;

const chateaubriandSlides = [
  { src: photos.course013, alt: "お出汁" },
  { src: photos.course011, alt: "前菜" },
  { src: photos.course012, alt: "お料理" },
  { src: photos.course022, alt: "もとぶ牛・山城牛・特選石垣牛" },
  { src: photos.course021, alt: "しゃぶしゃぶ" },
  { src: photos.course019, alt: "チーズ" },
  { src: photos.course023, alt: "焼きチーズリゾット" },
  { src: photos.course015, alt: "お肉" },
  { src: photos.course024, alt: "チーズリゾット" },
  { src: photos.course016, alt: "お食事" },
  { src: photos.course017, alt: "デザート" },
  { src: photos.kodawariAguButa, alt: "あぐー豚" },
  { src: photos.course020, alt: "特選石垣牛" },
] as const;

const umiNote = "（海ぶどうが未入荷の際は代わりものをお出しします）";
const beniNote = "（秘伝の熟成合わせ出汁）";
const wagyuPrefix = "沖縄県産ブランド黒毛和牛";
const g50 = "５０ｇ";
const g100 = "１００ｇ";
const g200 = "２００ｇ";
const approxG50 = "≒　５０ｇ";
const approxG100 = "≒　１００ｇ";
const approxG200 = "≒　２００ｇ";

export const executiveCourse: CourseMenuData = {
  id: "executive",
  name: "エグゼクティブ S",
  nameTategakiLead: "エグゼクティブ Ｓ",
  priceLabel: "コースお一人様",
  priceMain: "一一、五〇〇円",
  priceTaxNote: "（税込 一二、六五〇円）",
  priceMainMobile: "11,500円",
  priceTaxNoteMobile: "（税込 12,650円）",
  altPrice: {
    label: "セットお一人様",
    main: "一〇、五〇〇円",
    taxNote: "（税込 一一、五五〇円）",
    mainMobile: "10,500円",
    taxNoteMobile: "（税込 11,550円）",
  },
  slides: executiveSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    { name: "紅しゃぶスープ", note: beniNote, inSet: true },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
      inSet: true,
    },
    { name: "あぐー豚", note: approxG100, inSet: true },
    { name: "お野菜", inSet: true },
    { name: "手ごねのあぐーつくね", inSet: true },
    { name: "目の前で焼き上げる焼きチーズリゾット", inSet: true },
    { name: "バニラアイスクリーム" },
  ],
};

export const hanaCourse: CourseMenuData = {
  id: "hana",
  name: "エグゼクティブ 華 -HANA-",
  subtitle: "エグゼクティブコースよりあぐー豚１００ｇ増量コース",
  subtitleMobileLines: ["エグゼクティブコースより", "あぐー豚１００ｇ増量コース"],
  priceLabel: "コースお一人様",
  priceMain: "一二、五〇〇円",
  priceTaxNote: "（税込 一三、七五〇円）",
  priceMainMobile: "12,500円",
  priceTaxNoteMobile: "（税込 13,750円）",
  altPrice: {
    label: "セットお一人様",
    main: "一一、五〇〇円",
    taxNote: "（税込 一二、六五〇円）",
    mainMobile: "11,500円",
    taxNoteMobile: "（税込 12,650円）",
  },
  slides: executiveSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    { name: "紅しゃぶスープ", note: beniNote, inSet: true },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
      inSet: true,
    },
    { name: "あぐー豚", note: approxG200, inSet: true },
    { name: "お野菜", inSet: true },
    { name: "手ごねのあぐーつくね", inSet: true },
    { name: "目の前で焼き上げる焼きチーズリゾット", inSet: true },
    { name: "バニラアイス" },
  ],
};

export const kiwamiCourse: CourseMenuData = {
  id: "kiwami",
  name: "エグゼクティブ 極 -KIWAMI-",
  badge: "初めての方におすすめコース",
  priceLabel: "コースお一人様",
  priceMain: "一四、八〇〇円",
  priceTaxNote: "（税込 一六、二八〇円）",
  priceMainMobile: "14,800円",
  priceTaxNoteMobile: "（税込 16,280円）",
  altPrice: {
    label: "セットお一人様",
    main: "一三、八〇〇円",
    taxNote: "（税込 一五、一八〇円）",
    mainMobile: "13,800円",
    taxNoteMobile: "（税込 15,180円）",
  },
  slides: kiwamiSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    { name: "紅しゃぶスープ", note: beniNote, inSet: true },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: g50,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
      inSet: true,
    },
    {
      name: `${wagyuPrefix}　山城牛（Ａ５ランク）`,
      note: g50,
      nameMobileLines: [wagyuPrefix, "山城牛（Ａ５ランク）"],
      inSet: true,
    },
    {
      name: `${wagyuPrefix}　特選石垣牛（Ａ５ランク）`,
      note: g50,
      nameMobileLines: [wagyuPrefix, "特選石垣牛（Ａ５ランク）"],
      inSet: true,
    },
    { name: "あぐー豚", note: g100, inSet: true },
    { name: "お野菜", inSet: true },
    { name: "手ごねのあぐーつくね", inSet: true },
    { name: "目の前で焼き上げる焼きチーズリゾット", inSet: true },
    { name: "沖縄県産黒蜜きな粉バニラアイスクリーム" },
  ],
};

export const kouCourse: CourseMenuData = {
  id: "kou",
  name: "エグゼクティブ 煌 -KOU-",
  badge: "ご常連様一番人気",
  priceLabel: "コースお一人様",
  priceMain: "一八、五〇〇円",
  priceTaxNote: "（税込 二〇、三五〇円）",
  priceMainMobile: "18,500円",
  priceTaxNoteMobile: "（税込 20,350円）",
  altPrice: {
    label: "セットお一人様",
    main: "一七、八〇〇円",
    taxNote: "（税込 一九、五八〇円）",
    mainMobile: "17,800円",
    taxNoteMobile: "（税込 19,580円）",
  },
  slides: kouSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    {
      name: `${wagyuPrefix}　特選石垣牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "特選石垣牛（Ａ５ランク）"],
      inSet: true,
    },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG100,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
      inSet: true,
    },
    {
      name: `${wagyuPrefix}　山城牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "山城牛（Ａ５ランク）"],
      inSet: true,
    },
    { name: "あぐー豚", note: approxG50, inSet: true },
    { name: "紅しゃぶスープ", note: beniNote, inSet: true },
    { name: "お野菜", inSet: true },
    { name: "手ごねのあぐーつくね", inSet: true },
    { name: "目の前で焼き上げる焼きチーズリゾット", inSet: true },
    { name: "沖縄県産黒蜜きな粉バニラアイスクリーム" },
  ],
};

export const chateaubriandCourse: CourseMenuData = {
  id: "chateaubriand",
  name: "エグゼクティブ［極］",
  nameTategakiRest: "with シャトーブリアン",
  badge: "ご常連様二番人気",
  priceInquiry: true,
  leftNote:
    "シャトーブリアンは非常に希少な部位のため、ご用意できない場合がございます。\nその際は、最高級フィレ肉をご提供いたします。",
  priceMain: "",
  priceTaxNote: "",
  priceMainMobile: "",
  priceTaxNoteMobile: "",
  slides: chateaubriandSlides,
  dishes: [
    { name: "沖縄県産もずく" },
    { name: "ミミガーの和え物" },
    { name: "久米島産海ぶどう", note: umiNote },
    {
      name: "特選石垣牛（Ａ５ランク）シャトーブリアンステーキ",
      note: approxG100,
      nameMobileLines: [
        "特選石垣牛（Ａ５ランク）",
        "シャトーブリアンステーキ",
      ],
    },
    { name: "高級ワイン「Rindo」などを元に作ったソースと共に" },
    {
      name: `${wagyuPrefix}　特選石垣牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "特選石垣牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　もとぶ牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "もとぶ牛（Ａ５ランク）"],
    },
    {
      name: `${wagyuPrefix}　山城牛（Ａ５ランク）`,
      note: approxG50,
      nameMobileLines: [wagyuPrefix, "山城牛（Ａ５ランク）"],
    },
    { name: "あぐー豚", note: approxG50 },
    { name: "紅しゃぶスープ", note: beniNote },
    { name: "お野菜" },
    { name: "手ごねのあぐーつくね" },
    { name: "目の前で焼き上げる焼きチーズリゾット" },
    { name: "沖縄県産黒蜜きな粉バニラアイスクリーム" },
  ],
};

export const courseMenus: CourseMenuData[] = [
  executiveCourse,
  hanaCourse,
  kiwamiCourse,
  kouCourse,
  chateaubriandCourse,
];
