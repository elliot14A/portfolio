import { Hono } from "hono";
import type { GetContributions } from "@/app/git/getContributions";
import { errorToHttp } from "../errorMapper";
import { ContributionsView } from "../views/partials/contributions";

export type ContributionRoutesDeps = Readonly<{
  getContributions: GetContributions;
  sample: boolean;
}>;

// No cache layer by design: every view reads github live. The GraphQL budget is
// 5000 points/hour and this query costs 1, so the headroom is large.
const CACHE_CONTROL = "no-store";

export const makeContributionRoutes = (deps: ContributionRoutesDeps): Hono => {
  const app = new Hono();

  app.get("/contributions", async (c) => {
    const result = await deps.getContributions();
    // htmx does not swap a non-2xx response, so an error leaves the authored
    // `-- contributions --` slot on screen. That one placeholder covers no-JS,
    // github being down, and a malformed reply.
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);
      return c.text(line, status);
    }

    c.header("Cache-Control", CACHE_CONTROL);
    return c.html(
      <ContributionsView graph={result.value} sample={deps.sample} />,
    );
  });

  return app;
};
