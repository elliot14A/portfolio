import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  type AppError,
  type AppErrorCode,
  ContentErrorCode,
  SystemErrorCode,
} from "@/core/error";

// One status per error code. Record keeps this exhaustive: a new code in
// core/error.ts will not compile until it is mapped here.
const STATUS: Record<AppErrorCode, ContentfulStatusCode> = {
  [ContentErrorCode.NOT_FOUND]: 404,
  [SystemErrorCode.INTERNAL]: 500,
};

export type HttpError = Readonly<{
  status: ContentfulStatusCode;
  line: string;
}>;

// The message is already the line vim would print (e.g. "E484: Can't open
// file x"), so it doubles as the command-line text.
export const errorToHttp = (error: AppError): HttpError => ({
  status: STATUS[error.code],
  line: error.message,
});
