"use client";

import {
  executiveCourse,
  type CourseMenuData,
} from "@/lib/content/executiveCourse";
import { ReserveButton } from "@/components/ui/ReserveButton";
import { MultilineText } from "@/components/i18n/MultilineText";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";
import {
  formatCoursePriceMain,
  formatCoursePriceTax,
} from "@/lib/i18n/prices";

/**
 * Mobile / tablet: horizontal (yokogaki) dish list.
 * xl+ (Japanese): paper-menu tategaki columns — centered now that photos are removed.
 *
 * Apply `writing-mode: vertical-rl` to each text leaf only, never on the flex row.
 */
const verticalTextStyle = {
  writingMode: "vertical-rl",
  textOrientation: "mixed",
  fontFeatureSettings: '"vert", "vpal"',
  fontFamily: "var(--font-brush-jp)",
} as const;

const verticalDisplayStyle = {
  ...verticalTextStyle,
  fontFamily: "var(--font-brush-display-jp)",
} as const;

const dishNameClass =
  "text-[15px] leading-[1.7] tracking-[0.06em] text-cream sm:text-[16px]";

const dishNameTategakiClass =
  "text-[17px] font-normal text-cream min-[1440px]:text-[19px] min-[1536px]:text-[21px]";

const horizontalTextStyle = {
  writingMode: "horizontal-tb",
  textOrientation: "mixed",
} as const;

/** Upright Latin (e.g. "S") so it does not lie on its side in tategaki. */
const verticalUprightDisplayStyle = {
  ...verticalDisplayStyle,
  textOrientation: "upright",
} as const;

function CourseBadge({
  label,
  tail,
}: {
  label: string;
  tail?: string;
}) {
  const { tr } = useT();
  return (
    <span className="inline-block bg-gold px-4 py-1.5 text-[17px] font-medium tracking-[0.08em] text-ink sm:px-5 sm:py-2 sm:text-[18px]">
      {tr(label)}
      {tail ? (
        <>
          {" "}
          {tail}
        </>
      ) : null}
    </span>
  );
}

function CourseBadgeTategaki({
  label,
  tail,
}: {
  label: string;
  tail?: string;
}) {
  const { tr } = useT();
  const textClass =
    "text-[17px] font-medium leading-[1.85] tracking-[0.12em] text-ink min-[1440px]:text-[18px] min-[1440px]:leading-[1.9] min-[1440px]:tracking-[0.14em]";

  return (
    <div className="flex flex-col items-center gap-2 min-[1440px]:gap-2.5">
      <p className={textClass} style={verticalDisplayStyle}>
        {tr(label)}
      </p>
      {tail ? (
        <p
          className={`${textClass} whitespace-nowrap tracking-[0.04em]`}
          style={{
            ...horizontalTextStyle,
            fontFamily: "var(--font-brush-display-jp)",
          }}
        >
          {tail}
        </p>
      ) : null}
    </div>
  );
}

/** Render setNote so a leading ※ matches the gold dish marks; body color unchanged. */
function SetNoteText({ text }: { text: string }) {
  if (text.startsWith("※")) {
    return (
      <>
        <span className="text-gold">※</span>
        {text.slice(1)}
      </>
    );
  }
  return <>{text}</>;
}

export function CourseDetail({
  course,
  headingAs = "h2",
  id,
  nextCourseHref,
  showServiceFeeNote = false,
}: {
  course: CourseMenuData;
  headingAs?: "h1" | "h2";
  id?: string;
  nextCourseHref?: string;
  showServiceFeeNote?: boolean;
}) {
  const c = course;
  const { t, tr, trName, isJa, locale } = useT();
  const Heading = headingAs;
  const hasSet = c.dishes.some((dish) => dish.inSet);

  return (
    <article
      id={id}
      className="scroll-mt-24 w-full overflow-x-clip overflow-y-clip border-b border-cream/8 bg-ink py-14 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 xl:max-w-none xl:px-4 min-[1600px]:px-8">
        {/* Mobile / tablet: yokogaki */}
        <div className={isJa ? "xl:hidden" : ""}>
          <header className="mb-8 border-b border-cream/10 pb-6 text-center sm:mb-10 sm:pb-8">
            <Heading className="font-serif-jp mb-3 text-[26px] font-normal tracking-[0.2em] text-cream sm:text-[30px]">
              <span className="block">{trName(c.name)}</span>
              {isJa && c.nameTategakiRest ? (
                <span className="mt-2 block text-[20px] tracking-[0.12em] text-cream/90 sm:text-[22px]">
                  {tr(c.nameTategakiRest)}
                </span>
              ) : null}
            </Heading>
            {c.badge ? (
              <p className="mb-4">
                <CourseBadge label={c.badge} tail={c.badgeTail} />
              </p>
            ) : null}
            {c.subtitle ? (
              <p className="mx-auto mb-4 text-[15px] leading-[1.8] tracking-[0.06em] text-cream sm:text-[16px]">
                {tr(c.subtitle)}
              </p>
            ) : null}
            {c.priceInquiry ? (
              <p className="font-serif-jp mt-2 text-[16px] leading-[1.9] tracking-[0.08em] text-cream sm:text-[18px]">
                {t(copy.coursePage.priceInquiry)}
              </p>
            ) : (
              <>
                {c.altPrice ? (
                  <div className="mb-4">
                    <p className="mb-1 text-[13px] tracking-[0.12em] text-cream/90">
                      {tr(c.altPrice.label)}
                    </p>
                    <p className="font-serif-jp text-[20px] tracking-[0.08em] text-cream sm:text-[24px]">
                      {isJa ? (
                        <>
                          <span className="md:hidden">{c.altPrice.mainMobile}</span>
                          <span className="hidden md:inline">{c.altPrice.main}</span>
                        </>
                      ) : (
                        formatCoursePriceMain(locale, c.altPrice.mainMobile)
                      )}
                    </p>
                    <p className="mt-1 text-[13px] tracking-[0.08em] text-cream/92 sm:text-[14px]">
                      {isJa ? (
                        <>
                          <span className="md:hidden">{c.altPrice.taxNoteMobile}</span>
                          <span className="hidden md:inline">{c.altPrice.taxNote}</span>
                        </>
                      ) : (
                        formatCoursePriceTax(locale, c.altPrice.taxNoteMobile)
                      )}
                    </p>
                  </div>
                ) : null}
                {c.priceLabel ? (
                  <p className="mb-1 text-[13px] tracking-[0.12em] text-cream/90">
                    {tr(c.priceLabel)}
                  </p>
                ) : null}
                <p className="font-serif-jp text-[22px] tracking-[0.08em] text-cream sm:text-[26px]">
                  {isJa ? (
                    <>
                      <span className="md:hidden">{c.priceMainMobile}</span>
                      <span className="hidden md:inline">{c.priceMain}</span>
                    </>
                  ) : (
                    formatCoursePriceMain(locale, c.priceMainMobile)
                  )}
                </p>
                <p className="mt-1 text-[13px] tracking-[0.08em] text-cream/92 sm:text-[14px]">
                  {isJa ? (
                    <>
                      <span className="md:hidden">{c.priceTaxNoteMobile}</span>
                      <span className="hidden md:inline">{c.priceTaxNote}</span>
                    </>
                  ) : (
                    formatCoursePriceTax(locale, c.priceTaxNoteMobile)
                  )}
                </p>
              </>
            )}
          </header>

          {c.leftNote ? (
            <p className="mx-auto mb-6 max-w-2xl text-center text-[13px] leading-[1.9] tracking-[0.04em] text-cream/80 sm:text-[14px]">
              <MultilineText text={tr(c.leftNote)} keepAll={false} />
            </p>
          ) : null}

          <ul className="font-serif-jp mx-auto max-w-3xl divide-y divide-cream/10">
            {c.dishes.map((dish) => (
              <li
                key={`${dish.name}-${dish.note ?? ""}`}
                className="py-3.5 sm:py-4"
              >
                <div className="flex items-baseline justify-center gap-1.5">
                  <span
                    aria-hidden
                    className="w-4 shrink-0 text-right text-[13px] leading-[1.7] text-gold sm:text-[14px]"
                  >
                    {dish.inSet ? "※" : ""}
                  </span>
                  <div className="min-w-0 text-center">
                    {dish.nameMobileLines ? (
                      <>
                        <p className="text-[15px] leading-[1.7] tracking-[0.06em] text-cream md:hidden sm:text-[16px]">
                          <span className="block">{tr(dish.nameMobileLines[0])}</span>
                          <span className="block">{tr(dish.nameMobileLines[1])}</span>
                        </p>
                        <p className="hidden text-[15px] leading-[1.7] tracking-[0.06em] text-cream md:block sm:text-[16px]">
                          {trName(dish.name)}
                        </p>
                        {dish.note ? (
                          <p className={`${dishNameClass} mt-1`}>{tr(dish.note)}</p>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p className={dishNameClass}>{trName(dish.name)}</p>
                        {dish.note ? (
                          <p className={`${dishNameClass} mt-1`}>{tr(dish.note)}</p>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {hasSet ? (
            <p className="mx-auto mt-6 max-w-2xl text-center text-[13px] leading-[1.8] tracking-[0.04em] text-cream/80 sm:text-[14px]">
              <SetNoteText text={t(copy.coursePage.setNote)} />
            </p>
          ) : null}
        </div>

        {/* Desktop: tategaki columns (Japanese only) */}
        <div className={`hidden min-w-0 ${isJa ? "xl:block" : ""}`}>
          <div className="flex w-full justify-center">
            <div className="font-serif-jp flex flex-row-reverse items-start gap-2 pt-8 text-cream min-[1440px]:gap-3 min-[1440px]:pr-3 min-[1440px]:pt-10 min-[1600px]:gap-5 min-[1600px]:pr-6 min-[1800px]:gap-7 min-[1800px]:pr-10">
              {c.badge ? (
                <div className="flex w-12 shrink-0 items-center justify-center bg-gold py-8 min-[1440px]:w-14 min-[1440px]:py-10 min-[1536px]:py-12">
                  <CourseBadgeTategaki label={c.badge} tail={c.badgeTail} />
                </div>
              ) : null}

              {c.nameTategakiRest ? (
                <div className="flex shrink-0 flex-row-reverse items-start gap-0.5 min-[1440px]:gap-1">
                  <Heading
                    className="text-[30px] font-normal tracking-[0.32em] text-cream min-[1440px]:text-[36px] min-[1440px]:tracking-[0.4em]"
                    style={verticalDisplayStyle}
                  >
                    {trName(c.nameTategakiLead ?? c.name)}
                  </Heading>
                  <p
                    className="text-[19px] tracking-[0.14em] min-[1440px]:text-[24px] min-[1440px]:tracking-[0.18em]"
                    style={verticalDisplayStyle}
                  >
                    {tr(c.nameTategakiRest)}
                  </p>
                </div>
              ) : (
                <Heading
                  className="shrink-0 text-[30px] font-normal tracking-[0.32em] text-cream min-[1440px]:text-[36px] min-[1440px]:tracking-[0.4em]"
                  style={
                    c.id === "executive"
                      ? verticalUprightDisplayStyle
                      : verticalDisplayStyle
                  }
                >
                  {c.nameTategakiLead ? trName(c.nameTategakiLead) : trName(c.name)}
                </Heading>
              )}

              {c.subtitle ? (
                <p
                  className="shrink-0 leading-[1.85] tracking-[0.14em] text-cream min-[1440px]:leading-[2] min-[1440px]:tracking-[0.18em]"
                  style={verticalTextStyle}
                >
                  <span className={dishNameTategakiClass}>{tr(c.subtitle)}</span>
                </p>
              ) : null}

              <p
                className="shrink-0 leading-[1.45] min-[1440px]:ml-2 min-[1440px]:leading-[1.5] min-[1600px]:ml-4 min-[1800px]:ml-6"
                style={verticalTextStyle}
              >
                {c.priceInquiry ? (
                  <span className="text-[18px] tracking-[0.1em] text-cream min-[1440px]:text-[20px]">
                    {t(copy.coursePage.priceInquiry)}
                  </span>
                ) : (
                  <>
                    {c.altPrice ? (
                      <>
                        <span className="text-[13px] tracking-[0.1em] text-cream/90 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
                          {tr(c.altPrice.label)}
                        </span>
                        <br />
                        <span className="text-[22px] tracking-[0.08em] text-cream min-[1440px]:text-[26px] min-[1440px]:tracking-[0.1em]">
                          {c.altPrice.main}
                        </span>
                        <br />
                        <span className="text-[13px] tracking-[0.1em] text-cream/95 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
                          {c.altPrice.taxNote}
                        </span>
                        <br />
                      </>
                    ) : null}
                    {c.priceLabel ? (
                      <>
                        <span className="text-[13px] tracking-[0.1em] text-cream/90 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
                          {tr(c.priceLabel)}
                        </span>
                        <br />
                      </>
                    ) : null}
                    <span className="text-[26px] tracking-[0.08em] text-cream min-[1440px]:text-[30px] min-[1440px]:tracking-[0.1em]">
                      {c.priceMain}
                    </span>
                    <br />
                    <span className="text-[13px] tracking-[0.1em] text-cream/95 min-[1440px]:text-[15px] min-[1440px]:tracking-[0.12em]">
                      {c.priceTaxNote}
                    </span>
                  </>
                )}
              </p>

              {c.dishes.map((dish) => (
                <div
                  key={`${dish.name}-${dish.note ?? ""}`}
                  className="relative flex shrink-0 flex-col items-center min-[1600px]:ml-1 min-[1800px]:ml-2"
                >
                  {dish.inSet ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[1.2em] text-[15px] leading-none text-gold min-[1440px]:-translate-y-[1.3em] min-[1440px]:text-[17px]"
                    >
                      ※
                    </span>
                  ) : null}
                  <p
                    className="leading-[1.85] tracking-[0.14em] min-[1440px]:leading-[2] min-[1440px]:tracking-[0.18em]"
                    style={verticalTextStyle}
                  >
                    <span className={dishNameTategakiClass}>
                      {trName(dish.name)}
                    </span>
                    {dish.note ? (
                      <span className={dishNameTategakiClass}>
                        {"　"}
                        {tr(dish.note)}
                      </span>
                    ) : null}
                  </p>
                </div>
              ))}

              {hasSet ? (
                <p
                  className="shrink-0 self-start pl-2 leading-[1.85] tracking-[0.14em] text-cream/80 min-[1440px]:pl-4 min-[1440px]:leading-[2]"
                  style={verticalTextStyle}
                >
                  <span className="text-[14px] min-[1440px]:text-[16px]">
                    <SetNoteText text={t(copy.coursePage.setNote)} />
                  </span>
                </p>
              ) : c.leftNote ? (
                <div className="flex shrink-0 flex-row-reverse items-start gap-1 self-start pl-2 min-[1440px]:pl-4">
                  {tr(c.leftNote)
                    .split("\n")
                    .map((line, i) => (
                      <p
                        key={i}
                        className="leading-[1.9] tracking-[0.1em] text-cream/80 min-[1440px]:leading-[2]"
                        style={verticalTextStyle}
                      >
                        <span className="text-[14px] min-[1440px]:text-[16px]">
                          {line}
                        </span>
                      </p>
                    ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center sm:mt-12 lg:mt-14">
          <ReserveButton
            courseId={course.id}
            className="min-h-11 w-full max-w-sm px-8 py-3.5 text-[14px] tracking-[0.14em] hover:bg-wipe hover:text-cream sm:w-auto sm:min-w-[280px]"
          />
        </div>
        {showServiceFeeNote ? (
          <p className="mx-auto mt-5 max-w-[36rem] text-center text-[13px] leading-[1.9] tracking-[0.08em] text-cream/85 sm:text-[14px]">
            {t(copy.coursePage.serviceFee)}
          </p>
        ) : null}
      </div>

      {nextCourseHref ? (
        <a
          href={nextCourseHref}
          className="mt-10 flex min-h-11 items-center justify-center text-[22px] leading-none text-cream/92 transition-colors hover:text-cream sm:mt-14 sm:text-[26px]"
          aria-label={t(copy.coursePage.next)}
        >
          ▽
        </a>
      ) : null}
    </article>
  );
}

/** @deprecated Use CourseDetail with executiveCourse */
export function ExecutiveCourse() {
  return <CourseDetail course={executiveCourse} headingAs="h1" />;
}
