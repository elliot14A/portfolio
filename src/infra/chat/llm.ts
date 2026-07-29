import { err, ok, ResultAsync } from "neverthrow";
import type OpenAI from "openai";
import {
  answerPrompt,
  type ChatMessage,
  parsePlan,
  planPrompt,
} from "@/core/chat/chat";
import type { PlanChat, StreamAnswer } from "@/core/chat/ports";
import { appError, ChatErrorCode } from "@/core/error";

type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type ExtraBody = Readonly<Record<string, unknown>>;

const unreachable = (cause: unknown) =>
  appError(ChatErrorCode.PROVIDER, "the assistant is unreachable", { cause });

export const makePlan =
  (
    client: OpenAI,
    model: string,
    extraBody: ExtraBody,
    knownPaths: ReadonlySet<string>,
  ): PlanChat =>
  async (message) => {
    const completion = await ResultAsync.fromPromise(
      client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: planPrompt },
          { role: "user", content: message },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
        ...extraBody,
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming),
      unreachable,
    );
    if (completion.isErr()) return err(completion.error);
    const content = completion.value.choices[0]?.message?.content;
    return typeof content === "string" && content !== ""
      ? parsePlan(content, knownPaths)
      : err(appError(ChatErrorCode.PROVIDER, "the assistant returned nothing"));
  };

export const makeStreamAnswer =
  (
    client: OpenAI,
    model: string,
    extraBody: ExtraBody,
    context: string,
  ): StreamAnswer =>
  async (history) => {
    const messages: Message[] = [
      { role: "system", content: answerPrompt(context) },
      ...history.map((message: ChatMessage) => ({
        role: message.role,
        content: message.content,
      })),
    ];
    const started = await ResultAsync.fromPromise(
      client.chat.completions.create({
        model,
        messages,
        temperature: 0.2,
        stream: true,
        ...extraBody,
      } as OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming),
      unreachable,
    );
    if (started.isErr()) return err(started.error);

    const stream = started.value;
    const encoder = new TextEncoder();
    return ok(
      new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const token = chunk.choices[0]?.delta?.content;
              if (typeof token === "string" && token !== "") {
                controller.enqueue(encoder.encode(token));
              }
            }
            controller.close();
          } catch (cause) {
            controller.error(cause);
          }
        },
        cancel() {
          stream.controller.abort();
        },
      }),
    );
  };
