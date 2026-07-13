/**
 * Pure cursor motions over a plain array of source lines.
 *
 * No DOM, no globals — every function is `(lines, pos, …) => Pos`, which is what makes the
 * whole input layer testable under `bun test` without a browser.
 */

export type Pos = Readonly<{ line: number; column: number }>;

export type Motion =
  | "left"
  | "down"
  | "up"
  | "right"
  | "wordForward"
  | "wordBack"
  | "lineStart"
  | "firstNonBlank"
  | "lineEnd"
  | "bufferStart"
  | "bufferEnd"
  | "halfPageDown"
  | "halfPageUp";

export type MotionContext = Readonly<{
  lines: ReadonlyArray<string>;
  /** Visible rows — only `halfPage*` needs it. */
  height: number;
}>;

const clamp = (value: number, low: number, high: number): number =>
  Math.min(Math.max(value, low), high);

const lineAt = (lines: ReadonlyArray<string>, line: number): string => lines[line - 1] ?? "";

/** Normal mode sits *on* a character, so the last valid column is length, not length+1. */
const lastColumn = (text: string): number => Math.max(1, text.length);

const clampToLine = (lines: ReadonlyArray<string>, pos: Pos): Pos => ({
  line: clamp(pos.line, 1, Math.max(1, lines.length)),
  column: clamp(pos.column, 1, lastColumn(lineAt(lines, clamp(pos.line, 1, lines.length)))),
});

const WORD = /[A-Za-z0-9_]/;

const isWordChar = (char: string | undefined): boolean => char !== undefined && WORD.test(char);
const isBlank = (char: string | undefined): boolean => char === undefined || /\s/.test(char);

/** `w` — start of the next word, crossing line boundaries like vim does. */
const wordForward = (lines: ReadonlyArray<string>, pos: Pos): Pos => {
  let { line, column } = pos;
  let text = lineAt(lines, line);
  const startedOnWord = isWordChar(text[column - 1]);

  if (startedOnWord) {
    while (column <= text.length && isWordChar(text[column - 1])) column += 1;
  } else if (!isBlank(text[column - 1])) {
    while (column <= text.length && !isWordChar(text[column - 1]) && !isBlank(text[column - 1])) {
      column += 1;
    }
  }

  while (true) {
    text = lineAt(lines, line);
    while (column <= text.length && isBlank(text[column - 1])) column += 1;
    if (column <= text.length) return { line, column };
    if (line >= lines.length) return { line, column: lastColumn(text) };
    line += 1;
    column = 1;
  }
};

/** `b` — start of the previous word. */
const wordBack = (lines: ReadonlyArray<string>, pos: Pos): Pos => {
  let { line, column } = pos;
  let text = lineAt(lines, line);
  column -= 1;

  while (true) {
    while (column >= 1 && isBlank(text[column - 1])) column -= 1;
    if (column >= 1) break;
    if (line <= 1) return { line: 1, column: 1 };
    line -= 1;
    text = lineAt(lines, line);
    column = text.length;
  }

  const word = isWordChar(text[column - 1]);
  while (
    column > 1 &&
    (word
      ? isWordChar(text[column - 2])
      : !isBlank(text[column - 2]) && !isWordChar(text[column - 2]))
  ) {
    column -= 1;
  }
  return { line, column };
};

const firstNonBlank = (text: string): number => {
  const index = text.search(/\S/);
  return index === -1 ? 1 : index + 1;
};

export const applyMotion = (ctx: MotionContext, pos: Pos, motion: Motion, count = 1): Pos => {
  const { lines, height } = ctx;
  const repeat = Math.max(1, count);

  switch (motion) {
    case "left":
      return clampToLine(lines, { ...pos, column: pos.column - repeat });
    case "right":
      return clampToLine(lines, { ...pos, column: pos.column + repeat });
    case "down":
      return clampToLine(lines, { ...pos, line: pos.line + repeat });
    case "up":
      return clampToLine(lines, { ...pos, line: pos.line - repeat });
    case "lineStart":
      return { ...pos, column: 1 };
    case "firstNonBlank":
      return { ...pos, column: firstNonBlank(lineAt(lines, pos.line)) };
    case "lineEnd":
      return { ...pos, column: lastColumn(lineAt(lines, pos.line)) };
    case "bufferStart":
      return clampToLine(lines, { line: repeat, column: 1 });
    case "bufferEnd":
      return clampToLine(lines, { line: lines.length, column: 1 });
    case "halfPageDown":
      return clampToLine(lines, { ...pos, line: pos.line + Math.floor(height / 2) * repeat });
    case "halfPageUp":
      return clampToLine(lines, { ...pos, line: pos.line - Math.floor(height / 2) * repeat });
    case "wordForward": {
      let next = pos;
      for (let i = 0; i < repeat; i += 1) next = wordForward(lines, next);
      return clampToLine(lines, next);
    }
    case "wordBack": {
      let next = pos;
      for (let i = 0; i < repeat; i += 1) next = wordBack(lines, next);
      return clampToLine(lines, next);
    }
  }
};
