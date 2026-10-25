import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/unstable/httpapi";
import { ChatRequest, DomainError } from "./schema";

export const ChatApiGroup = HttpApiGroup.make("chat").add(
  HttpApiEndpoint.post("ask", "/chat", {
    payload: ChatRequest,
    success: HttpApiSchema.StreamUint8Array({ contentType: "text/event-stream; charset=utf-8" }),
    error: [DomainError],
  }),
);

export const PortfolioApi = HttpApi.make("portfolioApi").add(ChatApiGroup).prefix("/api");

export type PortfolioApi = typeof PortfolioApi;
