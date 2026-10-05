#!/usr/bin/env bun

import bash from "@shikijs/langs/bash";
import json from "@shikijs/langs/json";
import lua from "@shikijs/langs/lua";
import markdown from "@shikijs/langs/markdown";
import nix from "@shikijs/langs/nix";
import typescript from "@shikijs/langs/typescript";
import rosePine from "@shikijs/themes/rose-pine";
import type { ThemedToken } from "shiki";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type {
  Buffer,
  ContentIndex,
  Heading,
  Line,
  TreeNode,
} from "../src/core/content/content";
import { ICON, iconForPath } from "../src/core/content/icons";

const CONTENT_DIR = "content";
const OUT_FILE = "src/content.generated.ts";
const ENTRY = "README.md";

const LANG_BY_EXT: Readonly<Record<string, string>> = {
  md: "markdown",
  ts: "typescript",
  lua: "lua",
  nix: "nix",
  sh: "bash",
  json: "json",
  txt: "markdown",
};

const langOf = (path: string): string =>
  LANG_BY_EXT[path.split(".").pop() ?? ""] ?? "markdown";

const baseNameOf = (path: string): string => path.split("/").pop() ?? path;

const indentOf = (source: string): number =>
  source.match(/^ */)?.[0].length ?? 0;

const isNowrap = (source: string): boolean =>
  source.trimStart().startsWith("|") || /\S {2,}\S/.test(source);

const escapeHtml = (text: string): string =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const styleOf = (token: ThemedToken): string => {
  const parts = [`color:${token.color ?? "inherit"}`];
  const font = token.fontStyle ?? 0;
  if ((font & 1) !== 0) parts.push("font-style:italic");
  if ((font & 2) !== 0) parts.push("font-weight:bold");
  if ((font & 4) !== 0) parts.push("text-decoration:underline");
  return parts.join(";");
};

const IMAGE_RE = /^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/;

const imageHtml = (alt: string, src: string): string =>
  `<img class="md-img" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />`;

// Tight form, no inner spaces: the prose `<!-- ... -->` comments in the content
// are meant to render as visible text and must not match.
const GRAPH_RE = /^\s*<!--contributions-->\s*$/;

// The slot text is the permanent fallback. htmx replaces it only on success, so
// it also stands in for no-JS and for github being unreachable.
const graphHtml = (): string =>
  `<span class="cg-slot" hx-get="/contributions" hx-trigger="load" hx-swap="outerHTML">-- contributions --</span>`;

type LinkSpan = Readonly<{ start: number; end: number; href: string }>;

const LINK_RE = /\[[^\]]+\]\(([^)]+)\)/g;
const CODE_RE = /(?<!`)`([^`\r\n]+)`(?!`)/g;

type CodeSpan = Readonly<{
  start: number;
  end: number;
  innerStart: number;
  innerEnd: number;
}>;

const codeSpansOf = (line: string): CodeSpan[] =>
  [...line.matchAll(CODE_RE)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    innerStart: match.index + 1,
    innerEnd: match.index + match[0].length - 1,
  }));

const linksOf = (line: string, codeSpans: readonly CodeSpan[]): LinkSpan[] =>
  [...line.matchAll(LINK_RE)]
    .filter(
      (match) =>
        !codeSpans.some(
          (span) =>
            match.index >= span.start &&
            match.index + match[0].length <= span.end,
        ),
    )
    .map((match) => ({
      start: match.index,
      end: match.index + match[0].length,
      href: match[1] ?? "",
    }));

const anchorFor = (href: string): string => {
  const safe = escapeHtml(href);
  if (href.startsWith("/b/")) return `<a class="lnk" href="${safe}">`;
  if (href.startsWith("/")) return `<a class="lnk" href="${safe}" download>`;
  if (href.startsWith("mailto:")) return `<a class="lnk" href="${safe}">`;
  return `<a class="lnk" href="${safe}" target="_blank" rel="noopener noreferrer">`;
};

const renderLine = (
  tokens: ReadonlyArray<ThemedToken>,
  source: string,
  isMarkdown = false,
): string => {
  const codeSpans = isMarkdown ? codeSpansOf(source) : [];
  const links = linksOf(source, codeSpans);
  let offset = 0;
  let openHref: string | null = null;
  let inCode = false;
  let html = "";
  for (const token of tokens) {
    const href =
      links.find((link) => offset >= link.start && offset < link.end)?.href ??
      null;
    const insideCode = codeSpans.some(
      (span) => offset >= span.innerStart && offset < span.innerEnd,
    );
    if (href !== openHref) {
      if (inCode) {
        html += "</span>";
        inCode = false;
      }
      if (openHref !== null) html += "</a>";
      if (href !== null) html += anchorFor(href);
      openHref = href;
    }
    if (insideCode !== inCode) {
      if (inCode) {
        html += "</span>";
        inCode = false;
      } else {
        html += '<span class="md-code" style="color:#9CCFD8">';
        inCode = true;
      }
    }
    const isBacktickDelimiter =
      isMarkdown &&
      token.content === "`" &&
      codeSpans.some(
        (span) => offset === span.start || offset === span.end - 1,
      );
    if (isBacktickDelimiter) {
      html += `<span style="color:#908CAA">${escapeHtml(token.content)}</span>`;
    } else if (inCode) {
      html += escapeHtml(token.content);
    } else {
      html += `<span style="${styleOf(token)}">${escapeHtml(token.content)}</span>`;
    }
    offset += token.content.length;
  }
  if (inCode) html += "</span>";
  if (openHref !== null) html += "</a>";
  return html;
};

const headingsOf = (source: readonly string[]): Heading[] =>
  source.flatMap((text, index) => {
    const match = /^(#{1,6})\s+(.*)$/.exec(text);
    if (match === null) return [];
    const [, hashes = "", label = ""] = match;
    return [{ text: label.trim(), line: index + 1, level: hashes.length }];
  });

const treeOf = (paths: readonly string[]): TreeNode[] => {
  const seen = new Set<string>();
  const nodes: TreeNode[] = [];
  for (const path of [...paths].sort()) {
    const segments = path.split("/");
    segments.forEach((segment, depth) => {
      const partial = segments.slice(0, depth + 1).join("/");
      if (seen.has(partial)) return;
      seen.add(partial);
      const isFile = depth === segments.length - 1;
      nodes.push({
        path: partial,
        name: segment,
        icon: isFile ? iconForPath(partial) : ICON.folder,
        depth,
        kind: isFile ? "file" : "directory",
      });
    });
  }
  return nodes;
};

type Frontmatter = Readonly<{
  title: string;
  date: string;
  tags: readonly string[];
  description: string;
}>;

const parseFrontmatter = (
  source: string,
): { frontmatter: Frontmatter; body: string } | null => {
  if (!source.startsWith("---")) return null;
  const endIdx = source.indexOf("\n---", 3);
  if (endIdx === -1) return null;
  const rawYaml = source.slice(3, endIdx).trim();
  const body = source.slice(endIdx + 4).replace(/^\r?\n/, "");

  let title = "";
  let date = "";
  const tags: string[] = [];
  let description = "";

  const lines = rawYaml.split("\n");
  let inTags = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") continue;

    if (inTags) {
      if (line.startsWith("- ")) {
        tags.push(
          line
            .slice(2)
            .trim()
            .replace(/^["']|["']$/g, ""),
        );
        continue;
      }
      inTags = false;
    }

    if (line.startsWith("title:")) {
      title = line
        .slice(6)
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (line.startsWith("date:")) {
      date = line
        .slice(5)
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (line.startsWith("description:")) {
      description = line
        .slice(12)
        .trim()
        .replace(/^["']|["']$/g, "");
    } else if (line.startsWith("tags:")) {
      inTags = true;
      const rest = line.slice(5).trim();
      if (rest.startsWith("[") && rest.endsWith("]")) {
        tags.push(
          ...rest
            .slice(1, -1)
            .split(",")
            .map((t) => t.trim().replace(/^["']|["']$/g, ""))
            .filter((t) => t !== ""),
        );
        inTags = false;
      }
    }
  }

  return {
    frontmatter: { title, date, tags, description },
    body,
  };
};

const BOX_TOP =
  "╭─ properties ────────────────────────────────────────────────────────";
const BOX_BOT =
  "╰─────────────────────────────────────────────────────────────────────";

const makeCalloutLines = (
  frontmatter: Frontmatter,
): { plainLines: string[]; lines: Line[] } => {
  const plainLines = [
    BOX_TOP,
    `│ date: ${frontmatter.date}`,
    `│ tags: ${frontmatter.tags.map((t) => `#${t}`).join(" ")}`,
    `│ summary: ${frontmatter.description}`,
    BOX_BOT,
  ];

  const lines: Line[] = [
    {
      html: `<span style="color:#908CAA">${escapeHtml(BOX_TOP)}</span>`,
      indent: 0,
      nowrap: true,
    },
    {
      html: `<span style="color:#908CAA">│ </span><span style="color:#908CAA">date:</span> <span style="color:#E0DEF4">${escapeHtml(frontmatter.date)}</span>`,
      indent: 0,
      nowrap: true,
    },
    {
      html: `<span style="color:#908CAA">│ </span><span style="color:#908CAA">tags:</span> ${frontmatter.tags.map((t) => `<span style="color:#C4A7E7">#${escapeHtml(t)}</span>`).join(" ")}`,
      indent: 0,
      nowrap: true,
    },
    {
      html: `<span style="color:#908CAA">│ </span><span style="color:#908CAA">summary:</span> <span style="color:#E0DEF4">${escapeHtml(frontmatter.description)}</span>`,
      indent: 0,
      nowrap: true,
    },
    {
      html: `<span style="color:#908CAA">${escapeHtml(BOX_BOT)}</span>`,
      indent: 0,
      nowrap: true,
    },
  ];

  return { plainLines, lines };
};

const escapeXml = (text: string): string =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

type BlogPostMeta = Readonly<{
  fileName: string;
  path: string;
  title: string;
  date: string;
  tags: readonly string[];
  description: string;
}>;

const buildBlogIndexAndRss = async (): Promise<{
  rssXml: string;
}> => {
  const blogFiles = [
    ...new Bun.Glob("blogs/*.md").scanSync({ cwd: CONTENT_DIR }),
  ].filter((p) => p !== "blogs/README.md");

  const posts: BlogPostMeta[] = [];
  for (const relPath of blogFiles) {
    const source = await Bun.file(`${CONTENT_DIR}/${relPath}`).text();
    const parsed = parseFrontmatter(source);
    if (parsed !== null) {
      const fileName = relPath.split("/").pop() ?? relPath;
      posts.push({
        fileName,
        path: relPath,
        ...parsed.frontmatter,
      });
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));

  const dataviewLines = [
    "# blogs",
    "",
    "> thoughts on backend engineering, systems, products, and tech.",
    "",
    "| date | post | tags |",
    "| :--- | :--- | :--- |",
    ...(posts.length === 0
      ? ["| — | (no posts yet) | — |"]
      : posts.map(
          (p) =>
            `| ${p.date} | [${p.title}](/b/blogs/${p.fileName}) | ${p.tags.map((t) => `\`#${t}\``).join(" ")} |`,
        )),
    "",
  ];
  await Bun.write(`${CONTENT_DIR}/blogs/README.md`, dataviewLines.join("\n"));

  const rssItems = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://elliot14A.work/b/blogs/${p.fileName}</link>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <guid>https://elliot14A.work/b/blogs/${p.fileName}</guid>
    </item>`,
    )
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Akshith Katkuri</title>
    <link>https://elliot14A.work</link>
    <description>thoughts on backend engineering, systems, products, and tech.</description>
    <language>en-us</language>
${rssItems}
  </channel>
</rss>
`;

  return { rssXml };
};

const build = async (): Promise<void> => {
  const { rssXml } = await buildBlogIndexAndRss();

  const highlighter = await createHighlighterCore({
    themes: [rosePine],
    langs: [markdown, typescript, lua, nix, bash, json],
    engine: createJavaScriptRegexEngine(),
  });

  const paths = [
    ...new Bun.Glob("**/*").scanSync({ cwd: CONTENT_DIR, dot: true }),
  ].sort();
  if (paths.length === 0)
    throw new Error(`no content found in ${CONTENT_DIR}/`);

  const buffers: Record<string, Buffer> = {};
  const contextParts: string[] = [];
  for (const path of paths) {
    const source = await Bun.file(`${CONTENT_DIR}/${path}`).text();
    if (path === ENTRY || path.startsWith("projects/")) {
      contextParts.push(`# FILE: ${path}\n\n${source.trim()}`);
    }
    const lang = langOf(path);

    const parsed =
      path.startsWith("blogs/") &&
      path.endsWith(".md") &&
      path !== "blogs/README.md"
        ? parseFrontmatter(source)
        : null;

    let lines: Line[];
    let headings: Heading[];

    if (parsed !== null) {
      const { plainLines, lines: calloutLines } = makeCalloutLines(
        parsed.frontmatter,
      );
      const bodySourceLines = parsed.body.replace(/\n$/, "").split("\n");
      const { tokens } = highlighter.codeToTokens(bodySourceLines.join("\n"), {
        lang,
        theme: "rose-pine",
      });

      const bodyLines: Line[] = bodySourceLines.map((text, index) => {
        if (GRAPH_RE.test(text))
          return { html: graphHtml(), indent: indentOf(text) };
        const image = IMAGE_RE.exec(text);
        if (image !== null) {
          const [, alt = "", src = ""] = image;
          return { html: imageHtml(alt, src), indent: indentOf(text) };
        }
        return {
          html: renderLine(tokens[index] ?? [], text, lang === "markdown"),
          indent: indentOf(text),
          ...(isNowrap(text) ? { nowrap: true } : {}),
        };
      });

      lines = [...calloutLines, ...bodyLines];
      headings = headingsOf([...plainLines, ...bodySourceLines]);
    } else {
      const sourceLines = source.replace(/\n$/, "").split("\n");
      const { tokens } = highlighter.codeToTokens(sourceLines.join("\n"), {
        lang,
        theme: "rose-pine",
      });

      lines = sourceLines.map((text, index) => {
        if (GRAPH_RE.test(text))
          return { html: graphHtml(), indent: indentOf(text) };
        const image = IMAGE_RE.exec(text);
        if (image !== null) {
          const [, alt = "", src = ""] = image;
          return { html: imageHtml(alt, src), indent: indentOf(text) };
        }
        return {
          html: renderLine(tokens[index] ?? [], text, lang === "markdown"),
          indent: indentOf(text),
          ...(isNowrap(text) ? { nowrap: true } : {}),
        };
      });
      headings = lang === "markdown" ? headingsOf(sourceLines) : [];
    }

    buffers[path] = {
      path,
      name: baseNameOf(path),
      lang,
      icon: iconForPath(path),
      lines,
      headings,
      readOnly: true,
    };
  }

  const index: ContentIndex = { buffers, tree: treeOf(paths), entry: ENTRY };
  const banner = [
    "// Generated by scripts/buildContent.ts. Do not edit.",
    "// Edit content/ and run `bun run build:content`.",
    "",
    'import type { ContentIndex } from "./core/content/content";',
    "",
  ].join("\n");

  const agentContext = contextParts.join("\n\n---\n\n");
  await Bun.write(
    OUT_FILE,
    `${banner}export const CONTENT: ContentIndex = ${JSON.stringify(index, null, 2)};\n\nexport const AGENT_CONTEXT = ${JSON.stringify(agentContext)};\n\nexport const RSS_XML = ${JSON.stringify(rssXml)};\n`,
  );

  const totalLines = Object.values(buffers).reduce(
    (sum, buffer) => sum + buffer.lines.length,
    0,
  );
  process.stdout.write(`content: ${paths.length} files, ${totalLines} lines\n`);
};

await build();
