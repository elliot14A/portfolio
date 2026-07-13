import { makeApp } from "@/app.tsx";
import { readConfig } from "@/infra/config.ts";

/**
 * Composition root. Config is parsed once per isolate and the app is built lazily, so a
 * bad environment fails the first request loudly instead of at module load.
 */
let app: ReturnType<typeof makeApp> | undefined;

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext): Response | Promise<Response> {
    if (app === undefined) {
      const config = readConfig(env);
      if (config.isErr()) {
        return new Response(`E5108: ${config.error.message}`, { status: 500 });
      }
      app = makeApp(config.value);
    }
    return app.fetch(request, env, ctx);
  },
};
