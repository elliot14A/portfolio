import { ok } from "neverthrow";
import type { PlanChat, StreamAnswer } from "@/core/chat/ports";

const MOCK =
  "[dev mock] Set PORTFOLIO_OPENAI_API_KEY to enable real answers. Meanwhile, here's Gaur, his flagship.";

const streamOf = (text: string): ReadableStream<Uint8Array> => {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
};

export const stubPlan: PlanChat = async () =>
  ok({ allowed: true, actions: [{ kind: "open", path: "projects/gaur.md" }] });

export const stubStreamAnswer: StreamAnswer = async () => ok(streamOf(MOCK));
