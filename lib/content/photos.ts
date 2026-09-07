/**
 * Central photo registry.
 *
 * All page content refers to photos by these keys instead of raw file paths,
 * so swapping in new photography later is a one-line change here rather than
 * a hunt through every section/component that uses a given image.
 *
 * Drop replacement files into /public/images and update the path below.
 */
export const photos = {
  aguPork: "/images/kodawari_agu_01.jpg",
  /** Top-page hero slideshow */
  top001: "/images/top_001.jpg",
  top002: "/images/top_002.jpg",
  top003: "/images/top_003.jpg",
  top004: "/images/top_004.jpg",
  top005: "/images/top_005.jpg",
  top006: "/images/top_006.jpg",
  /** Top-page course teaser (full-bleed). */
  courseMenu: "/images/course_menu.jpg",
  /** Executive course photography */
  course011: "/images/course011.jpg",
  course012: "/images/course012.jpg",
  course013: "/images/course013.jpg",
  course014: "/images/course014.jpg",
  course015: "/images/course015.jpg",
  course016: "/images/course016.jpg",
  course017: "/images/course017.jpg",
  course018: "/images/course018.jpg",
  course019: "/images/course019.jpg",
  course020: "/images/course020.jpg",
  course021: "/images/course021.jpg",
  course022: "/images/course022.jpg",
  course023: "/images/course023.jpg",
  course024: "/images/course024.jpg",

  /** 追加のお料理 */
  tuika01: "/images/tuika_01.jpg",
  tuika02: "/images/tuika_02.jpg",
  tuika03: "/images/tuika_03.jpg",
  tuika04: "/images/tuika_04.jpg",

  ishigakiBeef: "/images/ishigaki-beef.jpg",
  shabuDashi: "/images/shabu-dashi.jpg",
  yamashiroBeef: "/images/yamashiro-beef.jpg",
  interiorKaiseki: "/images/interior-kaiseki.jpg",
  /** About — Concept hero. */
  concept01: "/images/concept_01.jpg",
  interiorTatami: "/images/interior-tatami.jpg",
  interiorTable: "/images/interior-table.jpg",
  /**
   * Dedicated gallery shots live in lib/content/gallery.ts
   * (public/連番写真_全147枚/).
   */
  /** ご利用シーン */
  scene01: "/images/scene_01.jpg",
  scene02: "/images/scene_02.jpg",
  scene03: "/images/scene_03.jpg",
  scene04: "/images/scene_04v2.jpg",


  /** ご予約について */
  reservation01: "/images/yoyaku_01.jpg",
  /** About / 恩納豚について — vertical portrait. */
  onnatonAbout: "/images/onnnaton_tuite.jpg",
  /** こだわり01 — あぐー豚（トップ「当店のこだわり」） */
  kodawari01Section: "/images/kodawari_001v1.jpg",
  /** 追加あぐー豚（コースページ） */
  kodawari01: "/images/kodawari_001.jpg",
  kodawariAguButa: "/images/kodawari_agu_buta.jpg",
  /** こだわり02 — 特選石垣牛 商標 */
  kodawari02Mark: "/images/kodawari_002v2.png",
  /** こだわり03 — お出汁 */
  kodawari03: "/images/kodawari_003.jpg",
  kodawariYasai:"/images/kodawari_04.jpg",
  /** お席ページ — 店内写真 */
  /** 店内ギャラリー先頭 — 廊下 */
  rouka001: "/images/rouka_001.jpg",
  tennai02: "/images/tennai_02.jpg",
  tennai03: "/images/tennai_03.jpg",
  tennai04: "/images/tennai_04.jpg",
  tennai05: "/images/tennai_05.jpg",
  tennai06: "/images/tennai_06.jpg",
  tennai07: "/images/tennai_07.jpg",
  tennai08: "/images/tennai_08.jpg",
  tennai09: "/images/tennai_09.jpg",
  tennai10: "/images/tennai_10.jpg",
  tennai11: "/images/tennai_11.jpg",
  tennai12: "/images/tennai_12.jpg",
} as const;

export type PhotoKey = keyof typeof photos;

/** Drop MP4 files into /public/videos and register paths here. */
export const videos = {
  /** About / 恩納豚について — vertical portrait loop. */
  onnatonAbout: "/videos/店のインスタ広告.mp4",
} as const;
