/** Calendar helpers (JST YMD strings: YYYY-MM-DD). */

export function parseYmd(ymd: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

export function toYmd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function compareYmd(a: string, b: string): number {
  return a.localeCompare(b);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** 0 = Sunday … 6 = Saturday (JST noon anchor). */
export function weekdayFromYmd(ymd: string): number {
  return new Date(`${ymd}T12:00:00+09:00`).getUTCDay();
}

export function firstWeekdayOfMonth(year: number, month: number): number {
  return weekdayFromYmd(toYmd(year, month, 1));
}

export type CalendarCell =
  | { kind: "empty" }
  | { kind: "day"; ymd: string; day: number };

/** Sunday-start grid (6 rows × 7 cols). */
export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const totalDays = daysInMonth(year, month);
  const leading = firstWeekdayOfMonth(year, month);
  const cells: CalendarCell[] = [];

  for (let i = 0; i < leading; i++) cells.push({ kind: "empty" });
  for (let day = 1; day <= totalDays; day++) {
    cells.push({ kind: "day", ymd: toYmd(year, month, day), day });
  }
  while (cells.length % 7 !== 0) cells.push({ kind: "empty" });
  while (cells.length < 42) cells.push({ kind: "empty" });

  return cells;
}

export function clampViewMonth(
  year: number,
  month: number,
  minYmd: string,
  maxYmd: string,
): { year: number; month: number } {
  const min = parseYmd(minYmd);
  const max = parseYmd(maxYmd);
  if (!min || !max) return { year, month };

  let y = year;
  let m = month;
  const cmpMin = y * 100 + m - (min.year * 100 + min.month);
  const cmpMax = y * 100 + m - (max.year * 100 + max.month);
  if (cmpMin < 0) return { year: min.year, month: min.month };
  if (cmpMax > 0) return { year: max.year, month: max.month };
  return { year: y, month: m };
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export function monthsBetween(minYmd: string, maxYmd: string): { year: number; month: number }[] {
  const min = parseYmd(minYmd);
  const max = parseYmd(maxYmd);
  if (!min || !max) return [];

  const months: { year: number; month: number }[] = [];
  let year = min.year;
  let month = min.month;
  while (year * 100 + month <= max.year * 100 + max.month) {
    months.push({ year, month });
    const next = addMonths(year, month, 1);
    year = next.year;
    month = next.month;
  }
  return months;
}
