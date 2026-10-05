import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  type AppError,
  type AppErrorCode,
  ChatErrorCode,
  ContentErrorCode,
  GitErrorCode,
  SocialErrorCode,
  SystemErrorCode,
} from "@/core/error";

const STATUS: Record<AppErrorCode, ContentfulStatusCode> = {
  [ContentErrorCode.NOT_FOUND]: 404,
  [SystemErrorCode.INTERNAL]: 500,
  [ChatErrorCode.RATE_LIMITED]: 429,
  [ChatErrorCode.PROVIDER]: 502,
  [ChatErrorCode.BAD_REQUEST]: 400,
  [GitErrorCode.UNAVAILABLE]: 502,
  [GitErrorCode.MALFORMED]: 502,
  [SocialErrorCode.BAD_REQUEST]: 400,
  [SocialErrorCode.NOT_FOUND]: 404,
  [SocialErrorCode.FORBIDDEN]: 403,
};

export type HttpError = Readonly<{
  status: ContentfulStatusCode;
  line: string;
}>;

export const errorToHttp = (error: AppError): HttpError => ({
  status: STATUS[error.code],
  line: error.message,
});
