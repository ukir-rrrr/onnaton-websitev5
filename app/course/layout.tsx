import localFont from "next/font/local";
import { Hina_Mincho, Yuji_Mai, Yuji_Syuku, Zen_Kurenaido } from "next/font/google";
import { courseBrushFontForLocale } from "@/lib/content/courseMenuFont";
import { getLocale } from "@/lib/i18n/getLocale";

const kouzanMouhitsu = localFont({
  src: "../fonts/KouzanMouhitsu.ttf",
  variable: "--font-kouzan-mouhitsu",
  display: "swap",
  weight: "400",
});

const tamanegiKaishoGeki = localFont({
  src: "../fonts/TamanegiKaishoGeki.ttf",
  variable: "--font-tamanegi-kaisho-geki",
  display: "swap",
  weight: "400",
});

const hakushuGyosho = localFont({
  src: "../fonts/HakushuGyosho.otf",
  variable: "--font-hakushu-gyosho",
  display: "swap",
  weight: "400",
});

const yujiSyuku = Yuji_Syuku({
  variable: "--font-yuji-syuku",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const yujiMai = Yuji_Mai({
  variable: "--font-yuji-mai",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const zenKurenaido = Zen_Kurenaido({
  variable: "--font-zen-kurenaido",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const hinaMincho = Hina_Mincho({
  variable: "--font-hina-mincho",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default async function CourseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <div
      className={`${kouzanMouhitsu.variable} ${tamanegiKaishoGeki.variable} ${hakushuGyosho.variable} ${yujiSyuku.variable} ${yujiMai.variable} ${zenKurenaido.variable} ${hinaMincho.variable}`}
      data-course-brush={courseBrushFontForLocale(locale)}
    >
      {children}
    </div>
  );
}
