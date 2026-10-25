import { ChatRequest, makeOpenAiLanguageModelLayer, streamChatEvents } from "@portfolio/chat";
import { checkDeviceAndGlobalLimit, consumeDeviceAndGlobalLimit, D1Client } from "@portfolio/d1";
import { Effect, Ref, Stream } from "effect";
import { type HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/unstable/http";
import { DeviceId, WorkerEnv } from "../context";
import { errorToResponse } from "../error";

export const makeChatRoutes = (router: HttpRouter.HttpRouter) =>
  Effect.gen(function* () {
    yield* router.add(
      "POST",
      "/api/chat",
      Effect.gen(function* () {
        const payload = yield* HttpServerRequest.schemaBodyJson(ChatRequest).pipe(
          Effect.catch(() =>
            HttpServerResponse.json(
              { error: "InvalidInput", message: "A non-empty message is required." },
              { status: 400 },
            ),
          ),
        );

        if (HttpServerResponse.isHttpServerResponse(payload)) {
          return payload;
        }

        const deviceId = yield* DeviceId;
        const env = yield* WorkerEnv;

        const apiKey =
          typeof env.PORTFOLIO_OPENAI_API_KEY === "string"
            ? env.PORTFOLIO_OPENAI_API_KEY.trim()
            : "";

        if (!apiKey) {
          return yield* HttpServerResponse.json(
            {
              _tag: "ServiceUnavailable",
              error: "ServiceUnavailable",
              message: "AI service is currently not configured.",
            },
            { status: 503 },
          );
        }

        const db = env.DB;
        if (!db) {
          return yield* HttpServerResponse.json(
            {
              _tag: "ServiceUnavailable",
              error: "ServiceUnavailable",
              message: "Database service is not configured.",
            },
            { status: 503 },
          );
        }

        const rateLimitResponse = yield* checkDeviceAndGlobalLimit(deviceId).pipe(
          Effect.as(null),
          Effect.catchTag("GlobalDailyQuotaExceededError", (err) =>
            HttpServerResponse.json(
              {
                _tag: "RateLimited",
                reason: "global",
                error: "GlobalDailyQuotaExceeded",
                message: err.message,
              },
              { status: 429, headers: { "retry-after": "86400" } },
            ),
          ),
          Effect.catchTag("DeviceDailyLimitExceededError", (err) =>
            HttpServerResponse.json(
              {
                _tag: "RateLimited",
                reason: "device",
                error: "DeviceDailyLimitExceeded",
                message: err.message,
              },
              { status: 429, headers: { "retry-after": "86400" } },
            ),
          ),
          Effect.catchTag("D1Error", (err) =>
            HttpServerResponse.json(
              {
                _tag: "Internal",
                error: "DatabaseError",
                message: err.message,
              },
              { status: 500 },
            ),
          ),
          Effect.provide(D1Client.layer({ db })),
        );

        if (rateLimitResponse !== null) {
          return rateLimitResponse;
        }

        const modelLayer = makeOpenAiLanguageModelLayer({
          apiKey,
          baseUrl:
            typeof env.PORTFOLIO_OPENAI_BASE_URL === "string"
              ? env.PORTFOLIO_OPENAI_BASE_URL
              : undefined,
          model:
            typeof env.PORTFOLIO_OPENAI_MODEL === "string" ? env.PORTFOLIO_OPENAI_MODEL : undefined,
          extraBody:
            typeof env.PORTFOLIO_OPENAI_EXTRA_BODY === "string"
              ? env.PORTFOLIO_OPENAI_EXTRA_BODY
              : undefined,
        });

        const chargedRef = yield* Ref.make(false);

        const sseStream = streamChatEvents(payload.message, payload.history).pipe(
          Stream.tap(() =>
            Ref.getAndSet(chargedRef, true).pipe(
              Effect.flatMap((alreadyCharged) =>
                alreadyCharged
                  ? Effect.void
                  : consumeDeviceAndGlobalLimit(deviceId).pipe(
                      Effect.provide(D1Client.layer({ db })),
                      Effect.catch(() => Effect.void),
                    ),
              ),
            ),
          ),
          Stream.map((event) => `data: ${JSON.stringify(event)}\n\n`),
          Stream.encodeText,
          Stream.provide(modelLayer),
        );

        return HttpServerResponse.stream(sseStream, {
          contentType: "text/event-stream; charset=utf-8",
          headers: {
            "cache-control": "no-cache, no-transform",
            connection: "keep-alive",
            "x-content-type-options": "nosniff",
          },
        });
      }).pipe(Effect.catch((err) => Effect.succeed(errorToResponse(err)))),
    ) as Effect.Effect<void>;
  });
