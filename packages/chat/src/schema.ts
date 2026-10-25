import { Schema } from "effect";

export const NonEmptyTrimmedString = Schema.Trim.pipe(Schema.check(Schema.isNonEmpty()));

export const HistoryMessage = Schema.Struct({
  role: Schema.Literals(["user", "assistant"]),
  content: NonEmptyTrimmedString,
});
export type HistoryMessage = typeof HistoryMessage.Type;

export const ChatRequest = Schema.Struct({
  message: NonEmptyTrimmedString,
  history: Schema.optional(Schema.Array(HistoryMessage)),
});
export type ChatRequest = typeof ChatRequest.Type;

export const ReferenceItem = Schema.Struct({
  title: Schema.String,
  url: Schema.String,
  type: Schema.Literals(["project", "experience"]),
});
export type ReferenceItem = typeof ReferenceItem.Type;

export type StreamChatEvent =
  | { readonly type: "delta"; readonly text: string }
  | { readonly type: "references"; readonly items: readonly ReferenceItem[] }
  | { readonly type: "error"; readonly message: string }
  | { readonly type: "done" };

export const ChatAnswer = Schema.Struct({
  answer: Schema.String,
  references: Schema.Array(ReferenceItem),
});
export type ChatAnswer = typeof ChatAnswer.Type;

export class RateLimited extends Schema.TaggedError<RateLimited>()("RateLimited", {
  reason: Schema.Literals(["device", "global"]),
  message: Schema.String,
}) {}

export class InvalidInput extends Schema.TaggedError<InvalidInput>()("InvalidInput", {
  message: Schema.String,
}) {}

export class Internal extends Schema.TaggedError<Internal>()("Internal", {
  message: Schema.String,
}) {}

export class ServiceUnavailable extends Schema.TaggedError<ServiceUnavailable>()(
  "ServiceUnavailable",
  {
    message: Schema.String,
  },
) {}

export const DomainError = Schema.Union([RateLimited, InvalidInput, Internal, ServiceUnavailable]);
export type DomainError = RateLimited | InvalidInput | Internal | ServiceUnavailable;
