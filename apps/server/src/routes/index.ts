import { Effect } from "effect";
import { HttpRouter } from "effect/unstable/http";
import { makeChatRoutes } from "./chat";
import { makeHealthRoutes } from "./health";
import { makeSsrRoutes } from "./ssr";

export { makeChatRoutes } from "./chat";
export { makeHealthRoutes } from "./health";
export { makeSsrRoutes } from "./ssr";

export const makeAppRouter = Effect.gen(function* () {
  const router = yield* HttpRouter.make;
  yield* makeHealthRoutes(router);
  yield* makeSsrRoutes(router);
  yield* makeChatRoutes(router);
  return router;
});
