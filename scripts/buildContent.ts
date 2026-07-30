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

type LinkSpan = Readonly<{ start: number; end: number; href: string }>;

const LINK_RE = /\[[^\]]+\]\(([^)]+)\)/g;

const linksOf = (line: string): LinkSpan[] =>
  [...line.matchAll(LINK_RE)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    href: match[1] ?? "",
  }));

const anchorFor = (href: string): string => {
  const safe = escapeHtml(href);
  if (href.startsWith("/")) return `<a class="lnk" href="${safe}" download>`;
  if (href.startsWith("mailto:")) return `<a class="lnk" href="${safe}">`;
  return `<a class="lnk" href="${safe}" target="_blank" rel="noopener noreferrer">`;
};

const renderLine = (
  tokens: ReadonlyArray<ThemedToken>,
  source: string,
): string => {
  const links = linksOf(source);
  let offset = 0;
  let openHref: string | null = null;
  let html = "";
  for (const token of tokens) {
    const href =
      links.find((link) => offset >= link.start && offset < link.end)?.href ??
      null;
    if (href !== openHref) {
      if (openHref !== null) html += "</a>";
      if (href !== null) html += anchorFor(href);
      openHref = href;
    }
    html += `<span style="${styleOf(token)}">${escapeHtml(token.content)}</span>`;
    offset += token.content.length;
  }
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

const build = async (): Promise<void> => {
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
    const sourceLines = source.replace(/\n$/, "").split("\n");
    const lang = langOf(path);
    const { tokens } = highlighter.codeToTokens(sourceLines.join("\n"), {
      lang,
      theme: "rose-pine",
    });

    const lines: Line[] = sourceLines.map((text, index) => ({
      html: renderLine(tokens[index] ?? [], text),
      indent: indentOf(text),
      ...(isNowrap(text) ? { nowrap: true } : {}),
    }));

    buffers[path] = {
      path,
      name: baseNameOf(path),
      lang,
      icon: iconForPath(path),
      lines,
      headings: lang === "markdown" ? headingsOf(sourceLines) : [],
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
    `${banner}export const CONTENT: ContentIndex = ${JSON.stringify(index, null, 2)};\n\nexport const AGENT_CONTEXT = ${JSON.stringify(agentContext)};\n`,
  );

  const totalLines = Object.values(buffers).reduce(
    (sum, buffer) => sum + buffer.lines.length,
    0,
  );
  process.stdout.write(`content: ${paths.length} files, ${totalLines} lines\n`);
};

await build();
