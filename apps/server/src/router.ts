import { Effect, type Scope } from "effect";
import type { HttpServerRequest, HttpServerResponse } from "effect/unstable/http";
import type { AppServices } from "./context";
import { errorToResponse } from "./error";
import { makeAppRouter } from "./routes";

export { makeAppRouter };

export const makeHttpApp = Effect.gen(function* () {
  const router = yield* makeAppRouter;
  return router
    .asHttpEffect()
    .pipe(Effect.catch((err) => Effect.succeed(errorToResponse(err)))) as Effect.Effect<
    HttpServerResponse.HttpServerResponse,
    never,
    HttpServerRequest.HttpServerRequest | Scope.Scope | AppServices
  >;
});
