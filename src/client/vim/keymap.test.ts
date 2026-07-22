import { describe, expect, test } from "bun:test";
import { resolveLeader } from "./keymap";

describe("resolveLeader", () => {
  test("no keys lists the top-level groups and bindings", () => {
    const result = resolveLeader([]);
    expect(result.kind).toBe("pending");
    if (result.kind !== "pending") return;
    const keys = result.entries.map((e) => e.key);
    expect(keys).toContain("e");
    expect(keys).toContain("f");
    expect(keys).toContain("b");
  });

  test("a group key lists its children", () => {
    const result = resolveLeader(["f"]);
    expect(result.kind).toBe("pending");
    if (result.kind !== "pending") return;
    expect(result.prefix).toBe("f");
    expect(result.entries.map((e) => e.key)).toEqual(["b", "f", "g", "w"]);
  });

  test("a leaf resolves to its command", () => {
    expect(resolveLeader(["e"])).toEqual({
      kind: "action",
      command: { kind: "toggleTree" },
    });
    expect(resolveLeader(["b", "b"])).toEqual({
      kind: "action",
      command: { kind: "alternate" },
    });
  });

  test("find files opens telescope", () => {
    expect(resolveLeader(["f", "f"])).toEqual({
      kind: "action",
      command: { kind: "telescope", source: "files" },
    });
  });

  test("unbuilt plugins resolve to unimplemented, still listed in the popup", () => {
    const result = resolveLeader(["f", "g"]);
    expect(result).toEqual({
      kind: "action",
      command: { kind: "unimplemented", feature: "telescope live_grep" },
    });
  });

  test("an unmapped key is reported", () => {
    expect(resolveLeader(["z"])).toEqual({ kind: "unmapped" });
    expect(resolveLeader(["f", "z"])).toEqual({ kind: "unmapped" });
  });

  test("groups are marked so the popup can show a caret", () => {
    const result = resolveLeader([]);
    if (result.kind !== "pending") throw new Error("expected pending");
    const find = result.entries.find((e) => e.key === "f");
    const explorer = result.entries.find((e) => e.key === "e");
    expect(find?.group).toBe(true);
    expect(explorer?.group).toBe(false);
  });
});
