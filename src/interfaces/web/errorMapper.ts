import type { ContentfulStatusCode } from "hono/utils/http-status";
import { assertNever, type PfError } from "@/core/error.ts";

export type HttpError = Readonly<{
  status: ContentfulStatusCode;
  /** The message as vim would print it on the command line. */
  line: string;
}>;

/**
 * The only place the error taxonomy meets HTTP. Messages are real nvim errors — the theme
 * and the typed taxonomy reinforce each other, so a new tag is one arm here and nothing else.
 */
export const errorToHttp = (error: PfError): HttpError => {
  switch (error.code) {
    case "VALIDATION":
      return { status: 400, line: error.message };
    case "NOT_FOUND":
      return { status: 404, line: error.message };
    case "RATE_LIMITED":
      return { status: 429, line: "E1234: Too many requests, slow down" };
    case "DEPENDENCY_UNAVAILABLE":
      return { status: 503, line: "E484: Can't open file (upstream unavailable)" };
    case "INTERNAL":
      return { status: 500, line: "E5108: Error executing lua: internal error" };
    default:
      return assertNever(error.code);
  }
};
