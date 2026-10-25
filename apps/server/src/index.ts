import { Effect } from "effect";
import { HttpEffect } from "effect/unstable/http";
import type { CloudflareEnv } from "./context";
import { makeHttpApp } from "./router";

const webHandler = Effect.runSync(
  Effect.gen(function* () {
    const app = yield* makeHttpApp;
    return HttpEffect.toWebHandler(app);
  }),
);

export default {
  async fetch(request: Request, env: CloudflareEnv, _ctx: ExecutionContext): Promise<Response> {
    const response = await webHandler(request);

    if (response.status === 404 && env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    return response;
  },
};
