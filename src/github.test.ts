import { describe, expect, test } from "bun:test";
import { err } from "neverthrow";
import { makeApp } from "@/app";
import { appError, GitErrorCode } from "@/core/error";
import { makeContributionRoutes } from "@/interfaces/web/routes/contributions";

const app = makeApp({});

describe("GET /contributions (no token, sample data)", () => {
  test("serves a grid of seven weekday rows", async () => {
    const res = await app.request("/contributions");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain('class="cg"');
    expect([...html.matchAll(/class="cg-weekday"/g)].length).toBe(7);
    expect(html).toContain("contributions in the last year");
  });

  test("labels the months across the header", async () => {
    const html = await (await app.request("/contributions")).text();
    const months = [...html.matchAll(/class="cg-month"[^>]*>(\w+)</g)].map(
      (match) => match[1],
    );
    // A year window touches all twelve months, the first or last one twice.
    expect(new Set(months).size).toBe(12);
    expect(months.length).toBeGreaterThanOrEqual(12);
  });

  test("labels the weekday gutter on alternating rows", async () => {
    const html = await (await app.request("/contributions")).text();
    expect(html).toContain(">Mon<");
    expect(html).toContain(">Wed<");
    expect(html).toContain(">Fri<");
  });

  test("labels tokenless output as sample data", async () => {
    const html = await (await app.request("/contributions")).text();
    expect(html).toContain('data-source="sample"');
    expect(html).toContain('class="cg-badge">sample data<');
  });

  test("holds a cell for every weekday of every week", async () => {
    const html = await (await app.request("/contributions")).text();
    // The legend reuses `cg-c`, so count inside the grid only.
    const grid = html.slice(
      html.indexOf('class="cg-grid"'),
      html.indexOf('class="cg-foot"'),
    );
    const cells = [...grid.matchAll(/class="cg-c[ "]/g)].length;
    const columns = Number(/--cols:(\d+)/.exec(html)?.[1]);

    expect(columns).toBeGreaterThan(51);
    expect(cells).toBe(columns * 7);
  });

  test("is never cached, so the graph is always live", async () => {
    const res = await app.request("/contributions");
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});

describe("GET /contributions (github failing)", () => {
  test("answers non-2xx so htmx leaves the buffer slot alone", async () => {
    const routes = makeContributionRoutes({
      getContributions: async () =>
        err(appError(GitErrorCode.UNAVAILABLE, "E5110: github is unreachable")),
      sample: false,
    });
    const res = await routes.request("/contributions");

    expect(res.status).toBe(502);
    expect(await res.text()).toBe("E5110: github is unreachable");
  });
});

describe("the README slot", () => {
  test("hosts exactly one graph slot that lazy-loads the fragment", async () => {
    const html = await (await app.request("/b/README.md")).text();
    expect([...html.matchAll(/hx-get="\/contributions"/g)].length).toBe(1);
  });

  test("falls back to readable text when the fragment never arrives", async () => {
    const html = await (await app.request("/b/README.md")).text();
    expect(html).toContain("-- contributions --");
  });
});
