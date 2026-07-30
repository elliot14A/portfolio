import { describe, expect, test } from "bun:test";
import { makeApp } from "./app";

const app = makeApp({});

describe("GET /", () => {
  test("serves the start screen, not a buffer", async () => {
    const res = await app.request("/");
    const html = await res.text();

    expect(res.status).toBe(200);
    expect(html).toContain('class="alpha"');
    expect(html).toContain('data-path="alpha"');
    expect(html).toContain("Akshith Katkuri");
    expect(html).toContain("backend engineer");
  });

  test("shows the banner with every row the same width", async () => {
    const html = await (await app.request("/")).text();
    const banner =
      /<pre class="alpha-banner"[^>]*>([\s\S]*?)<\/pre>/.exec(html)?.[1] ?? "";
    const rows = banner.split("\n").filter((row) => row.trim() !== "");

    expect(rows.length).toBe(5);
    expect(new Set(rows.map((row) => [...row].length)).size).toBe(1);
  });

  test("lists contact details as followable links", async () => {
    const html = await (await app.request("/")).text();
    expect(html).toContain('href="mailto:akshithkatkuri14@gmail.com"');
    expect(html).toContain('href="https://github.com/elliot14A"');
  });

  test("every menu entry has a shortcut key and a real href", async () => {
    const html = await (await app.request("/")).text();
    const entries = [
      ...html.matchAll(
        /class="alpha-item"\s+href="([^"]+)"\s+data-key="(\w)"/g,
      ),
    ];

    expect(entries.map((entry) => entry[2])).toEqual([
      "r",
      "a",
      "p",
      "c",
      "h",
      "g",
      "e",
    ]);
    for (const [, href] of entries) {
      expect(href).toMatch(/^(\/b\/|https:\/\/|mailto:)/);
    }
  });

  test("has no tabline or tree, nothing is open yet", async () => {
    const html = await (await app.request("/")).text();
    expect(html).not.toContain('id="tabline"');
    expect(html).not.toContain('id="neotree"');
  });
});

describe("GET /b/README.md", () => {
  test("opens the profile with the full editor chrome", async () => {
    const html = await (await app.request("/b/README.md")).text();
    expect(html).toContain('data-path="README.md"');
    expect(html).toContain('id="statusline"');
    expect(html).toContain('id="neotree"');
    expect(html).toContain("NORMAL");
  });

  test("renders one row per source line", async () => {
    const html = await (await app.request("/b/README.md")).text();
    const rows = [...html.matchAll(/class="ln[^"]*" data-n="/g)];
    expect(rows.length).toBe(74);
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
    expect(html).toContain('hx-swap-oob="true"');
  });

  test("returns a full page to a cold browser request", async () => {
    const html = await (await app.request("/b/doc/help.txt")).text();
    expect(html).toContain("<html");
    expect(html).toContain('data-path="doc/help.txt"');
  });

  test("a missing file inside the editor is a command-line message", async () => {
    const res = await app.request("/b/nope.md", {
      headers: { "HX-Request": "true" },
    });
    const html = await res.text();

    expect(res.status).toBe(404);
    expect(html).not.toContain("<html");
    expect(html).toContain("E484: Can&#39;t open file nope.md");
    expect(html).toContain('class="cmdline error"');
  });

  test("path traversal cannot escape the content index", async () => {
    const res = await app.request("/b/../../etc/passwd");
    expect(res.status).toBe(404);
  });
});

describe("responsive shell", () => {
  test("every page renders the editor directly, with no desktop gate", async () => {
    for (const path of ["/", "/b/README.md", "/b/nope.md"]) {
      const html = await (await app.request(path)).text();
      expect(html).toContain('class="editor');
      expect(html).not.toContain('id="mobile-gate"');
      expect(html).not.toContain('class="desktop-only"');
    }
  });

  test("ships a responsive viewport", async () => {
    const html = await (await app.request("/")).text();
    expect(html).toContain('name="viewport"');
    expect(html).toContain("width=device-width");
  });

  test("the response does not vary by device", async () => {
    const phone = await app.request("/", {
      headers: { "User-Agent": "Mozilla/5.0 (iPhone)" },
    });
    const desktop = await app.request("/", {
      headers: { "User-Agent": "Mozilla/5.0 (X11)" },
    });
    expect(await phone.text()).toBe(await desktop.text());
  });
});

describe("error pages", () => {
  test("a dead link gets a full 404 page", async () => {
    const res = await app.request("/b/nope.md");
    const html = await res.text();

    expect(res.status).toBe(404);
    expect(html).toContain("<html");
    expect(html).toContain('class="err-status">404<');
    expect(html).toContain("E484: Can&#39;t open file nope.md");
    expect(html).toContain('href="/"');
  });

  test("an unknown route is a 404 page too", async () => {
    const res = await app.request("/wp-admin");
    expect(res.status).toBe(404);
    expect(await res.text()).toContain('class="err-status">404<');
  });

  test("error pages are not indexed", async () => {
    const html = await (await app.request("/nope")).text();
    expect(html).toContain('name="robots" content="noindex"');
  });
});
