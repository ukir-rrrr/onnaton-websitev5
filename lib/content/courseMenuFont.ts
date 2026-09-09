/**
 * 日本語コースメニューの字体。
 *
 * 試した順（スクショ代わり）:
 * 1. yuji-syuku … 佑字 粛。もともとの達筆。線が太く濃い
 * 2. zen-kurenaido … 是非紅道。細めの筆ペン／手書き
 * 3. hina-mincho … ひな明朝。細めの装飾明朝。はごろもに近い
 * 4. yuji-mai … 佑字 舞。粛より流れが華やか
 * 5. yuji-boku … 佑字 墨。墨の筆跡が強い
 * 6. aoyagi-kouzan … 青柳衡山フォントT。本物の毛筆。字数少なめ
 * 7. kouzan-mouhitsu … 衡山毛筆フォント。本格毛筆。字数多め
 * 8. tamanegi-kaisho-geki … 玉ねぎ楷書「激」無料版（英数字改良）。手書き楷書
 * 9. hakushu-gyosho … 白舟行書教漢（J-Font 無償版。教育漢字のみ）
 *
 * 使えなかった: HGはごろも（商用）／英椎行書
 *
 * - `"hakushu-gyosho"` … 白舟行書教漢
 * - `"tamanegi-kaisho-geki"` … 玉ねぎ楷書「激」
 * - `"kouzan-mouhitsu"` … 衡山毛筆フォント
 * - `"aoyagi-kouzan"` … 青柳衡山フォントT
 * - `"yuji-boku"` … 佑字 墨
 * - `"yuji-mai"` … 佑字 舞
 * - `"hina-mincho"` … ひな明朝
 * - `"zen-kurenaido"` … 是非紅道
 * - `"yuji-syuku"` … 佑字 粛
 */
export type CourseBrushFontId =
  | "hakushu-gyosho"
  | "tamanegi-kaisho-geki"
  | "kouzan-mouhitsu"
  | "aoyagi-kouzan"
  | "yuji-boku"
  | "yuji-mai"
  | "hina-mincho"
  | "zen-kurenaido"
  | "yuji-syuku";

/** 日本語コース。元の字体に戻す: `"yuji-syuku"` に書き換えるだけ。 */
export const courseBrushFontId: CourseBrushFontId = "hakushu-gyosho";

/** 翻訳コース（EN / KO / 粵 / 繁）。白舟は教育漢字のみのため使わない。 */
export const courseBrushFontIdTranslated: CourseBrushFontId = "yuji-syuku";

export function courseBrushFontForLocale(locale: string): CourseBrushFontId {
  return locale === "ja" ? courseBrushFontId : courseBrushFontIdTranslated;
}
