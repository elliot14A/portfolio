import { Effect } from "effect";
import { type HttpRouter, HttpServerResponse } from "effect/unstable/http";

export const makeHealthRoutes = (router: HttpRouter.HttpRouter) =>
  Effect.gen(function* () {
    const healthHandler = Effect.sync(() =>
      HttpServerResponse.jsonUnsafe({
        status: "ok",
        service: "portfolio-worker",
        timestamp: new Date().toISOString(),
      }),
    );

    yield* router.add("GET", "/health", healthHandler);
  });
