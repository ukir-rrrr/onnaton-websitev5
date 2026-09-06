"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
} from "react";
import { CalendarDays } from "lucide-react";
import {
  emptyDateOverrideLists,
  makeIsClosedDate,
  type DateOverrideLists,
} from "@/lib/content/reservation";
import { parseYmd } from "@/lib/date/calendar";
import {
  datePickerLabels,
  formatPickerDisplayDate,
} from "@/lib/i18n/datePicker";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DatePickerCalendar } from "@/components/ui/DatePickerCalendar";

export const dateInputClass =
  "date-input relative box-border w-full min-w-0 max-w-full rounded-sm border border-cream/18 bg-ink-raised py-3.5 pl-4 pr-11 text-left text-[16px] text-cream outline-none transition-colors focus:border-gold sm:text-[15px]";

type DateFieldProps = {
  id: string;
  name?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** @deprecated Native lang is unused with the custom picker. */
  lang?: string;
  overrides?: DateOverrideLists;
};

function initialView(value: string, min: string) {
  const parsed = parseYmd(value) ?? parseYmd(min);
  if (parsed) return { year: parsed.year, month: parsed.month };
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function DateField({
  id,
  name,
  value = "",
  onChange,
  min = "",
  max = "",
  required,
  disabled,
  className,
  overrides = emptyDateOverrideLists,
}: DateFieldProps) {
  const locale = useLocale();
  const labels = datePickerLabels(locale);
  const shellRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [view, setView] = useState(() => initialView(value, min));
  const isDisabled = useMemo(() => makeIsClosedDate(overrides), [overrides]);

  const displayValue = useMemo(
    () => (value ? formatPickerDisplayDate(locale, value) : ""),
    [locale, value],
  );

  const emitChange = (next: string) => {
    if (next) setInvalid(false);
    onChange?.({
      target: { value: next },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  useEffect(() => {
    const form = shellRef.current?.closest("form");
    if (!form || !hiddenRef.current) return;

    const onInvalid = (event: Event) => {
      if (event.target !== hiddenRef.current) return;
      event.preventDefault();
      setInvalid(true);
      buttonRef.current?.focus();
    };

    const clearInvalid = () => setInvalid(false);

    form.addEventListener("invalid", onInvalid, true);
    form.addEventListener("input", clearInvalid, true);
    form.addEventListener("change", clearInvalid, true);
    return () => {
      form.removeEventListener("invalid", onInvalid, true);
      form.removeEventListener("input", clearInvalid, true);
      form.removeEventListener("change", clearInvalid, true);
    };
  }, []);

  const openPicker = () => {
    if (disabled) return;
    if (value) {
      const parsed = parseYmd(value);
      if (parsed) setView({ year: parsed.year, month: parsed.month });
    }
    setOpen((current) => !current);
  };

  const buttonClass = [
    className ?? dateInputClass,
    disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
    !displayValue ? "text-cream/35" : "",
    invalid ? "border-gold ring-1 ring-gold/45" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={shellRef} className="date-input-shell">
      <input
        ref={hiddenRef}
        type="text"
        name={name}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute h-px w-px opacity-0"
        readOnly
        onChange={() => {}}
      />
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={openPicker}
        className={buttonClass}
      >
        {displayValue || labels.placeholder}
      </button>
      <span className="date-input-trigger pointer-events-none" aria-hidden="true">
        <CalendarDays className="size-[18px] text-cream/55" strokeWidth={1.5} />
      </span>

      <DatePickerCalendar
        locale={locale}
        open={open}
        onClose={() => setOpen(false)}
        viewYear={view.year}
        viewMonth={view.month}
        onViewChange={(year, month) => setView({ year, month })}
        value={value}
        onSelect={emitChange}
        onClear={() => emitChange("")}
        min={min}
        max={max}
        isDisabled={isDisabled}
        anchorRef={shellRef}
      />
    </div>
  );
}
