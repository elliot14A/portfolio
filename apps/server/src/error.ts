import { ErrorPage } from "@portfolio/web";
import { Schema } from "effect";
import { HttpServerError, HttpServerResponse } from "effect/unstable/http";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { renderDocument } from "./template";

export class NotFoundError extends Schema.TaggedError<NotFoundError>()("NotFoundError", {
  resource: Schema.String,
  identifier: Schema.optional(Schema.String),
}) {}

export class RenderError extends Schema.TaggedError<RenderError>()("RenderError", {
  message: Schema.String,
}) {}

export type AppError = NotFoundError | RenderError;

export const errorToResponse = (error: unknown): HttpServerResponse.HttpServerResponse => {
  const isRouteNotFound =
    error instanceof NotFoundError ||
    (error instanceof HttpServerError.HttpServerError &&
      error.reason instanceof HttpServerError.RouteNotFound);

  if (isRouteNotFound) {
    const message =
      error instanceof NotFoundError
        ? `The requested resource "${error.identifier ?? error.resource}" could not be found.`
        : "The requested route could not be found.";

    const contentHtml = renderToString(
      h(ErrorPage, {
        statusCode: 404,
        message,
      }),
    );
    const html = renderDocument({
      title: "404 Not Found : elliot14a",
      description: "Page not found",
      contentHtml,
    });

    return HttpServerResponse.text(html, {
      status: 404,
      contentType: "text/html; charset=utf-8",
      headers: {
        "cache-control": "no-cache, no-store, must-revalidate",
        "x-content-type-options": "nosniff",
      },
    });
  }

  const contentHtml = renderToString(
    h(ErrorPage, {
      statusCode: 500,
      message: "An unexpected error occurred while executing this request.",
    }),
  );
  const html = renderDocument({
    title: "500 Internal Error : elliot14a",
    description: "Internal server error",
    contentHtml,
  });

  return HttpServerResponse.text(html, {
    status: 500,
    contentType: "text/html; charset=utf-8",
    headers: {
      "cache-control": "no-cache, no-store, must-revalidate",
      "x-content-type-options": "nosniff",
    },
  });
};
