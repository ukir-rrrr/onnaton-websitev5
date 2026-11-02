import type { Locale } from "@/lib/i18n/config";
import { resolveContentLocale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/types";
import { siteConfig } from "@/lib/content/store";
import {
  cancellationMailSubject,
  cancellationPolicy,
  cancellationUi,
} from "@/lib/content/cancellationPolicy";

/**
 * キャンセルポリシー本文。専用ページとモーダルで共用（hooks なし）。
 * 連絡先は海外向け4言語のみメール（mailto:）を表示。日本語は本文の案内のみ。
 */
export function CancellationPolicyContent({
  locale,
  titleId,
  headingLevel = "h2",
  showTitle = true,
}: {
  locale: Locale;
  titleId?: string;
  headingLevel?: "h1" | "h2";
  showTitle?: boolean;
}) {
  const doc = cancellationPolicy[resolveContentLocale(locale)];
  const isJa = locale === "ja";
  const Title = headingLevel;

  return (
    <div className="text-left text-cream">
      {showTitle ? (
        <Title
          id={titleId}
          className="font-serif-jp mb-6 text-center text-[20px] font-normal tracking-[0.12em] text-cream sm:mb-8 sm:text-[24px]"
        >
          {doc.title}
        </Title>
      ) : null}

      <div className="space-y-3 text-[14px] leading-[1.95] tracking-[0.02em] text-cream/92 sm:text-[15px]">
        {doc.intro.map((paragraph) => (
          <p key={paragraph} className="text-pretty break-words">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 space-y-8 sm:mt-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="font-serif-jp mb-3 border-b border-gold-ink/35 pb-2 text-[16px] font-medium tracking-[0.08em] text-cream sm:text-[17px]">
              {section.heading}
            </h3>
            {section.fees ? (
              <dl className="divide-y divide-cream/10 border-b border-cream/10">
                {section.fees.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <dt className="text-[14px] leading-[1.7] text-cream/88 sm:text-[15px]">
                      {label}
                    </dt>
                    <dd className="text-[15px] font-medium leading-[1.7] tracking-[0.04em] text-gold-ink sm:text-right sm:text-[16px]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {section.note ? (
              <p className="mt-3 text-pretty break-words text-[13px] leading-[1.85] text-cream/80 sm:text-[14px]">
                {section.note}
              </p>
            ) : null}
            {section.items ? (
              <ul className="space-y-2 text-[14px] leading-[1.9] text-cream/92 sm:text-[15px]">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-pretty break-words">
                    <span aria-hidden className="shrink-0 text-gold-ink">
                      ・
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {/* 日本語は本文の「お電話にてご連絡ください」のみ（番号は出さない）。海外向けはメール連絡先を表示。 */}
      {isJa ? null : (
        <div className="mt-8 border border-gold/35 bg-ink px-5 py-5 text-center sm:mt-10">
          <p className="mb-2 text-[11px] tracking-[0.2em] text-gold-ink sm:text-[12px]">
            {t(locale, cancellationUi.contactEmail)}
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(cancellationMailSubject)}`}
            className="inline-flex min-h-11 items-center justify-center break-all text-[16px] font-medium tracking-[0.04em] text-cream underline decoration-gold-ink/50 underline-offset-[6px] transition-colors hover:text-gold-ink sm:text-[18px]"
          >
            {siteConfig.contactEmail}
          </a>
          <p className="mt-1 text-[12px] leading-[1.7] text-cream/65">
            {t(locale, cancellationUi.contactEmailHint)}
          </p>
        </div>
      )}

      <p className="mt-8 text-pretty break-words text-[14px] leading-[1.95] tracking-[0.02em] text-cream/92 sm:text-[15px]">
        {doc.closing}
      </p>
    </div>
  );
}
