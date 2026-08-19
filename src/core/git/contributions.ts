import { err, ok } from "neverthrow";
import { type AppResult, appError, GitErrorCode } from "@/core/error";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type CalendarDay = Readonly<{
  date: string;
  weekday: number;
  count: number;
}>;

export type CalendarWeek = Readonly<{ days: ReadonlyArray<CalendarDay> }>;

export type Calendar = Readonly<{
  total: number;
  weeks: ReadonlyArray<CalendarWeek>;
}>;

export type Cell = Readonly<{
  date: string;
  count: number;
  level: ContributionLevel;
}>;

export type MonthSpan = Readonly<{
  label: string;
  span: number;
}>;

export type ContributionGraph = Readonly<{
  total: number;
  weeks: number;
  months: ReadonlyArray<MonthSpan>;
  rows: ReadonlyArray<ReadonlyArray<Cell | null>>;
}>;

const ROWS = 7;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

// Plain string slicing on YYYY-MM-DD: no Date, so no timezone can shift a label
// into the wrong column.
const monthOf = (date: string): string =>
  MONTHS[Number(date.slice(5, 7)) - 1] ?? "";

// One entry per run of consecutive weeks in the same month, so the header can
// span each run and stay aligned with the columns below it.
const monthsOf = (weeks: ReadonlyArray<CalendarWeek>): MonthSpan[] => {
  const labels = weeks.map((week) => {
    const first = week.days[0];
    return first === undefined ? "" : monthOf(first.date);
  });
  return labels.reduce<MonthSpan[]>((spans, label, index) => {
    const last = spans[spans.length - 1];
    if (last !== undefined && label === labels[index - 1]) {
      spans[spans.length - 1] = { label, span: last.span + 1 };
      return spans;
    }
    spans.push({ label, span: 1 });
    return spans;
  }, []);
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;

const dig = (value: unknown, ...keys: ReadonlyArray<string>): unknown =>
  keys.reduce<unknown>((node, key) => asRecord(node)?.[key], value);

const dayOf = (value: unknown): CalendarDay | null => {
  const day = asRecord(value);
  const date = day?.date;
  const weekday = day?.weekday;
  const count = day?.contributionCount;
  return typeof date === "string" &&
    typeof weekday === "number" &&
    typeof count === "number"
    ? { date, weekday, count }
    : null;
};

const weekOf = (value: unknown): CalendarWeek | null => {
  const raw = asRecord(value)?.contributionDays;
  if (!Array.isArray(raw)) return null;
  const days = raw.map(dayOf);
  return days.every((day): day is CalendarDay => day !== null)
    ? { days }
    : null;
};

// A rejected query still answers 200 with `data.user: null`, so the body is
// parsed rather than trusted.
export const parseCalendar = (body: unknown): AppResult<Calendar> => {
  const record = asRecord(
    dig(
      body,
      "data",
      "user",
      "contributionsCollection",
      "contributionCalendar",
    ),
  );
  const total = record?.totalContributions;
  const raw = record?.weeks;
  if (typeof total !== "number" || !Array.isArray(raw)) {
    return err(
      appError(
        GitErrorCode.MALFORMED,
        "E5111: github sent an unusable calendar",
      ),
    );
  }
  const weeks = raw.map(weekOf);
  return weeks.every((week): week is CalendarWeek => week !== null)
    ? ok({ total, weeks })
    : err(
        appError(
          GitErrorCode.MALFORMED,
          "E5111: github sent an unusable calendar",
        ),
      );
};

type Thresholds = readonly [number, number, number];

// Quartiles of the active days, not of the busiest one: a single 40-commit day
// would otherwise flatten a whole year of ordinary days to level 1.
const thresholdsOf = (counts: ReadonlyArray<number>): Thresholds => {
  const active = counts.filter((count) => count > 0).sort((a, b) => a - b);
  if (active.length === 0) return [1, 1, 1];
  const at = (fraction: number): number =>
    active[Math.min(active.length - 1, Math.floor(active.length * fraction))] ??
    1;
  return [at(0.25), at(0.5), at(0.75)];
};

const levelOf = (count: number, [q1, q2, q3]: Thresholds): ContributionLevel =>
  count <= 0 ? 0 : count <= q1 ? 1 : count <= q2 ? 2 : count <= q3 ? 3 : 4;

export const toGraph = (calendar: Calendar): AppResult<ContributionGraph> => {
  if (calendar.weeks.length === 0) {
    return err(
      appError(GitErrorCode.MALFORMED, "E5111: github sent an empty calendar"),
    );
  }

  const days = calendar.weeks.flatMap((week) => week.days);
  if (days.some((day) => day.weekday < 0 || day.weekday >= ROWS)) {
    return err(
      appError(
        GitErrorCode.MALFORMED,
        "E5111: github sent an unusable weekday",
      ),
    );
  }

  const thresholds = thresholdsOf(days.map((day) => day.count));
  const rows = Array.from({ length: ROWS }, (_, weekday) =>
    calendar.weeks.map((week) => {
      const day = week.days.find((candidate) => candidate.weekday === weekday);
      return day === undefined
        ? null
        : {
            date: day.date,
            count: day.count,
            level: levelOf(day.count, thresholds),
          };
    }),
  );

  return ok({
    total: calendar.total,
    weeks: calendar.weeks.length,
    months: monthsOf(calendar.weeks),
    rows,
  });
};
