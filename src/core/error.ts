import type { Result, ResultAsync } from "neverthrow";

export const ContentErrorCode = {
  NOT_FOUND: "CONTENT_ERR_01",
} as const;

export const SystemErrorCode = {
  INTERNAL: "SYS_ERR_01",
} as const;

export const ChatErrorCode = {
  RATE_LIMITED: "CHAT_ERR_01",
  PROVIDER: "CHAT_ERR_02",
  BAD_REQUEST: "CHAT_ERR_03",
} as const;

export const GitErrorCode = {
  UNAVAILABLE: "GIT_ERR_01",
  MALFORMED: "GIT_ERR_02",
} as const;

type CodeOf<T> = T[keyof T];

export type AppErrorCode =
  | CodeOf<typeof ContentErrorCode>
  | CodeOf<typeof SystemErrorCode>
  | CodeOf<typeof ChatErrorCode>
  | CodeOf<typeof GitErrorCode>;

export type AppError = Readonly<{
  code: AppErrorCode;
  message: string;
  cause?: unknown;
  meta?: Readonly<Record<string, unknown>>;
}>;

export type AppResult<T> = Result<T, AppError>;
export type AppResultAsync<T> = ResultAsync<T, AppError>;

type ErrorInfo = Readonly<{
  cause?: unknown;
  meta?: Readonly<Record<string, unknown>>;
}>;

export function appError(
  code: AppErrorCode,
  message: string,
  info?: ErrorInfo,
): AppError {
  return {
    code,
    message,
    ...(info?.cause !== undefined ? { cause: info.cause } : {}),
    ...(info?.meta !== undefined ? { meta: info.meta } : {}),
  };
}
