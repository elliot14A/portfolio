import type { Result, ResultAsync } from "neverthrow";

export type PfErrorCode =
  | "VALIDATION"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "DEPENDENCY_UNAVAILABLE"
  | "INTERNAL";

export type PfError = Readonly<{
  code: PfErrorCode;
  message: string;
  cause?: unknown;
  meta?: Readonly<Record<string, unknown>>;
}>;

export type PfResult<T> = Result<T, PfError>;
export type PfResultAsync<T> = ResultAsync<T, PfError>;

type ErrorInfo = Readonly<{
  cause?: unknown;
  meta?: Readonly<Record<string, unknown>>;
}>;

const makeError =
  (code: PfErrorCode) =>
  (message: string, info?: ErrorInfo): PfError => ({
    code,
    message,
    ...(info?.cause !== undefined ? { cause: info.cause } : {}),
    ...(info?.meta !== undefined ? { meta: info.meta } : {}),
  });

export const validationError = makeError("VALIDATION");
export const notFoundError = makeError("NOT_FOUND");
export const rateLimitedError = makeError("RATE_LIMITED");
export const dependencyUnavailableError = makeError("DEPENDENCY_UNAVAILABLE");
export const internalError = makeError("INTERNAL");

export function assertNever(value: never): never {
  throw new Error(`Unreachable: unexpected value ${JSON.stringify(value)}`);
}
