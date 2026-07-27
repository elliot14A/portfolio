import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  type AppError,
  type AppErrorCode,
  ContentErrorCode,
  SystemErrorCode,
} from "@/core/error";

const STATUS: Record<AppErrorCode, ContentfulStatusCode> = {
  [ContentErrorCode.NOT_FOUND]: 404,
  [SystemErrorCode.INTERNAL]: 500,
};

export type HttpError = Readonly<{
  status: ContentfulStatusCode;
  line: string;
}>;

export const errorToHttp = (error: AppError): HttpError => ({
  status: STATUS[error.code],
  line: error.message,
});
