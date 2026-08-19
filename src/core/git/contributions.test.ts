import { describe, expect, test } from "bun:test";
import { GitErrorCode } from "@/core/error";
import {
  type Calendar,
  parseCalendar,
  toGraph,
} from "@/core/git/contributions";

const week = (
  counts: ReadonlyArray<number>,
  from = 0,
): {
  days: ReadonlyArray<{ date: string; weekday: number; count: number }>;
} => ({
  days: counts.map((count, index) => ({
    date: `2026-01-${String(from + index + 1).padStart(2, "0")}`,
    weekday: from + index,
    count,
  })),
});

const calendarOf = (
  weeks: ReadonlyArray<ReturnType<typeof week>>,
): Calendar => ({
  total: weeks.flatMap((w) => w.days).reduce((sum, d) => sum + d.count, 0),
  weeks,
});

describe("toGraph", () => {
  test("buckets an empty day at level 0 and the busiest at level 4", () => {
    const result = toGraph(calendarOf([week([0, 1, 2, 3, 4, 5, 40])]));
    expect(result.isOk()).toBe(true);
    if (!result.isOk()) return;
    expect(result.value.rows[0]?.[0]?.level).toBe(0);
    expect(result.value.rows[6]?.[0]?.level).toBe(4);
  });

  test("spreads active days by quartile, not by the busiest day", () => {
    // One outlier plus ordinary days: quartiles of max would flatten every
    // ordinary day to level 1.
    const result = toGraph(calendarOf([week([1, 2, 3, 4, 5, 6, 400])]));
    expect(result.isOk()).toBe(true);
    if (!result.isOk()) return;
    const levels = result.value.rows.map((row) => row[0]?.level);
    expect(new Set(levels).size).toBeGreaterThan(2);
  });

  test("puts every day in the row matching its weekday", () => {
    const result = toGraph(calendarOf([week([1, 2, 3, 4, 5, 6, 7])]));
    expect(result.isOk()).toBe(true);
    if (!result.isOk()) return;
    expect(result.value.rows.length).toBe(7);
    expect(result.value.rows.map((row) => row[0]?.count)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  test("leaves a gap where a partial week has no day", () => {
    const result = toGraph(calendarOf([week([5, 6, 7], 4)]));
    expect(result.isOk()).toBe(true);
    if (!result.isOk()) return;
    expect(result.value.rows[0]?.[0]).toBeNull();
    expect(result.value.rows[4]?.[0]?.count).toBe(5);
  });

  test("keeps one column per week", () => {
    const result = toGraph(calendarOf([week([1]), week([2]), week([3])]));
    expect(result.isOk() && result.value.rows[0]?.length).toBe(3);
  });

  test("carries the reported total through untouched", () => {
    const result = toGraph({ total: 1663, weeks: [week([1, 2])] });
    expect(result.isOk() && result.value.total).toBe(1663);
  });

  test("returns err when the calendar has no weeks", () => {
    const result = toGraph({ total: 0, weeks: [] });
    expect(result.isErr() && result.error.code).toBe(GitErrorCode.MALFORMED);
  });

  test("returns err when a weekday is out of range", () => {
    const result = toGraph({
      total: 1,
      weeks: [{ days: [{ date: "2026-01-01", weekday: 7, count: 1 }] }],
    });
    expect(result.isErr() && result.error.code).toBe(GitErrorCode.MALFORMED);
  });
});

// The shape github actually answers with, trimmed to two weeks.
const body = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 1663,
          weeks: [
            {
              contributionDays: [
                { date: "2025-08-20", weekday: 3, contributionCount: 8 },
                { date: "2025-08-21", weekday: 4, contributionCount: 0 },
              ],
            },
            {
              contributionDays: [
                { date: "2025-08-24", weekday: 0, contributionCount: 2 },
              ],
            },
          ],
        },
      },
    },
  },
};

describe("parseCalendar", () => {
  test("reads the calendar out of a github graphql body", () => {
    const result = parseCalendar(body);
    expect(result.isOk()).toBe(true);
    if (!result.isOk()) return;
    expect(result.value.total).toBe(1663);
    expect(result.value.weeks.length).toBe(2);
    expect(result.value.weeks[0]?.days[0]).toEqual({
      date: "2025-08-20",
      weekday: 3,
      count: 8,
    });
  });

  test("shapes the parsed body into a renderable graph", () => {
    const graph = parseCalendar(body).andThen(toGraph);
    expect(graph.isOk()).toBe(true);
    if (!graph.isOk()) return;
    expect(graph.value.rows.length).toBe(7);
    // Week 1 has only a Sunday, so the Thursday row has a gap there.
    expect(graph.value.rows[4]?.[1]).toBeNull();
    expect(graph.value.rows[3]?.[0]?.count).toBe(8);
  });

  test("returns err for a rejected query, which answers 200 with a null user", () => {
    const result = parseCalendar({
      data: { user: null },
      errors: [{ message: "Could not resolve to a User" }],
    });
    expect(result.isErr() && result.error.code).toBe(GitErrorCode.MALFORMED);
  });

  test("returns err when a day is missing a field", () => {
    const result = parseCalendar({
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 1,
              weeks: [{ contributionDays: [{ date: "2025-08-20" }] }],
            },
          },
        },
      },
    });
    expect(result.isErr() && result.error.code).toBe(GitErrorCode.MALFORMED);
  });
});
