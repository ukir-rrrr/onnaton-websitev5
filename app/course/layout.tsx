import { Hina_Mincho, Yuji_Mai, Yuji_Syuku, Zen_Kurenaido } from "next/font/google";
import { courseBrushFontId } from "@/lib/content/courseMenuFont";

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

export default function CourseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${yujiSyuku.variable} ${yujiMai.variable} ${zenKurenaido.variable} ${hinaMincho.variable}`}
      data-course-brush={courseBrushFontId}
    >
      {children}
    </div>
  );
}
