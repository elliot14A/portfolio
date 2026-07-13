import { describe, expect, test } from "bun:test";
import { applyMotion, type MotionContext, type Pos } from "./motions.ts";

const ctx = (lines: string[], height = 20): MotionContext => ({ lines, height });
const at = (line: number, column: number): Pos => ({ line, column });

describe("applyMotion", () => {
  const lines = ["# Akshith Katkuri", "", "  indented text here", "last"];

  test("hjkl move by one and clamp at the buffer edges", () => {
    expect(applyMotion(ctx(lines), at(1, 1), "left")).toEqual(at(1, 1));
    expect(applyMotion(ctx(lines), at(1, 1), "right")).toEqual(at(1, 2));
    expect(applyMotion(ctx(lines), at(1, 1), "up")).toEqual(at(1, 1));
    expect(applyMotion(ctx(lines), at(4, 1), "down")).toEqual(at(4, 1));
  });

  test("accepts a count", () => {
    expect(applyMotion(ctx(lines), at(1, 1), "down", 2)).toEqual(at(3, 1));
    expect(applyMotion(ctx(lines), at(1, 10), "left", 4)).toEqual(at(1, 6));
  });

  test("clamps the column when moving onto a shorter line", () => {
    expect(applyMotion(ctx(lines), at(1, 15), "down")).toEqual(at(2, 1));
  });

  test("0 and ^ differ on an indented line", () => {
    expect(applyMotion(ctx(lines), at(3, 10), "lineStart")).toEqual(at(3, 1));
    expect(applyMotion(ctx(lines), at(3, 10), "firstNonBlank")).toEqual(at(3, 3));
  });

  test("$ lands on the last character, not past it", () => {
    expect(applyMotion(ctx(lines), at(4, 1), "lineEnd")).toEqual(at(4, 4));
  });

  test("gg and G jump to the first and last line", () => {
    expect(applyMotion(ctx(lines), at(3, 5), "bufferStart")).toEqual(at(1, 1));
    expect(applyMotion(ctx(lines), at(1, 1), "bufferEnd")).toEqual(at(4, 1));
  });

  test("w advances to the next word and crosses blank lines", () => {
    expect(applyMotion(ctx(lines), at(1, 1), "wordForward")).toEqual(at(1, 3));
    expect(applyMotion(ctx(lines), at(1, 3), "wordForward")).toEqual(at(1, 11));
    expect(applyMotion(ctx(lines), at(1, 11), "wordForward")).toEqual(at(3, 3));
  });

  test("b walks back to the start of the previous word", () => {
    expect(applyMotion(ctx(lines), at(1, 11), "wordBack")).toEqual(at(1, 3));
    expect(applyMotion(ctx(lines), at(3, 3), "wordBack")).toEqual(at(1, 11));
  });

  test("w then b returns to a word start", () => {
    const forward = applyMotion(ctx(lines), at(3, 3), "wordForward");
    expect(applyMotion(ctx(lines), forward, "wordBack")).toEqual(at(3, 3));
  });

  test("half-page motions move by half the window height", () => {
    const tall = ctx(
      Array.from({ length: 100 }, (_, i) => `line ${i}`),
      40,
    );
    expect(applyMotion(tall, at(1, 1), "halfPageDown")).toEqual(at(21, 1));
    expect(applyMotion(tall, at(21, 1), "halfPageUp")).toEqual(at(1, 1));
  });

  test("never leaves the buffer, for any motion", () => {
    const motions = ["left", "down", "up", "right", "wordForward", "wordBack", "lineEnd"] as const;
    for (const motion of motions) {
      for (let line = 1; line <= lines.length; line += 1) {
        const result = applyMotion(ctx(lines), at(line, 1), motion, 99);
        expect(result.line).toBeGreaterThanOrEqual(1);
        expect(result.line).toBeLessThanOrEqual(lines.length);
        expect(result.column).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
