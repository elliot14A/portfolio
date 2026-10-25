import { PROFILE, PROJECTS_BY_SLUG } from "@portfolio/content";
import { HomePage, ProjectPage } from "@portfolio/web";
import { Effect } from "effect";
import { HttpRouter, HttpServerResponse } from "effect/unstable/http";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { errorToResponse, NotFoundError } from "./error";
import { renderDocument } from "./template";

const defaultHtmlHeaders = {
  "cache-control": "public, max-age=0, must-revalidate",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
};

export const makeRouter = Effect.gen(function* () {
  const router = yield* HttpRouter.make;

  yield* router.add(
    "GET",
    "/",
    Effect.sync(() => {
      const contentHtml = renderToString(
        h(HomePage, {
          profile: PROFILE,
        }),
      );
      const html = renderDocument({
        title: "elliot14a: fullstack engineer & cofounder",
        description: PROFILE.bio[0] ?? "Portfolio of elliot14a",
        contentHtml,
      });
      return HttpServerResponse.text(html, {
        status: 200,
        contentType: "text/html; charset=utf-8",
        headers: defaultHtmlHeaders,
      });
    }),
  );

  yield* router.add(
    "GET",
    "/projects/:slug",
    Effect.gen(function* () {
      const ctx = yield* HttpRouter.RouteContext;
      const slug = ctx.params.slug ?? "";
      const project = PROJECTS_BY_SLUG[slug];

      if (!project) {
        return errorToResponse(
          new NotFoundError({
            resource: "Project",
            identifier: slug,
          }),
        );
      }

      const contentHtml = renderToString(h(ProjectPage, { project }));
      const html = renderDocument({
        title: `${project.title} | elliot14a`,
        description: `${project.title} project writeup`,
        contentHtml,
      });

      return HttpServerResponse.text(html, {
        status: 200,
        contentType: "text/html; charset=utf-8",
        headers: defaultHtmlHeaders,
      });
    }),
  );

  yield* router.add(
    "GET",
    "/health",
    HttpServerResponse.jsonUnsafe({
      status: "ok",
      service: "portfolio-worker",
      timestamp: new Date().toISOString(),
    }),
  );

  yield* router.add(
    "GET",
    "/api/health",
    HttpServerResponse.jsonUnsafe({
      status: "ok",
      service: "portfolio-worker",
      timestamp: new Date().toISOString(),
    }),
  );

  return router;
});

export const makeHttpApp = Effect.gen(function* () {
  const router = yield* makeRouter;
  return router.asHttpEffect().pipe(Effect.catch((err) => Effect.succeed(errorToResponse(err))));
});
