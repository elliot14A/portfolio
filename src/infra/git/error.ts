import { type AppError, appError, GitErrorCode } from "@/core/error";

export const unreachable = (cause: unknown): AppError =>
  appError(GitErrorCode.UNAVAILABLE, "E5110: github is unreachable", { cause });

export const badStatus = (status: number): AppError =>
  appError(GitErrorCode.UNAVAILABLE, "E5110: github is unreachable", {
    meta: { status },
  });
