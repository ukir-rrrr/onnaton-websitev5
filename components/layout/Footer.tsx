"use client";

import { siteConfig } from "@/lib/content/store";
import { MultilineText } from "@/components/i18n/MultilineText";
import { useT } from "@/components/i18n/LocaleProvider";

export function Footer() {
  const { tr, isJa } = useT();
  return (
    <footer className="flex w-full flex-col items-center gap-3 border-t border-cream/10 px-6 py-10 text-center sm:flex-row sm:justify-between sm:px-10 sm:py-14 sm:text-left lg:px-14">
      <span className="font-serif-jp text-xl tracking-[0.08em] text-cream">
        {isJa ? (
          <>
            <span className="sm:hidden">
              <MultilineText text={siteConfig.formalNameMobile} keepAll={false} />
            </span>
            <span className="hidden sm:inline">{siteConfig.formalName}</span>
          </>
        ) : (
          tr(siteConfig.formalName)
        )}
      </span>
      <span className="text-[13px] text-cream/65">
        © {siteConfig.name} All Rights Reserved.
      </span>
    </footer>
  );
}
