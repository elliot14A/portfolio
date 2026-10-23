import { Data } from "effect";

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

export class RateLimitError extends Data.TaggedError("RateLimitError")<{
  readonly ip: string;
  readonly retryAfterSeconds: number;
  readonly message: string;
}> {}

export const mapD1Error = (cause: unknown, query?: string, op?: string): D1Error => {
  if (cause instanceof D1Error) {
    return cause;
  }
  return new D1Error({ cause, query, op });
};
