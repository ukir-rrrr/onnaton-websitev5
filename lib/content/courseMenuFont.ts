/**
 * 日本語コースメニューの字体。
 *
 * 試した順（スクショ代わり）:
 * 1. yuji-syuku … 佑字 粛。もともとの達筆。線が太く濃い
 * 2. zen-kurenaido … 是非紅道。細めの筆ペン／手書き
 * 3. hina-mincho … ひな明朝。細めの装飾明朝。はごろもに近い
 * 4. yuji-mai … 佑字 舞。粛より流れが華やか
 * 5. aoyagi-kouzan … 青柳衡山フォントT。本物の毛筆。字数少なめ
 * 6. kouzan-mouhitsu … 衡山毛筆フォント。本格毛筆。字数多め
 *
 * 使えなかった: HGはごろも（商用）／玉ねぎ楷書・英椎行書・白舟（Web配信不可）
 *
 * - `"kouzan-mouhitsu"` … 衡山毛筆フォント
 * - `"aoyagi-kouzan"` … 青柳衡山フォントT
 * - `"yuji-mai"` … 佑字 舞
 * - `"hina-mincho"` … ひな明朝
 * - `"zen-kurenaido"` … 是非紅道
 * - `"yuji-syuku"` … 佑字 粛
 */
export type CourseBrushFontId =
  | "kouzan-mouhitsu"
  | "aoyagi-kouzan"
  | "yuji-mai"
  | "hina-mincho"
  | "zen-kurenaido"
  | "yuji-syuku";

/** 元の字体に戻す: `"yuji-syuku"` に書き換えるだけ。 */
export const courseBrushFontId: CourseBrushFontId = "yuji-syuku";
