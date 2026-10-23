import { Effect, Schema } from "effect";
import { D1Client } from "./client";
import { D1Error, mapD1Error, RateLimitError } from "./error";

export interface RateLimitConfig {
  readonly maxRequests?: number;
  readonly windowSeconds?: number;
}

export const RateLimitRecord = Schema.Struct({
  ip: Schema.String,
  count: Schema.Number,
  reset_at: Schema.Number,
});
export type RateLimitRecord = typeof RateLimitRecord.Type;

export const checkRateLimit = (
  ip: string,
  config: RateLimitConfig = {},
): Effect.Effect<void, RateLimitError | D1Error, D1Client.D1Client> =>
  Effect.gen(function* () {
    const maxRequests = config.maxRequests ?? 10;
    const windowSeconds = config.windowSeconds ?? 600;
    const now = Math.floor(Date.now() / 1000);

    const sql = yield* D1Client.D1Client;

    const rows = yield* sql`
      select ip, count, reset_at
      from chat_rate_limits
      where ip = ${ip}
    `.pipe(
      Effect.mapError((cause) =>
        mapD1Error(cause, "select from chat_rate_limits", "rateLimit.check"),
      ),
    );

    const row = rows[0];

    if (!row) {
      const resetAt = now + windowSeconds;
      yield* sql`
        insert into chat_rate_limits (ip, count, reset_at, updated_at)
        values (${ip}, 1, ${resetAt}, current_timestamp)
        on conflict(ip) do update set
          count = 1,
          reset_at = ${resetAt},
          updated_at = current_timestamp
      `.pipe(
        Effect.mapError((cause) =>
          mapD1Error(cause, "insert into chat_rate_limits", "rateLimit.reset"),
        ),
      );
      return;
    }

    const record = yield* Schema.decodeUnknownEffect(RateLimitRecord)(row).pipe(
      Effect.mapError(
        (cause) =>
          new D1Error({
            cause,
            query: "select from chat_rate_limits",
            op: "rateLimit.decode",
            message: "failed to decode rate limit record from database",
          }),
      ),
    );

    if (record.reset_at <= now) {
      const resetAt = now + windowSeconds;
      yield* sql`
        update chat_rate_limits
        set count = 1,
            reset_at = ${resetAt},
            updated_at = current_timestamp
        where ip = ${ip}
      `.pipe(
        Effect.mapError((cause) =>
          mapD1Error(cause, "update chat_rate_limits", "rateLimit.resetExpired"),
        ),
      );
      return;
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.max(1, record.reset_at - now);
      return yield* Effect.fail(
        new RateLimitError({
          ip,
          retryAfterSeconds,
          message: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
        }),
      );
    }

    yield* sql`
      update chat_rate_limits
      set count = count + 1,
          updated_at = current_timestamp
      where ip = ${ip}
    `.pipe(
      Effect.mapError((cause) =>
        mapD1Error(cause, "update chat_rate_limits", "rateLimit.increment"),
      ),
    );
  });
