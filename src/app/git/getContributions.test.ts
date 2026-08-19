import { describe, expect, test } from "bun:test";
import { err, ok } from "neverthrow";
import { makeGetContributions } from "@/app/git/getContributions";
import { appError, GitErrorCode } from "@/core/error";
import type { FetchCalendar } from "@/core/git/ports";

const oneWeek: FetchCalendar = async () =>
  ok({
    total: 3,
    weeks: [{ days: [{ date: "2026-01-04", weekday: 0, count: 3 }] }],
  });

const broken: FetchCalendar = async () =>
  err(appError(GitErrorCode.UNAVAILABLE, "E5110: github is unreachable"));

describe("getContributions", () => {
  test("shapes a fetched calendar into a graph", async () => {
    const result = await makeGetContributions({ fetchCalendar: oneWeek })();
    expect(result.isOk()).toBe(true);
    if (!result.isOk()) return;
    expect(result.value.total).toBe(3);
    expect(result.value.rows.length).toBe(7);
  });

  test("returns err when the calendar port fails", async () => {
    const result = await makeGetContributions({ fetchCalendar: broken })();
    expect(result.isErr() && result.error.code).toBe(GitErrorCode.UNAVAILABLE);
  });
});
