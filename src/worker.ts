import { makeApp } from "@/app";
import { readConfig } from "@/infra/config";

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
