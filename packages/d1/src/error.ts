import { Data, Schema } from "effect";

export class D1Error extends Data.TaggedError("D1Error")<{
  readonly cause: unknown;
  readonly query?: string | undefined;
  readonly op?: string | undefined;
  readonly message?: string | undefined;
}> {
  get failureMessage(): string {
    return this.message ?? (this.cause instanceof Error ? this.cause.message : String(this.cause));
  }
}

export class DeviceDailyLimitExceededError extends Schema.TaggedError<DeviceDailyLimitExceededError>()(
  "DeviceDailyLimitExceededError",
  {
    deviceId: Schema.String,
    date: Schema.String,
    maxRequests: Schema.Number,
    message: Schema.String,
  },
) {}

export class GlobalDailyQuotaExceededError extends Schema.TaggedError<GlobalDailyQuotaExceededError>()(
  "GlobalDailyQuotaExceededError",
  {
    date: Schema.String,
    maxRequests: Schema.Number,
    message: Schema.String,
  },
) {}

export const mapD1Error = (cause: unknown, query?: string, op?: string): D1Error => {
  if (cause instanceof D1Error) {
    return cause;
  }
  return new D1Error({ cause, query, op });
};
