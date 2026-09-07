export interface DrinkItem {
  name: string;
  price: string;
  note?: string;
}

export interface DrinkGroup {
  heading: string;
  items: DrinkItem[];
}

/** お飲み物 — 税込。写真はあとから差し替え。 */
export const drinksTaxNote = "税込表記です。";

export const drinkGroups: DrinkGroup[] = [
  {
    heading: "ビール・サワー・梅酒",
    items: [
      { name: "アサヒプレミアム生ビール「熟撰JYUKUSEN」", price: "800円" },
      { name: "甘くない手作りシークヮーサー果汁100％サワー", price: "850円" },
      { name: "沖縄限定 泡盛梅酒ソーダ（度数は低いです）", price: "850円" },
    ],
  },
  {
    heading: "ウヰスキー（各銘柄ボトルキープもございます）",
    items: [
      { name: "山崎ハイボール", price: "1,300円" },
      { name: "白州ハイボール", price: "1,300円" },
      { name: "響ハイボール", price: "1,400円" },
      { name: "デュワーズハイボール", price: "800円" },
    ],
  },
  {
    heading: "グラスワイン（赤・白）90ml / 120ml / 150ml",
    items: [{ name: "グラスワイン", price: "1,000円 / 1,300円 / 1,500円" }],
  },
  {
    heading: "ボトルワイン（赤・白）（ハウスワイン）",
    items: [
      { name: "ボトルワイン", price: "5,800円" },
      { name: "その他ワインはワインリストをご覧ください", price: "" },
    ],
  },
  {
    heading: "泡盛古酒",
    items: [
      { name: "瑞泉 KING 10年古酒（グラス100ml / ボトル）", price: "1,200円 / 7,000円" },
    ],
  },
  {
    heading: "焼酎（100ml）",
    items: [
      { name: "プレミアム芋焼酎（村尾）数量限定", price: "1,500円" },
      { name: "芋焼酎", price: "1,000円" },
      { name: "麦焼酎", price: "1,000円" },
    ],
  },
  {
    heading: "ソフトドリンク",
    items: [
      { name: "さんぴん茶(ジャスミン茶)・ウーロン茶", price: "各 450円" },
      { name: "コーラ", price: "500円" },
      { name: "ペリエ（スパークリングウォーター）500ml", price: "600円" },
      { name: "エビアン（ミネラルウォーター）", price: "500円" },
      { name: "スパークリング大宜味村のシークヮーサー果汁100％", price: "700円" },
      { name: "完全無添加ノンアルコールビール", price: "600円" },
      { name: "ノンアルコール梅酒", price: "600円" },
    ],
  },
];
