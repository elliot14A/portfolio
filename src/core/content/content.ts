import { err, ok } from "neverthrow";
import { type AppResult, appError, ContentErrorCode } from "../error";

export type GitSign = "add" | "change" | "delete";

export type Line = Readonly<{
  html: string;
  indent: number;
  sign?: GitSign;
  // Alignment-sensitive lines (tables, aligned blocks) that must not soft-wrap
  // on narrow screens; the buffer scrolls horizontally for them instead.
  nowrap?: boolean;
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

// Drop the leading slash and any "." or ".." segments so a request path can
// never escape the baked index.
export const normalizePath = (raw: string): string =>
  raw
    .replace(/^\/+/, "")
    .split("/")
    .filter((segment) => segment !== "" && segment !== "." && segment !== "..")
    .join("/");

export const findBuffer = (
  index: ContentIndex,
  raw: string,
): AppResult<Buffer> => {
  const path = normalizePath(raw);
  const buffer = index.buffers[path];
  return buffer === undefined
    ? err(
        appError(ContentErrorCode.NOT_FOUND, `E484: Can't open file ${path}`, {
          meta: { path },
        }),
      )
    : ok(buffer);
};

export const formatPosition = (line: number, column: number): string =>
  `${line},${column}`;

export const formatProgress = (line: number, total: number): string => {
  if (total <= 1) return "All";
  if (line === 1) return "Top";
  if (line === total) return "Bot";
  return `${Math.floor(((line - 1) / (total - 1)) * 100)}%`;
};
