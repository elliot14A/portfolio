import { describe, expect, test } from "bun:test";
import { makeApp } from "@/app";
import { parsePlan } from "@/core/chat/chat";
import { makeCounter } from "@/infra/chat/counter";

const app = makeApp({});

const post = (body: unknown) =>
  app.request("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /chat (mock, no key)", () => {
  test("streams a framed response led by an actions line", async () => {
    const res = await post({
      messages: [{ role: "user", content: "show me his rust work" }],
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    const newline = text.indexOf("\n");
    const meta = JSON.parse(text.slice(0, newline)) as { actions: unknown[] };
    expect(Array.isArray(meta.actions)).toBe(true);
    expect(text.slice(newline + 1)).toContain("Gaur");
  });

  test("rejects an empty body", async () => {
    const res = await post({});
    expect(res.status).toBe(400);
  });

  test("rejects a non-user last message", async () => {
    const res = await post({
      messages: [{ role: "assistant", content: "hi" }],
    });
    expect(res.status).toBe(400);
  });
});

describe("parsePlan", () => {
  const known = new Set(["projects/gaur.md"]);

  test("allows and drops unknown open paths", () => {
    const result = parsePlan(
      JSON.stringify({
        decision: "allow",
        actions: [
          { kind: "open", path: "projects/gaur.md" },
          { kind: "open", path: "etc/passwd" },
        ],
      }),
      known,
    );
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.allowed).toBe(true);
      expect(result.value.actions).toEqual([
        { kind: "open", path: "projects/gaur.md" },
      ]);
    }
  });

  test("marks non-allow decisions as not allowed", () => {
    const result = parsePlan(
      JSON.stringify({ decision: "deny", actions: [] }),
      known,
    );
    expect(result.isOk() && result.value.allowed).toBe(false);
  });
});

describe("makeCounter", () => {
  test("increments the persistent total per call", async () => {
    const store = new Map<string, string>();
    const kv = {
      get: async (key: string) => store.get(key) ?? null,
      put: async (key: string, value: string) => {
        store.set(key, value);
      },
    };
    const count = makeCounter(kv);
    await count();
    await count();
    await count();
    expect(store.get("stats:chat:total")).toBe("3");
  });
});
