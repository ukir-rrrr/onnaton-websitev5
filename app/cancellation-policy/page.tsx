import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/cancellation/BackButton";
import { CancellationPolicyContent } from "@/components/cancellation/CancellationPolicyContent";
import { cancellationPolicy, cancellationUi } from "@/lib/content/cancellationPolicy";
import { resolveContentLocale } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/getLocale";
import { t } from "@/lib/i18n/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = cancellationPolicy[resolveContentLocale(locale)].title;
  return {
    title: locale === "ja" ? `${title} | 恩納豚（おんなとん）` : `${title} | ONNATON`,
    description: t(locale, cancellationUi.metaDesc),
  };
}

export default async function CancellationPolicyPage() {
  const locale = await getLocale();

  return (
    <div className="relative w-full overflow-x-clip bg-ink text-cream">
      <div className="relative">
        <Header />
        <div className="h-20 bg-ink" aria-hidden />
      </div>

      <main className="px-4 py-12 sm:px-10 sm:py-20 lg:px-14">
        <div className="mx-auto w-full max-w-2xl">
          <div className="relative border border-cream/10 bg-ink-raised">
            <div className="flex items-center justify-between gap-3 border-b border-cream/12 py-2 pl-5 pr-2 sm:pl-8">
              <p className="text-[10px] tracking-[0.28em] text-gold-ink sm:text-[11px]">
                {cancellationUi.eyebrow}
              </p>
              <BackButton label={t(locale, cancellationUi.back)} variant="icon" />
            </div>
            <div className="px-5 py-8 sm:px-10 sm:py-12">
              <CancellationPolicyContent locale={locale} headingLevel="h1" />
              <div className="mt-10 flex justify-center">
                <BackButton label={t(locale, cancellationUi.back)} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
