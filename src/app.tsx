import { Hono } from "hono";
import { makeListTree } from "@/app/content/listTree";
import { makeOpenBuffer } from "@/app/content/openBuffer";
import { appError, SystemErrorCode } from "@/core/error";
import type { Config } from "@/infra/config";
import {
  makeReadBuffer,
  makeReadIndex,
  makeReadTree,
} from "@/infra/content/contentAdapter";
import { errorToHttp } from "@/interfaces/web/errorMapper";
import { makeBufferRoutes } from "@/interfaces/web/routes/buffer";
import { ErrorPage } from "@/interfaces/web/views/pages/errorPage";

// App factory: wires adapters into use-cases and mounts the routes. No fetch
// export and no side effects, so tests drive it with app.request().
export const makeApp = (config: Config): Hono => {
  const openBuffer = makeOpenBuffer({ readBuffer: makeReadBuffer() });
  const listTree = makeListTree({ readTree: makeReadTree() });
  const readIndex = makeReadIndex();

  const app = new Hono();
  app.route(
    "/",
    makeBufferRoutes({
      openBuffer,
      listTree,
      readIndex,
      branch: config.branch,
    }),
  );

  app.notFound((c) =>
    c.html(
      <ErrorPage
        status={404}
        line={`E484: Can't open file ${c.req.path.replace(/^\//, "")}`}
        branch={config.branch}
      />,
      404,
    ),
  );

  app.onError((error, c) => {
    console.error("unhandled", error);
    const { status, line } = errorToHttp(
      appError(SystemErrorCode.INTERNAL, "E5108: internal error"),
    );
    return c.html(
      <ErrorPage status={status} line={line} branch={config.branch} />,
      status,
    );
  });

  return app;
};
