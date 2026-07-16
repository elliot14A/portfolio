import { err, ok } from "neverthrow";
import { notFoundError, type PfResult } from "../error.ts";

export type GitSign = "add" | "change" | "delete";

export type Line = Readonly<{
  /** Pre-highlighted HTML for this single line, produced at build time by Shiki. */
  html: string;
  /** Leading indent in columns — drives the indent-blankline guides. */
  indent: number;
  sign?: GitSign;
}>;

export type Heading = Readonly<{
  text: string;
  line: number;
  level: number;
}>;

export type Buffer = Readonly<{
  path: string;
  name: string;
  lang: string;
  icon: string;
  lines: ReadonlyArray<Line>;
  headings: ReadonlyArray<Heading>;
  /** Buffers are read-only except the guestbook — `:w` errors with E45 elsewhere. */
  readOnly: boolean;
}>;

export type TreeNode = Readonly<{
  path: string;
  name: string;
  icon: string;
  depth: number;
  kind: "file" | "directory";
}>;

export type ContentIndex = Readonly<{
  buffers: Readonly<Record<string, Buffer>>;
  tree: ReadonlyArray<TreeNode>;
  entry: string;
}>;

/** Strips the leading slash and any `../` games, so `/b/*` can never escape the index. */
export const normalizePath = (raw: string): string =>
  raw
    .replace(/^\/+/, "")
    .split("/")
    .filter((segment) => segment !== "" && segment !== "." && segment !== "..")
    .join("/");

export const findBuffer = (index: ContentIndex, raw: string): PfResult<Buffer> => {
  const path = normalizePath(raw);
  const buffer = index.buffers[path];
  return buffer === undefined
    ? err(notFoundError(`E484: Can't open file ${path}`, { meta: { path } }))
    : ok(buffer);
};

export const lineCount = (buffer: Buffer): number => buffer.lines.length;

/** vim reports an empty buffer as 0 lines but a 1-line buffer as "1,1  All". */
export const formatPosition = (line: number, column: number): string => `${line},${column}`;

export const formatProgress = (line: number, total: number): string => {
  if (total <= 1) return "All";
  if (line === 1) return "Top";
  if (line === total) return "Bot";
  return `${Math.floor(((line - 1) / (total - 1)) * 100)}%`;
};
