import { Context } from "effect";

export interface CloudflareEnv {
  readonly DB?: D1Database;
  readonly ASSETS?: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  readonly [key: string]: unknown;
}

export class WorkerEnv extends Context.Service<WorkerEnv, CloudflareEnv>()(
  "portfolio/server/WorkerEnv",
) {}

export class WorkerExecutionContext extends Context.Service<
  WorkerExecutionContext,
  ExecutionContext
>()("portfolio/server/WorkerExecutionContext") {}

export class DeviceId extends Context.Service<DeviceId, string>()("portfolio/server/DeviceId") {}

export type AppServices = WorkerEnv | WorkerExecutionContext | DeviceId;
