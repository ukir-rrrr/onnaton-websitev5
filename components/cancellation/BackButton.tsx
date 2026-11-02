"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

/**
 * 専用ページの戻るボタン。サイト内から来た場合は履歴を戻り（元の位置へ）、
 * 直接開いた場合はトップの「ご予約について」へ移動する。
 */
export function BackButton({
  label,
  variant = "text",
}: {
  label: string;
  variant?: "text" | "icon";
}) {
  const router = useRouter();

  const goBack = () => {
    let sameOrigin = false;
    try {
      sameOrigin =
        document.referrer !== "" &&
        new URL(document.referrer).origin === window.location.origin;
    } catch {
      sameOrigin = false;
    }
    if (sameOrigin && window.history.length > 1) {
      router.back();
    } else {
      router.push("/#reserve");
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={goBack}
        aria-label={label}
        className="inline-flex size-11 items-center justify-center rounded-sm text-cream/75 transition-colors hover:bg-cream/5 hover:text-cream"
      >
        <X className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-cream/25 px-8 text-[14px] font-bold tracking-[0.12em] text-cream transition-colors hover:border-gold-ink hover:text-gold-ink sm:w-auto sm:min-w-[220px]"
    >
      {label}
    </button>
  );
}
