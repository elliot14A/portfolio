import type { ChatMessage, Plan } from "@/core/chat/chat";
import type { AppResult } from "@/core/error";

export type PlanChat = (message: string) => Promise<AppResult<Plan>>;

export type StreamAnswer = (
  history: ReadonlyArray<ChatMessage>,
) => Promise<AppResult<ReadableStream<Uint8Array>>>;

export type RateLimit = (ip: string) => Promise<AppResult<void>>;
