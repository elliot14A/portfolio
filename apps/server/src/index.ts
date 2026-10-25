import { Context, Effect, Result, type Scope } from "effect";
import { HttpEffect, type HttpServerRequest } from "effect/unstable/http";
import {
  type AppServices,
  type CloudflareEnv,
  DeviceId,
  WorkerEnv,
  WorkerExecutionContext,
} from "./context";
import { makeHttpApp } from "./router";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const extractDeviceId = (cookieHeader: string | null): string | undefined => {
  if (!cookieHeader) {
    return undefined;
  }
  for (const cookie of cookieHeader.split(";")) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === "portfolio_did") {
      let rawVal = rest.join("=").trim();
      if (rawVal.startsWith('"') && rawVal.endsWith('"') && rawVal.length >= 2) {
        rawVal = rawVal.slice(1, -1).trim();
      }
      if (rawVal.length === 0) {
        continue;
      }
      const decoded = Result.try(() => decodeURIComponent(rawVal)).pipe(Result.getOrUndefined);
      if (decoded && UUID_REGEX.test(decoded)) {
        return decoded;
      }
    }
  }
  return undefined;
};

const attachDeviceCookie = (res: Response, deviceId: string): Response => {
  const newHeaders = new Headers(res.headers);
  newHeaders.append(
    "Set-Cookie",
    `portfolio_did=${deviceId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
  );
  newHeaders.append("Vary", "Cookie");
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
};

const webHandler = Effect.runSync(
  Effect.gen(function* () {
    const app = yield* makeHttpApp;
    return HttpEffect.toWebHandlerWith<
      never,
      HttpServerRequest.HttpServerRequest | Scope.Scope | AppServices
    >(Context.empty())(app);
  }),
);

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext): Promise<Response> {
    const cookieHeader = request.headers.get("cookie");
    const existingDeviceId = extractDeviceId(cookieHeader);
    const deviceId = existingDeviceId ?? crypto.randomUUID();
    const isNewDevice = !existingDeviceId;

    const context = Context.empty().pipe(
      Context.add(WorkerEnv, env),
      Context.add(WorkerExecutionContext, ctx),
      Context.add(DeviceId, deviceId),
    );

    const response = await webHandler(request, context);

    if (response.status === 404 && env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return isNewDevice ? attachDeviceCookie(assetResponse, deviceId) : assetResponse;
      }
    }

    return isNewDevice ? attachDeviceCookie(response, deviceId) : response;
  },
};
