import { MultilineText } from "@/components/i18n/MultilineText";
import { copy } from "@/lib/i18n/copy";
import type { Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/types";

/** JA appeal copy: fixed `\n` lines on phones; merged lines from sm+ (PC). */
function JaAppealParagraph({
  text,
  mergeDesktop,
}: {
  text: string;
  mergeDesktop: (parts: string[]) => string | null;
}) {
  const parts = text.split("\n");
  const desktopText = mergeDesktop(parts) ?? text;

  return (
    <>
      <span className="sm:hidden">
        <MultilineText text={text} keepLinesIntact />
      </span>
      <span className="hidden sm:inline">
        <MultilineText text={desktopText} />
      </span>
    </>
  );
}

const mergeJaAppealBody1Desktop = (parts: string[]) =>
  parts.length === 3 ? `${parts[0]}\n${parts[1]}${parts[2]}` : null;

const mergeJaAppealBody2Desktop = (parts: string[]) =>
  parts.length === 4 ? `${parts[0]}${parts[1]}\n${parts[2]}${parts[3]}` : null;

function AppealBodyText({ locale, text }: { locale: Locale; text: string }) {
  if (locale === "ja") {
    return <MultilineText text={text} />;
  }

  const flowing = text.replace(/\n/g, " ");

  return (
    <>
      <span className="xl:hidden">
        <MultilineText text={text} keepAll={false} />
      </span>
      <span className="hidden text-pretty xl:inline">{flowing}</span>
    </>
  );
}

export function CourseMenuAppeal({ locale }: { locale: Locale }) {
  const appealLineClass =
    locale === "ja"
      ? "font-serif-jp text-[20px] leading-[1.7] tracking-[0.2em] text-cream sm:text-[30px]"
      : "font-serif-jp text-[20px] leading-[1.75] tracking-[0.06em] text-cream sm:text-[24px] xl:text-[26px] xl:leading-[1.85]";

  const widthClass =
    locale === "ja" ? "max-w-3xl" : "max-w-3xl xl:max-w-5xl 2xl:max-w-[54rem]";

  return (
    <section
      aria-label={t(locale, copy.coursePage.appealSectionAria)}
      className="border-b border-cream/8 bg-ink px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20 lg:px-12 lg:pt-24 xl:px-4 min-[1600px]:px-8"
    >
      <div className={`mx-auto flex flex-col gap-5 sm:gap-6 ${widthClass}`}>
        <p className={appealLineClass}>{t(locale, copy.coursePage.appealLead)}</p>
        <p className={appealLineClass}>
          {locale === "ja" ? (
            <JaAppealParagraph
              text={t(locale, copy.coursePage.appealBody1)}
              mergeDesktop={mergeJaAppealBody1Desktop}
            />
          ) : (
            <AppealBodyText locale={locale} text={t(locale, copy.coursePage.appealBody1)} />
          )}
        </p>
        <p className={appealLineClass}>
          {locale === "ja" ? (
            <JaAppealParagraph
              text={t(locale, copy.coursePage.appealBody2)}
              mergeDesktop={mergeJaAppealBody2Desktop}
            />
          ) : (
            <AppealBodyText locale={locale} text={t(locale, copy.coursePage.appealBody2)} />
          )}
        </p>
      </div>
    </section>
  );
}
