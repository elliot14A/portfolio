import { describe, expect, test } from "bun:test";
import { decorateAll, decorateLine, initialState } from "./markdown.ts";

const one = (source: string) => decorateLine(source, initialState);

describe("headings", () => {
  test("conceals the hashes and prefixes an icon", () => {
    const { rendered, deco } = one("## Stack");
    expect(deco).toBe("h2");
    expect(rendered).toContain("󰲣");
    expect(rendered).toContain("Stack");
    expect(rendered).not.toContain("##");
  });

  test("tags each level", () => {
    expect(one("# a").deco).toBe("h1");
    expect(one("###### f").deco).toBe("h6");
  });
});

describe("inline conceal", () => {
  test("bold and italic lose their markers", () => {
    expect(one("**backend** developer").rendered).toBe('<b class="md-bold">backend</b> developer');
    expect(one("an _emphasis_ here").rendered).toBe('an <i class="md-italic">emphasis</i> here');
  });

  test("code spans keep their contents literal", () => {
    const { rendered } = one("use `**not bold**` here");
    expect(rendered).toContain('<span class="md-code">**not bold**</span>');
    expect(rendered).not.toContain("<b");
  });

  test("links become real anchors with the url concealed", () => {
    const { rendered } = one("see [my github](https://github.com/elliot14A)");
    expect(rendered).toContain('href="https://github.com/elliot14A"');
    expect(rendered).toContain("󰌷 my github");
    expect(rendered).not.toContain("](");
  });

  test("html in the source is escaped, not executed", () => {
    const { rendered } = one("**<script>alert(1)</script>**");
    expect(rendered).toContain("&lt;script&gt;");
    expect(rendered).not.toContain("<script>");
  });

  test("plain prose is left undecorated", () => {
    expect(one("just some words").rendered).toBeUndefined();
  });

  test("html comments render as nothing, but are still there on reveal", () => {
    expect(one("<!-- a note to myself -->").rendered).toBe("");
  });
});

describe("lists", () => {
  test("bullets become glyphs, indented ones nest", () => {
    expect(one("- item").rendered).toContain("●");
    expect(one("  - nested").rendered).toContain("○");
  });

  test("checkboxes render as task icons", () => {
    expect(one("- [ ] todo").rendered).toContain("󰄱");
    expect(one("- [x] done").rendered).toContain("󰱒");
  });
});

describe("blocks", () => {
  test("a rule renders as an empty decorated line", () => {
    expect(one("---")).toMatchObject({ rendered: "", deco: "rule" });
  });

  test("blockquotes get a bar", () => {
    const { rendered, deco } = one("> quoted text");
    expect(deco).toBe("quote");
    expect(rendered).toContain("▋");
  });

  test("fenced code suppresses markdown decoration inside", () => {
    const lines = decorateAll(["```ts", "const x = **not bold**;", "```", "- after"]);
    expect(lines[0]).toMatchObject({ deco: "code-open" });
    expect(lines[1]).toMatchObject({ deco: "code" });
    expect(lines[1]?.rendered).toBeUndefined();
    expect(lines[2]).toMatchObject({ deco: "code-close" });
    // state resets after the closing fence
    expect(lines[3]?.deco).toBe("list");
  });
});

describe("tables", () => {
  test("pipes become box bars without changing column width", () => {
    const source = "| Layer      | What I reach for |";
    const { rendered, deco } = one(source);
    expect(deco).toBe("table");
    const text = (rendered ?? "").replace(/<[^>]+>/g, "");
    expect(text.length).toBe(source.length);
  });

  test("the separator row becomes a rule of the same width", () => {
    const source = "| ---------- | ---------------- |";
    const { rendered } = one(source);
    const text = (rendered ?? "").replace(/<[^>]+>/g, "");
    expect(text.length).toBe(source.length);
    expect(text).toContain("─");
    expect(text).not.toContain("-");
  });
});

describe("line preservation", () => {
  test("decorating never changes the number of lines", () => {
    const source = [
      "# Title",
      "",
      "Some **bold** prose with `code`.",
      "",
      "- one",
      "- two",
      "",
      "```ts",
      "const a = 1;",
      "```",
      "",
      "| a | b |",
      "| - | - |",
      "| 1 | 2 |",
    ];
    expect(decorateAll(source).length).toBe(source.length);
  });
});
