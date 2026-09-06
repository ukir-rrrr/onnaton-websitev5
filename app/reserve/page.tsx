import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReservationForm } from "@/components/reserve/ReservationForm";
import { MultilineText } from "@/components/i18n/MultilineText";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { photos } from "@/lib/content/photos";
import { getLocale } from "@/lib/i18n/getLocale";
import { copy } from "@/lib/i18n/copy";
import { t } from "@/lib/i18n/types";
import { isReservationCourseId } from "@/lib/content/reservation";
import { getReservationDateOverrideLists } from "@/lib/supabase/date-overrides";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, copy.meta.reserveTitle),
    description: t(locale, copy.meta.reserveDesc),
  };
}

export default async function ReservePage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const locale = await getLocale();
  if (locale !== "ja") {
    redirect("/reserve/intl");
  }
  const { course } = await searchParams;
  const initialCourse = course && isReservationCourseId(course) ? course : "";
  const overrides = await getReservationDateOverrideLists();

  return (
    <div className="relative w-full overflow-x-clip bg-ink text-cream">
      <div className="relative">
        <Header />
        <div className="h-20 bg-ink" aria-hidden />
      </div>

      <main>
        <section className="relative min-h-[280px] w-full overflow-hidden sm:min-h-[590px]">
          <Image
            src={photos.tennai06}
            alt=""
            fill
            aria-hidden
            sizes="100vw"
            className="object-cover object-[50%_21%]"
            priority
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-16">
            <SectionEyebrow
              eyebrow="RESERVATION"
              heading={t(locale, copy.form.heading)}
              as="h1"
              tone="onDark"
            />
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <div className="mx-auto grid w-full max-w-5xl gap-12 xl:grid-cols-[0.85fr_1.15fr] xl:gap-16">
            <aside className="xl:pt-2">
              <p className="mb-8 text-[14px] leading-[2] tracking-[0.04em] text-cream/92 sm:text-[15px] sm:leading-[2.1]">
                <MultilineText text={t(locale, copy.form.lead)} />
              </p>
              <ul className="flex flex-col gap-4 border-t border-cream/12 pt-6">
                {[
                  t(locale, copy.form.closed),
                  t(locale, copy.form.advance),
                  t(locale, copy.form.hours),
                ].map((item) => (
                  <li
                    key={item}
                    className="border-b border-cream/12 pb-4 text-[13px] leading-[1.8] tracking-[0.04em] text-cream/88 sm:text-[14px]"
                  >
                    <MultilineText text={item} keepAll={false} />
                  </li>
                ))}
              </ul>
            </aside>

            <div className="border border-cream/10 bg-ink-raised px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <ReservationForm initialCourse={initialCourse} overrides={overrides} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
