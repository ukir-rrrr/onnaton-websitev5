import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntlReserveMain } from "@/components/reserve/IntlReserveMain";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";
import { SiteNotices } from "@/components/sections/SiteNotices";
import { photos } from "@/lib/content/photos";
import { getLocale } from "@/lib/i18n/getLocale";
import { copy } from "@/lib/i18n/copy";
import { t } from "@/lib/i18n/types";
import { splitReservationPolicy } from "@/lib/content/reservationPolicy";
import { getReservationDateOverrideLists } from "@/lib/supabase/date-overrides";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, copy.meta.intlReserveTitle),
    description: t(locale, copy.meta.intlReserveDesc),
  };
}

export default async function IntlReservePage() {
  const locale = await getLocale();
  const policy = splitReservationPolicy(t(locale, copy.intlForm.policyItems));
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
              heading={t(
                locale,
                locale === "ja" ? copy.intlForm.jaHeading : copy.intlForm.heading,
              )}
              as="h1"
              tone="onDark"
            />
          </div>
        </section>

        <SiteNotices />

        <section className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <IntlReserveMain policy={policy} overrides={overrides} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
