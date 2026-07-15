import { describe, expect, test } from "bun:test";
import { makeApp } from "./app.tsx";

const app = makeApp({ branch: "main" });

describe("GET / — the alpha start screen", () => {
  test("serves the dashboard, not a buffer", async () => {
    const res = await app.request("/");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain('class="alpha"');
    expect(html).toContain('data-path="alpha"');
    expect(html).toContain("Akshith Katkuri");
    expect(html).toContain("backend developer");
  });

  test("shows the banner with every row the same width", async () => {
    const html = await (await app.request("/")).text();
    const banner = /<pre class="alpha-banner"[^>]*>([\s\S]*?)<\/pre>/.exec(html)?.[1] ?? "";
    const rows = banner.split("\n").filter((row) => row.trim() !== "");

    expect(rows.length).toBe(6);
    expect(new Set(rows.map((row) => [...row].length)).size).toBe(1);
  });

  test("lists contact details as real, followable links", async () => {
    const html = await (await app.request("/")).text();
    expect(html).toContain('href="mailto:akshithkatkuri@gmail.com"');
    expect(html).toContain('href="https://github.com/elliot14A"');
    expect(html).toContain("github.com/elliot14A");
  });

  test("every menu entry has a shortcut key and a real href", async () => {
    const html = await (await app.request("/")).text();
    const entries = [...html.matchAll(/class="alpha-item"\s+href="([^"]+)"\s+data-key="(\w)"/g)];

    expect(entries.length).toBeGreaterThanOrEqual(6);
    expect(entries.map((entry) => entry[2])).toEqual(["r", "p", "c", "h", "g", "e"]);
    for (const [, href] of entries) {
      expect(href).toMatch(/^(\/b\/|https:\/\/|mailto:)/);
    }
  });

  test("has no tabline or tree — nothing is open yet", async () => {
    const html = await (await app.request("/")).text();
    expect(html).not.toContain('id="tabline"');
    expect(html).not.toContain('id="neotree"');
  });
});

describe("GET /b/README.md", () => {
  test("opens the profile as a buffer with the full editor chrome", async () => {
    const html = await (await app.request("/b/README.md")).text();
    expect(html).toContain('data-path="README.md"');
    expect(html).toContain('id="statusline"');
    expect(html).toContain('id="neotree"');
    expect(html).toContain("NORMAL");
  });

  test("renders one row per source line", async () => {
    const html = await (await app.request("/b/README.md")).text();
    const rows = [...html.matchAll(/class="ln[^"]*" data-n="/g)];
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
    const html = await (await app.request("/b/README.md")).text();
    expect(html).toContain('data-ro="1"');
    expect(html).toContain("[RO]");
  });

  test("caches at the edge", async () => {
    const res = await app.request("/b/README.md");
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
    const html = await (await app.request("/b/README.md")).text();
    expect(html).toContain('href="/b/projects/portfolio.md"');
    expect(html).toMatch(/<a[^>]+class="tab[^"]*"[^>]+href="\/b\//);
  });
});
