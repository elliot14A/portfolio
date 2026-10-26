import { PROFILE, PROJECTS_BY_SLUG } from "@portfolio/content";
import { HomePage, ProjectPage } from "@portfolio/web";
import { Effect } from "effect";
import { HttpRouter, HttpServerResponse } from "effect/unstable/http";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { WorkerEnv } from "../context";
import { errorToResponse, NotFoundError } from "../error";
import { renderDocument } from "../template";
import { getOrFetchContributions } from "./contributions";

const defaultHtmlHeaders = {
  "cache-control": "public, max-age=0, must-revalidate",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
};

export const makeSsrRoutes = (router: HttpRouter.HttpRouter) =>
  Effect.gen(function* () {
    yield* router.add(
      "GET",
      "/",
      Effect.gen(function* () {
        const env = yield* WorkerEnv;
        const contributions = yield* getOrFetchContributions(env);
        const contentHtml = renderToString(
          h(HomePage, {
            profile: PROFILE,
            contributions,
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
    ) as Effect.Effect<void>;

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
  });
