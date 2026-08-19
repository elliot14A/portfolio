import { ok } from "neverthrow";
import type {
  Calendar,
  CalendarDay,
  CalendarWeek,
} from "@/core/git/contributions";
import type { FetchCalendar } from "@/core/git/ports";

const WEEKS = 53;
const DAY_MS = 86_400_000;

// A fixed anchor and an arithmetic count keep the sample identical on every
// run, so tests and dev screenshots do not flicker.
const ANCHOR = Date.parse("2025-08-20T00:00:00Z");
const FIRST_WEEKDAY = 3;
const LAST_WEEKDAY = 2;

const dateAt = (offset: number): string =>
  new Date(ANCHOR + offset * DAY_MS).toISOString().slice(0, 10);

const countAt = (offset: number): number =>
  offset % 11 === 0 || offset % 17 === 0 ? 0 : (offset * 31) % 9;

const weekdaysOf = (week: number): number[] =>
  Array.from({ length: 7 }, (_, weekday) => weekday).filter(
    (weekday) =>
      (week !== 0 || weekday >= FIRST_WEEKDAY) &&
      (week !== WEEKS - 1 || weekday <= LAST_WEEKDAY),
  );

const dayAt = (week: number, weekday: number): CalendarDay => {
  const offset = week * 7 + weekday - FIRST_WEEKDAY;
  return { date: dateAt(offset), weekday, count: countAt(offset) };
};

const sample = (): Calendar => {
  const weeks: ReadonlyArray<CalendarWeek> = Array.from(
    { length: WEEKS },
    (_, week) => ({ days: weekdaysOf(week).map((day) => dayAt(week, day)) }),
  );
  const total = weeks
    .flatMap((week) => week.days)
    .reduce((sum, day) => sum + day.count, 0);
  return { total, weeks };
};

export const stubFetchCalendar: FetchCalendar = async () => ok(sample());
