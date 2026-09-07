import type { Metadata, Viewport } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/getLocale";
import { htmlLang } from "@/lib/i18n/config";
import { copy } from "@/lib/i18n/copy";
import { t } from "@/lib/i18n/types";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";

/**
 * Noto Serif JP — vertical-rl (tategaki) fallback and non-Windows fallback
 * when Yu Kyokasho is unavailable.
 */
const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, copy.meta.homeTitle),
    description: t(locale, copy.meta.homeDesc),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={htmlLang[locale]}
      className={notoSerifJp.variable}
    >
      <body>
        <div className="washi-backdrop" aria-hidden />
        <div className="relative z-[1] min-h-full">
          <LocaleProvider locale={locale}>{children}</LocaleProvider>
        </div>
      </body>
    </html>
  );
}

