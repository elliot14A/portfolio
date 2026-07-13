import { describe, expect, test } from "bun:test";
import { makeApp } from "./app.tsx";

const app = makeApp({ branch: "main" });

describe("GET /", () => {
  test("serves the editor with README.md open", async () => {
    const res = await app.request("/");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain('id="buffer"');
    expect(html).toContain('data-path="README.md"');
    expect(html).toContain('id="statusline"');
    expect(html).toContain('id="neotree"');
    expect(html).toContain("NORMAL");
  });

  test("renders one row per source line", async () => {
    const html = await (await app.request("/")).text();
    const rows = [...html.matchAll(/class="ln" data-n="/g)];
    expect(rows.length).toBe(38);
  });
});

describe("GET /b/*", () => {
  test("returns a bare fragment to htmx, not a full page", async () => {
    const res = await app.request("/b/projects/portfolio.md", {
      headers: { "HX-Request": "true" },
    });
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).not.toContain("<html");
    expect(html).toContain('data-path="projects/portfolio.md"');
    // tabline + statusline ride along out of band
    expect(html).toContain('hx-swap-oob="true"');
  });

  test("returns a full page to a cold browser request", async () => {
    const html = await (await app.request("/b/doc/help.txt")).text();
    expect(html).toContain("<html");
    expect(html).toContain('data-path="doc/help.txt"');
  });

  test("marks buffers read-only", async () => {
    const html = await (await app.request("/")).text();
    expect(html).toContain('data-ro="1"');
    expect(html).toContain("[RO]");
  });

  test("caches at the edge", async () => {
    const res = await app.request("/");
    expect(res.headers.get("Cache-Control")).toContain("s-maxage=3600");
  });

  test("a missing file is a real nvim error, not a stack trace", async () => {
    const res = await app.request("/b/nope.md", { headers: { "HX-Request": "true" } });
    const html = await res.text();

    expect(res.status).toBe(404);
    // The apostrophe arrives escaped — the message is rendered as text, not injected.
    expect(html).toContain("E484: Can&#39;t open file nope.md");
    expect(html).toContain('class="cmdline error"');
  });

  test("path traversal cannot escape the content index", async () => {
    const res = await app.request("/b/../../etc/passwd");
    expect(res.status).toBe(404);
  });
});

describe("no-JS fallback", () => {
  test("tree and tab entries are real anchors", async () => {
    const html = await (await app.request("/")).text();
    expect(html).toContain('href="/b/projects/portfolio.md"');
    expect(html).toMatch(/<a[^>]+class="tab[^"]*"[^>]+href="\/b\//);
  });
});
