"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";
import { CancellationPolicyContent } from "@/components/cancellation/CancellationPolicyContent";
import { cancellationPolicyPath, cancellationUi } from "@/lib/content/cancellationPolicy";
import { modalBackdrop, modalPanel } from "@/lib/motion/presets";

const noopSubscribe = () => () => {};

function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 「キャンセルポリシーを確認する」リンク。
 * JS 有効時はモーダルで開き（フォーム入力・言語・スクロール位置を保持）、
 * 無効時や新しいタブで開いた場合は専用ページへ遷移する。
 * モーダルは body 直下にポータルで描画するので、既存モーダルの上にも重ねられる。
 */
export function CancellationPolicyLink({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { t, locale } = useT();
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const reduceMotion = useReducedMotion() === true;
  const titleId = useId();
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    // Capture on window so Escape closes only this modal, not a parent modal
    // (e.g. the phone-reservation consent modal) listening on document.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panelRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey, true);

    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      // Return to the notice the guest was reading (no scroll jump).
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  const onTriggerClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab / window) open the standalone page.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    setOpen(true);
  };

  const modal = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 px-3 py-4 backdrop-blur-[2px] sm:px-6 sm:py-8"
          role="presentation"
          onClick={(event) => {
            // Never let clicks leak to a parent modal / form (React bubbles through portals).
            event.stopPropagation();
            if (event.target === event.currentTarget) close();
          }}
          {...modalBackdrop(reduceMotion)}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            lang={locale === "ja" ? "ja" : undefined}
            className="relative flex max-h-full w-full max-w-2xl flex-col border border-cream/15 bg-ink-raised shadow-2xl"
            {...modalPanel(reduceMotion)}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-cream/12 py-2 pl-5 pr-2 sm:pl-8">
              <p className="text-[10px] tracking-[0.28em] text-gold-ink sm:text-[11px]">
                {cancellationUi.eyebrow}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t(cancellationUi.close)}
                className="inline-flex size-11 items-center justify-center rounded-sm text-cream/75 transition-colors hover:bg-cream/5 hover:text-cream focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold-ink"
              >
                <X className="size-5" strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-10 sm:py-10">
              <CancellationPolicyContent locale={locale} titleId={titleId} />
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-cream/25 px-8 text-[14px] font-bold tracking-[0.12em] text-cream transition-colors hover:border-gold-ink hover:text-gold-ink sm:w-auto sm:min-w-[220px]"
                >
                  {t(cancellationUi.close)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <a
        ref={triggerRef}
        href={cancellationPolicyPath}
        onClick={onTriggerClick}
        aria-haspopup="dialog"
        className={className}
      >
        {children ?? t(cancellationUi.link)}
      </a>
      {isClient ? createPortal(modal, document.body) : null}
    </>
  );
}

/** フォーム・同意モーダル用：キャンセル料の案内文＋リンク */
export function CancellationNotice({
  className = "",
  align = "left",
}: {
  className?: string;
  align?: "left" | "center";
}) {
  const { t } = useT();
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <p className="text-pretty break-words text-[14px] leading-[1.9] tracking-[0.02em] text-cream sm:text-[15px]">
        {t(cancellationUi.notice)}
      </p>
      <CancellationPolicyLink className="mt-1 inline-flex min-h-11 items-center text-[14px] font-medium tracking-[0.04em] text-gold-ink underline decoration-gold-ink/55 underline-offset-[5px] transition-colors hover:decoration-gold-ink sm:text-[15px]">
        {t(cancellationUi.link)} →
      </CancellationPolicyLink>
    </div>
  );
}
