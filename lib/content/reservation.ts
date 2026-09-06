export const reservationTimeSlots = ["17:30", "18:00", "18:30", "19:00"] as const;

export const reservationCourseIds = [
  "executive",
  "hana",
  "kiwami",
  "kou",
  "chateaubriand",
  "undecided",
] as const;

export const reservationSeatingIds = ["tatami", "table", "either"] as const;

export const reservationGuestIds = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9plus",
] as const;

/** Tuesday / Wednesday */
const closedWeekdays = new Set([2, 3]);

export const reservationMaxAdvanceDays = 30;
/** How far ahead the owner can mark extra open / closed days. */
export const reservationOverrideHorizonDays = 60;

export type DateOverrideLists = {
  open: readonly string[];
  closed: readonly string[];
};

export type DateOverrides = {
  open: ReadonlySet<string>;
  closed: ReadonlySet<string>;
};

export const emptyDateOverrideLists: DateOverrideLists = {
  open: [],
  closed: [],
};

export function toDateOverrides(
  lists: DateOverrideLists = emptyDateOverrideLists,
): DateOverrides {
  return {
    open: new Set(lists.open),
    closed: new Set(lists.closed),
  };
}

export function makeIsClosedDate(lists: DateOverrideLists = emptyDateOverrideLists) {
  const overrides = toDateOverrides(lists);
  return (ymd: string) => isClosedDate(ymd, overrides);
}

export type ReservationCourseId = (typeof reservationCourseIds)[number];
export type ReservationSeatingId = (typeof reservationSeatingIds)[number];
export type ReservationTimeSlot = (typeof reservationTimeSlots)[number];
export type ReservationGuestId = (typeof reservationGuestIds)[number];

export function isReservationCourseId(value: string): value is ReservationCourseId {
  return (reservationCourseIds as readonly string[]).includes(value);
}

export function isReservationSeatingId(value: string): value is ReservationSeatingId {
  return (reservationSeatingIds as readonly string[]).includes(value);
}

export function isReservationTimeSlot(value: string): value is ReservationTimeSlot {
  return (reservationTimeSlots as readonly string[]).includes(value);
}

export function isReservationGuestId(value: string): value is ReservationGuestId {
  return (reservationGuestIds as readonly string[]).includes(value);
}

export function tokyoTodayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addCalendarDays(ymd: string, days: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function weekdayJst(ymd: string): number {
  return new Date(`${ymd}T12:00:00+09:00`).getUTCDay();
}

export function isRegularClosedDate(ymd: string): boolean {
  return closedWeekdays.has(weekdayJst(ymd));
}

export function isClosedDate(
  ymd: string,
  overrides: DateOverrides = toDateOverrides(),
): boolean {
  if (overrides.open.has(ymd)) return false;
  if (overrides.closed.has(ymd)) return true;
  return isRegularClosedDate(ymd);
}

export function minBookableDate(now = new Date()): string {
  return addCalendarDays(tokyoTodayYmd(now), 1);
}

export function maxBookableDate(now = new Date()): string {
  return addCalendarDays(tokyoTodayYmd(now), reservationMaxAdvanceDays);
}

export function maxOverrideDate(now = new Date()): string {
  return addCalendarDays(tokyoTodayYmd(now), reservationOverrideHorizonDays);
}

export function isBookableDate(
  ymd: string,
  now = new Date(),
  overrides: DateOverrides = toDateOverrides(),
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
  if (isClosedDate(ymd, overrides)) return false;
  return ymd >= minBookableDate(now) && ymd <= maxBookableDate(now);
}
