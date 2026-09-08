"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/content/store";
import { copy } from "@/lib/i18n/copy";
import { useT } from "@/components/i18n/LocaleProvider";
import { MultilineText } from "@/components/i18n/MultilineText";
import { splitReservationPolicy } from "@/lib/content/reservationPolicy";
import { modalBackdrop, modalPanel } from "@/lib/motion/presets";

interface ReserveButtonProps {
  variant?: "solid" | "outline";
  /** Use gold (not gold-ink) for the outline over dark photo backgrounds. */
  tone?: "default" | "onDark";
  className?: string;
  children?: React.ReactNode;
  /** Pre-select this course on the online form (EN / KO / ZH). */
  courseId?: string;
}

/** JA: phone reservation (behind a policy consent gate). EN / KO / ZH: online form. */
export function ReserveButton({
  variant = "solid",
  tone = "default",
  className = "",
  children,
  courseId,
}: ReserveButtonProps) {
  const { t, isJa } = useT();
  const label = children ?? (isJa ? t(copy.reserve.call) : t(copy.reserve.online));
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const reduceMotion = useReducedMotion() === true;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const base =
    "inline-flex items-center justify-center rounded-sm text-[14px] font-bold tracking-[0.05em] transition-colors";
  const outlineStyles =
    tone === "onDark"
      ? "border border-gold text-gold hover:bg-gold hover:text-ink"
      : "border border-gold-ink text-gold-ink hover:bg-gold-ink hover:text-on-dark";
  const styles =
    variant === "solid" ? "bg-gold text-ink hover:bg-cream" : outlineStyles;

  if (!isJa) {
    const href = "/reserve/intl";
    return (
      <Link href={href} className={`${base} ${styles} ${className}`}>
        {label}
      </Link>
    );
  }

  const policy = splitReservationPolicy(t(copy.intlForm.policyItems));

  const openModal = (event: React.MouseEvent) => {
    // Always gate behind the policy modal — never dial directly (incl. mobile).
    event.preventDefault();
    setAgreed(false);
    setCopied(false);
    setOpen(true);
  };

  const copyNumber = async () => {
    if (!agreed) return;
    try {
      await navigator.clipboard.writeText(siteConfig.reservationPhoneDisplay);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* href kept as a no-JS fallback; JS always opens the consent modal. */}
      <a
        href={siteConfig.reservationPhoneHref}
        className={`${base} ${styles} ${className}`}
        onClick={openModal}
      >
        {label}
      </a>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-6 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            role="presentation"
            {...modalBackdrop(reduceMotion)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="max-h-[90dvh] w-full max-w-lg overflow-y-auto border border-cream/15 bg-ink-raised px-6 py-9 text-center shadow-2xl sm:px-10 sm:py-12"
              onClick={(event) => event.stopPropagation()}
              {...modalPanel(reduceMotion)}
            >
              <h2
                id={titleId}
                className="font-serif-jp mb-5 text-[20px] tracking-[0.12em] text-cream sm:text-[22px]"
              >
                {t(copy.intlForm.policyHeading)}
              </h2>

              <ul className="mx-auto max-w-md list-disc space-y-2 pl-5 text-left text-[13px] leading-[1.9] tracking-[0.02em] text-cream/90 sm:text-[14px]">
                {policy.bullets.map((item) => (
                  <li key={item}>
                    <MultilineText text={item} keepAll={false} />
                  </li>
                ))}
              </ul>
              {policy.notes.length > 0 ? (
                <div className="mx-auto mt-3 max-w-md space-y-1 text-left text-[13px] leading-[1.8] text-cream/75">
                  {policy.notes.map((note) => (
                    <p key={note}>
                      <MultilineText text={note} keepAll={false} />
                    </p>
                  ))}
                </div>
              ) : null}

              <label className="mx-auto mt-6 flex min-h-11 max-w-md cursor-pointer items-start gap-3 border-y border-cream/12 py-4 text-left text-[13px] leading-[1.8] text-cream/95 sm:text-[14px]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 accent-gold"
                />
                <span>{t(copy.intlForm.agreePolicy)}</span>
              </label>

              <div className="mt-6">
                <p className="mb-2 text-xs tracking-[0.28em] text-gold-ink sm:text-[12px]">
                  {t(copy.reserve.phoneLabel)}
                </p>
                {agreed ? (
                  <p className="font-serif-jp mb-2 text-[30px] font-medium tracking-[0.08em] text-cream sm:text-[40px]">
                    {siteConfig.reservationPhoneDisplay}
                  </p>
                ) : (
                  <p
                    className="font-serif-jp mb-2 text-[30px] font-medium tracking-[0.2em] text-cream/45 sm:text-[40px]"
                    aria-hidden
                  >
                    — — —
                  </p>
                )}
                <p className="mb-2 text-[13px] leading-[1.8] tracking-[0.04em] text-cream/82">
                  {t(copy.reserve.hours)}
                </p>
                <p className="mb-6 text-[12px] leading-[1.8] tracking-[0.04em] text-cream/70">
                  <span className="sm:hidden">
                    <MultilineText text={t(copy.reserve.hoursNoteMobile)} keepAll={false} />
                  </span>
                  <span className="hidden sm:inline">
                    <MultilineText text={t(copy.reserve.hoursNote)} keepAll={false} />
                  </span>
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={copyNumber}
                    disabled={!agreed}
                    aria-disabled={!agreed}
                    className={`inline-flex min-h-11 w-full items-center justify-center rounded-sm bg-gold px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-ink transition-colors hover:bg-cream ${
                      agreed ? "" : "pointer-events-none opacity-50"
                    }`}
                  >
                    {copied ? t(copy.reserve.copied) : t(copy.reserve.copy)}
                  </button>
                  {agreed ? (
                    <a
                      href={siteConfig.reservationPhoneHref}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-cream/25 px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-cream transition-colors hover:border-gold-ink hover:text-gold-ink"
                    >
                      {t(copy.reserve.dial)}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      aria-disabled="true"
                      className="pointer-events-none inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-cream/25 px-6 py-3.5 text-[14px] font-bold tracking-[0.14em] text-cream opacity-50"
                    >
                      {t(copy.reserve.dial)}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-1 flex min-h-11 w-full items-center justify-center text-[13px] tracking-[0.12em] text-cream/70 transition-colors hover:text-cream/88"
                  >
                    {t(copy.reserve.close)}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
