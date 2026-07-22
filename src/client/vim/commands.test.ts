import { describe, expect, test } from "bun:test";
import { type Command, parseCommand } from "./commands";

const parse = (input: string): Command => parseCommand(input);

describe("parseCommand", () => {
  test("empty input is a no-op", () => {
    expect(parse("")).toEqual({ kind: "noop" });
    expect(parse("   ")).toEqual({ kind: "noop" });
  });

  test(":e opens a file, :e without an arg is an error", () => {
    expect(parse("e README.md")).toEqual({ kind: "edit", path: "README.md" });
    expect(parse("edit projects/x.md")).toEqual({
      kind: "edit",
      path: "projects/x.md",
    });
    expect(parse("e")).toEqual({ kind: "unknown", input: "e" });
  });

  test(":e# is the alternate buffer", () => {
    expect(parse("e #")).toEqual({ kind: "alternate" });
  });

  test("buffer navigation", () => {
    expect(parse("bn")).toEqual({ kind: "bufferNext" });
    expect(parse("bnext")).toEqual({ kind: "bufferNext" });
    expect(parse("bp")).toEqual({ kind: "bufferPrev" });
    expect(parse("bprevious")).toEqual({ kind: "bufferPrev" });
  });

  test(":b<n> and :b <n> select a buffer by index", () => {
    expect(parse("b2")).toEqual({ kind: "bufferIndex", index: 2 });
    expect(parse("b 3")).toEqual({ kind: "bufferIndex", index: 3 });
    expect(parse("buffer1")).toEqual({ kind: "bufferIndex", index: 1 });
  });

  test("a bare number jumps to a line", () => {
    expect(parse("42")).toEqual({ kind: "gotoLine", line: 42 });
  });

  test("close and quit", () => {
    expect(parse("q")).toEqual({ kind: "close" });
    expect(parse("bd")).toEqual({ kind: "close" });
    expect(parse("qa")).toEqual({ kind: "quit" });
  });

  test("misc commands", () => {
    expect(parse("noh")).toEqual({ kind: "nohlsearch" });
    expect(parse("help")).toEqual({ kind: "help" });
    expect(parse("Neotree")).toEqual({ kind: "toggleTree" });
    expect(parse("term")).toEqual({ kind: "toggleTerm" });
    expect(parse("Alpha")).toEqual({ kind: "dashboard" });
  });

  test("an unknown command is reported, not silently dropped", () => {
    expect(parse("wat")).toEqual({ kind: "unknown", input: "wat" });
  });
});
