import { Fragment } from "react";

type MultilineTextProps = {
  text: string;
  /** Prevent mid-word wraps in Japanese (default: true). */
  keepAll?: boolean;
  /** Keep the last `\n`-split line on one row (sm+ only; wraps on phones). */
  nowrapLastLine?: boolean;
  /** Keep the last `\n`-split line on one row at every viewport. */
  alwaysNowrapLastLine?: boolean;
};

/** Renders copy with intentional `\n` as line breaks (not width-based wrapping). */
export function MultilineText({
  text,
  keepAll = true,
  nowrapLastLine = false,
  alwaysNowrapLastLine = false,
}: MultilineTextProps) {
  const lines = text.split("\n");
  const keepClass = keepAll
    ? "max-sm:break-words sm:break-keep"
    : "break-words";

  if (lines.length === 1) {
    return keepAll ? <span className={keepClass}>{text}</span> : text;
  }

  return (
    <>
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        const className = [
          keepClass,
          alwaysNowrapLastLine && isLast
            ? "whitespace-nowrap"
            : nowrapLastLine && isLast
              ? "max-sm:whitespace-normal sm:whitespace-nowrap"
              : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Fragment key={i}>
            {i > 0 ? <br /> : null}
            <span className={className || undefined}>{line}</span>
          </Fragment>
        );
      })}
    </>
  );
}
