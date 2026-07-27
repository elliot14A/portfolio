import { makeApp } from "@/app";
import { readConfig } from "@/infra/config";

// Composition root. Config is read once per isolate and the app is built
// lazily so the wiring is shared across requests.
let app: ReturnType<typeof makeApp> | undefined;

export default {
  fetch(
    request: Request,
    env: unknown,
    ctx: ExecutionContext,
  ): Response | Promise<Response> {
    app ??= makeApp(readConfig(env));
    return app.fetch(request, env, ctx);
  },
};
