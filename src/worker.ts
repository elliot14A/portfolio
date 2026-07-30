import { makeApp } from "@/app";

let app: ReturnType<typeof makeApp> | undefined;

export default {
  fetch(
    request: Request,
    env: unknown,
    ctx: ExecutionContext,
  ): Response | Promise<Response> {
    app ??= makeApp(env);
    return app.fetch(request, env, ctx);
  },
};
