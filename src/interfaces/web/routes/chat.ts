import { type Context, Hono } from "hono";
import type { Answer } from "@/app/chat/answer";
import type { Action, ChatMessage } from "@/core/chat/chat";
import { type AppErrorCode, appError, ChatErrorCode } from "@/core/error";
import { errorToHttp } from "../errorMapper";

export type ChatRoutesDeps = Readonly<{
  answer: Answer;
}>;

const MAX_HISTORY = 8;

const parseMessages = (body: unknown): ChatMessage[] | null => {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) return null;
  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) return null;
    const record = item as Record<string, unknown>;
    const role = record.role;
    const content = record.content;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string" ||
      content.length > 2000
    ) {
      return null;
    }
    messages.push({ role, content });
  }
  return messages;
};

const framed = (
  actions: ReadonlyArray<Action>,
  prose: ReadableStream<Uint8Array> | string,
): Response => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(`${JSON.stringify({ actions })}\n`));
      if (typeof prose === "string") {
        controller.enqueue(encoder.encode(prose));
        controller.close();
        return;
      }
      const reader = prose.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "Content-Encoding": "identity",
      "X-Accel-Buffering": "no",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

const fail = (c: Context, code: AppErrorCode, message: string) => {
  const { status, line } = errorToHttp(appError(code, message));
  return c.json({ error: line }, status);
};

export const makeChatRoutes = (deps: ChatRoutesDeps): Hono => {
  const app = new Hono();

  app.post("/chat", async (c: Context) => {
    let body: unknown = null;
    try {
      body = await c.req.json();
    } catch {}

    const messages = parseMessages(body);
    if (messages === null) {
      return fail(c, ChatErrorCode.BAD_REQUEST, "bad request");
    }

    const history = messages.slice(-MAX_HISTORY);
    const last = history.at(-1);
    if (
      last === undefined ||
      last.role !== "user" ||
      last.content.trim() === ""
    ) {
      return fail(c, ChatErrorCode.BAD_REQUEST, "empty message");
    }

    const ip = c.req.header("CF-Connecting-IP") ?? "local";
    const result = await deps.answer({ ip, history });
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);
      return c.json({ error: line }, status);
    }
    return framed(result.value.actions, result.value.prose);
  });

  return app;
};
