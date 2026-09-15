import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseMenuAppeal } from "@/components/course/CourseMenuAppeal";
import { CourseDetail } from "@/components/course/ExecutiveCourse";
import { ExtraMenu } from "@/components/course/ExtraMenu";
import { DrinkMenu } from "@/components/course/DrinkMenu";
import { courseMenus } from "@/lib/content/executiveCourse";
import { getLocale } from "@/lib/i18n/getLocale";
import { copy } from "@/lib/i18n/copy";
import { t } from "@/lib/i18n/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, copy.meta.courseTitle),
    description: t(locale, copy.meta.courseDesc),
  };
}

export default async function CoursePage() {
  const locale = await getLocale();
  const mainFontClass = locale === "ja" ? "font-serif-jp" : "font-brush-jp";

  return (
    <div className="relative w-full overflow-x-clip bg-ink text-cream">
      <div className="relative">
        <Header />
        <div className="h-20 bg-ink" aria-hidden />
      </div>

      <main className={mainFontClass}>
        <CourseMenuAppeal locale={locale} />
        {courseMenus.map((course, i) => {
          const next = courseMenus[i + 1];
          return (
            <CourseDetail
              key={course.id}
              course={course}
              headingAs={i === 0 ? "h1" : "h2"}
              id={course.id}
              nextCourseHref={next ? `#${next.id}` : "#extras"}
              showSubstituteNote={i === courseMenus.length - 1}
              compactTop={i === 0}
            />
          );
        })}
        <ExtraMenu nextHref="#drinks" />
        <DrinkMenu />
      </main>

      <Footer />
    </div>
  );
}
