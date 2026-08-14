import { err, ok } from "neverthrow";
import type { Action, ChatMessage } from "@/core/chat/chat";
import type {
  CountHit,
  PlanChat,
  RateLimit,
  StreamAnswer,
} from "@/core/chat/ports";
import type { AppResult } from "@/core/error";

export type AnswerInput = Readonly<{
  ip: string;
  history: ReadonlyArray<ChatMessage>;
}>;

export type AnswerReply = Readonly<{
  actions: ReadonlyArray<Action>;
  prose: ReadableStream<Uint8Array> | string;
}>;

export type Answer = (input: AnswerInput) => Promise<AppResult<AnswerReply>>;

export type AnswerDeps = Readonly<{
  limit: RateLimit;
  count: CountHit;
  plan: PlanChat;
  stream: StreamAnswer;
  offTopic: string;
}>;

export const makeAnswer =
  (deps: AnswerDeps): Answer =>
  async ({ ip, history }) => {
    await deps.count();

    const rate = await deps.limit(ip);
    if (rate.isErr()) return err(rate.error);

    const message = history.at(-1)?.content ?? "";
    const plan = await deps.plan(message);
    if (plan.isErr()) return err(plan.error);
    if (!plan.value.allowed) return ok({ actions: [], prose: deps.offTopic });

    const stream = await deps.stream(history);
    if (stream.isErr()) return err(stream.error);
    return ok({ actions: plan.value.actions, prose: stream.value });
  };
