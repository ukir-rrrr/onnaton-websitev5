import { copy } from "@/lib/i18n/copy";
import { getLocale } from "@/lib/i18n/getLocale";
import { t } from "@/lib/i18n/types";
import { getActiveNotices } from "@/lib/supabase/notices";
import { SiteNoticesBody } from "@/components/sections/SiteNoticesBody";

export async function SiteNotices() {
  const [locale, notices] = await Promise.all([getLocale(), getActiveNotices()]);

  return (
    <section
      id="notices"
      className="scroll-mt-24 relative w-full overflow-hidden border-y-2 border-gold/35 bg-ink-raised"
      aria-label={t(locale, copy.siteNotices.heading)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold/20" aria-hidden />
      <SiteNoticesBody
        heading={t(locale, copy.siteNotices.heading)}
        emptyText={t(locale, copy.siteNotices.empty)}
        notices={notices}
      />
    </section>
  );
}
