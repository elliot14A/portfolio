import { Effect } from "effect";
import { type HttpRouter, HttpServerResponse } from "effect/unstable/http";
import { WorkerEnv } from "../context";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type CalendarDay = Readonly<{
  date: string;
  weekday: number;
  count: number;
}>;

export type CalendarWeek = Readonly<{
  days: readonly CalendarDay[];
}>;

export type Calendar = Readonly<{
  total: number;
  weeks: readonly CalendarWeek[];
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
  months: readonly MonthSpan[];
  rows: readonly (readonly (Cell | null)[])[];
  sample: boolean;
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

const monthOf = (date: string): string => MONTHS[Number(date.slice(5, 7)) - 1] ?? "";

const monthsOf = (weeks: readonly CalendarWeek[]): readonly MonthSpan[] => {
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

type Thresholds = readonly [number, number, number];

const thresholdsOf = (counts: readonly number[]): Thresholds => {
  const active = counts.filter((count) => count > 0).sort((a, b) => a - b);
  if (active.length === 0) return [1, 1, 1];
  const at = (fraction: number): number =>
    active[Math.min(active.length - 1, Math.floor(active.length * fraction))] ?? 1;
  return [at(0.25), at(0.5), at(0.75)];
};

const levelOf = (count: number, [q1, q2, q3]: Thresholds): ContributionLevel =>
  count <= 0 ? 0 : count <= q1 ? 1 : count <= q2 ? 2 : count <= q3 ? 3 : 4;

export const toGraph = (calendar: Calendar, sample = false): ContributionGraph => {
  if (calendar.weeks.length === 0) {
    return {
      total: 0,
      weeks: 0,
      months: [],
      rows: Array.from({ length: ROWS }, () => []),
      sample,
    };
  }

  const days = calendar.weeks.flatMap((week) => week.days);
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

  return {
    total: calendar.total,
    weeks: calendar.weeks.length,
    months: monthsOf(calendar.weeks),
    rows,
    sample,
  };
};

export const sampleCalendar = (): Calendar => {
  const WEEKS = 53;
  const DAY_MS = 86_400_000;
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
        (week !== 0 || weekday >= FIRST_WEEKDAY) && (week !== WEEKS - 1 || weekday <= LAST_WEEKDAY),
    );

  const dayAt = (week: number, weekday: number): CalendarDay => {
    const offset = week * 7 + weekday - FIRST_WEEKDAY;
    return { date: dateAt(offset), weekday, count: countAt(offset) };
  };

  const weeks: readonly CalendarWeek[] = Array.from({ length: WEEKS }, (_, week) => ({
    days: weekdaysOf(week).map((day) => dayAt(week, day)),
  }));

  const total = weeks.flatMap((week) => week.days).reduce((sum, day) => sum + day.count, 0);

  return { total, weeks };
};

const parseCalendar = (body: unknown): Calendar | null => {
  if (typeof body !== "object" || body === null) return null;
  const record = body as Record<string, unknown>;
  const data = record.data as Record<string, unknown> | undefined;
  const user = data?.user as Record<string, unknown> | undefined;
  const collection = user?.contributionsCollection as Record<string, unknown> | undefined;
  const calendar = collection?.contributionCalendar as Record<string, unknown> | undefined;

  const total = calendar?.totalContributions;
  const rawWeeks = calendar?.weeks;

  if (typeof total !== "number" || !Array.isArray(rawWeeks)) return null;

  const weeks: CalendarWeek[] = [];

  for (const w of rawWeeks) {
    if (typeof w !== "object" || w === null) return null;
    const rawDays = (w as Record<string, unknown>).contributionDays;
    if (!Array.isArray(rawDays)) return null;

    const days: CalendarDay[] = [];
    for (const d of rawDays) {
      if (typeof d !== "object" || d === null) return null;
      const dayRec = d as Record<string, unknown>;
      const date = dayRec.date;
      const weekday = dayRec.weekday;
      const count = dayRec.contributionCount;
      if (typeof date !== "string" || typeof weekday !== "number" || typeof count !== "number") {
        return null;
      }
      days.push({ date, weekday, count });
    }
    weeks.push({ days });
  }

  return { total, weeks };
};

const GITHUB_GRAPHQL_QUERY =
  "query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date weekday contributionCount}}}}}}";

let cachedGraph: { readonly graph: ContributionGraph; readonly timestamp: number } | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000;

export const getOrFetchContributions = (
  env: Record<string, unknown>,
): Effect.Effect<ContributionGraph> =>
  Effect.gen(function* () {
    const now = Date.now();
    if (cachedGraph && now - cachedGraph.timestamp < CACHE_TTL_MS) {
      return cachedGraph.graph;
    }

    const apiUrl =
      typeof env.PORTFOLIO_GITHUB_API_URL === "string" && env.PORTFOLIO_GITHUB_API_URL.trim()
        ? env.PORTFOLIO_GITHUB_API_URL.trim()
        : "https://api.github.com/graphql";
    const login =
      typeof env.PORTFOLIO_GITHUB_LOGIN === "string" && env.PORTFOLIO_GITHUB_LOGIN.trim()
        ? env.PORTFOLIO_GITHUB_LOGIN.trim()
        : "elliot14A";
    const token =
      typeof env.PORTFOLIO_GITHUB_TOKEN === "string" ? env.PORTFOLIO_GITHUB_TOKEN.trim() : "";

    if (!token) {
      return toGraph(sampleCalendar(), true);
    }

    const fetchEffect = Effect.tryPromise({
      try: async () => {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Authorization: `bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "portfolio-worker",
          },
          body: JSON.stringify({
            query: GITHUB_GRAPHQL_QUERY,
            variables: { login },
          }),
        });
        if (!res.ok) return null;
        return await res.json();
      },
      catch: () => null,
    }).pipe(Effect.catch(() => Effect.succeed(null)));

    const jsonBody = yield* fetchEffect;
    const calendar = parseCalendar(jsonBody);

    if (!calendar) {
      return toGraph(sampleCalendar(), true);
    }

    const graph = toGraph(calendar, false);
    cachedGraph = { graph, timestamp: now };
    return graph;
  });

export const makeContributionRoutes = (router: HttpRouter.HttpRouter) =>
  Effect.gen(function* () {
    yield* router.add(
      "GET",
      "/api/contributions",
      Effect.gen(function* () {
        const env = yield* WorkerEnv;
        const graph = yield* getOrFetchContributions(env);
        return yield* HttpServerResponse.json(graph, {
          status: 200,
          headers: {
            "cache-control": graph.sample ? "public, max-age=300" : "public, max-age=900",
          },
        });
      }),
    ) as Effect.Effect<void>;
  });
