import { D1Client } from "@effect/sql-d1";
import { Effect, Schema } from "effect";
import {
  D1Error,
  DeviceDailyLimitExceededError,
  GlobalDailyQuotaExceededError,
  mapD1Error,
} from "./error";

export type RateLimitConfig = {
  readonly maxDeviceRequests?: number;
  readonly maxGlobalRequests?: number;
};

export const RateLimitCounts = Schema.Struct({
  global_count: Schema.Number,
  device_count: Schema.Number,
});
export type RateLimitCounts = typeof RateLimitCounts.Type;

export const checkDeviceAndGlobalLimit = (
  deviceId: string,
  config?: RateLimitConfig,
): Effect.Effect<
  void,
  DeviceDailyLimitExceededError | GlobalDailyQuotaExceededError | D1Error,
  D1Client.D1Client
> =>
  Effect.gen(function* () {
    const maxDeviceRequests = config?.maxDeviceRequests ?? 10;
    const maxGlobalRequests = config?.maxGlobalRequests ?? 150;
    const today = new Date().toISOString().slice(0, 10);

    const sql = yield* D1Client.D1Client;

    const rows = yield* sql`
      select
        coalesce((select count from chat_global_daily_usage where date = ${today}), 0) as global_count,
        coalesce((select count from chat_device_limits where device_id = ${deviceId} and date = ${today}), 0) as device_count
    `.pipe(
      Effect.mapError((cause) => mapD1Error(cause, "select usage counts", "rateLimit.getCounts")),
    );

    const record = yield* Schema.decodeUnknownEffect(RateLimitCounts)(rows[0]).pipe(
      Effect.mapError(
        (cause) =>
          new D1Error({
            cause,
            query: "select usage counts",
            op: "rateLimit.decodeCounts",
            message: "failed to decode rate limit counts from database",
          }),
      ),
    );

    if (record.global_count >= maxGlobalRequests) {
      return yield* Effect.fail(
        new GlobalDailyQuotaExceededError({
          date: today,
          maxRequests: maxGlobalRequests,
          message: `Daily global quota of ${maxGlobalRequests} requests reached for ${today}.`,
        }),
      );
    }

    if (record.device_count >= maxDeviceRequests) {
      return yield* Effect.fail(
        new DeviceDailyLimitExceededError({
          deviceId,
          date: today,
          maxRequests: maxDeviceRequests,
          message: `Daily device limit of ${maxDeviceRequests} requests reached for ${today}.`,
        }),
      );
    }
  });

export const consumeDeviceAndGlobalLimit = (
  deviceId: string,
  config?: RateLimitConfig,
): Effect.Effect<
  void,
  DeviceDailyLimitExceededError | GlobalDailyQuotaExceededError | D1Error,
  D1Client.D1Client
> =>
  Effect.gen(function* () {
    const maxDeviceRequests = config?.maxDeviceRequests ?? 10;
    const maxGlobalRequests = config?.maxGlobalRequests ?? 150;
    const today = new Date().toISOString().slice(0, 10);
    const sql = yield* D1Client.D1Client;

    const deviceRows = yield* sql`
      insert into chat_device_limits (device_id, date, count, created_at, updated_at)
      values (${deviceId}, ${today}, 1, current_timestamp, current_timestamp)
      on conflict(device_id, date) do update set
        count = count + 1,
        updated_at = current_timestamp
      where count < ${maxDeviceRequests}
      returning count
    `.pipe(
      Effect.mapError((cause) =>
        mapD1Error(cause, "upsert chat_device_limits", "rateLimit.consumeDevice"),
      ),
    );

    if (deviceRows.length === 0) {
      return yield* Effect.fail(
        new DeviceDailyLimitExceededError({
          deviceId,
          date: today,
          maxRequests: maxDeviceRequests,
          message: `Daily device limit of ${maxDeviceRequests} requests reached for ${today}.`,
        }),
      );
    }

    const globalRows = yield* sql`
      insert into chat_global_daily_usage (date, count, created_at, updated_at)
      values (${today}, 1, current_timestamp, current_timestamp)
      on conflict(date) do update set
        count = count + 1,
        updated_at = current_timestamp
      where count < ${maxGlobalRequests}
      returning count
    `.pipe(
      Effect.mapError((cause) =>
        mapD1Error(cause, "upsert chat_global_daily_usage", "rateLimit.consumeGlobal"),
      ),
    );

    if (globalRows.length === 0) {
      return yield* Effect.fail(
        new GlobalDailyQuotaExceededError({
          date: today,
          maxRequests: maxGlobalRequests,
          message: `Daily global quota of ${maxGlobalRequests} requests reached for ${today}.`,
        }),
      );
    }
  });
