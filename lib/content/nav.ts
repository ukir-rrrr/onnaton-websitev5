export interface NavLink {
  href: string;
  label: string;
}

export const navLinks: NavLink[] = [
  { href: "/", label: "トップ" },
  { href: "/#about-text", label: "恩納豚について" },
  { href: "/#kodawari", label: "こだわり" },
  { href: "/course", label: "お品書き" },
  { href: "/seats", label: "店内" },
  { href: "/#access", label: "アクセス" },
];

/**
 * Visual-only legacy labels — prefer `languageOptions` in the header.
 * Keep until real locale routing is wired.
 */
export const languageOptions = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "yue", label: "廣東話" },
  { code: "zhTw", label: "繁體中文" },
  { code: "ko", label: "한국어" },
] as const;
