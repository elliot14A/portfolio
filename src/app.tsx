import { Hono } from "hono";
import { makeListTree } from "@/app/content/listTree.ts";
import { makeOpenBuffer } from "@/app/content/openBuffer.ts";
import type { Config } from "@/infra/config.ts";
import { makeReadBuffer, makeReadIndex, makeReadTree } from "@/infra/content/contentAdapter.ts";
import { makeBufferRoutes } from "@/interfaces/web/routes/buffer.tsx";

/**
 * App factory — wires adapters into use-cases and mounts the surfaces. No `fetch` export
 * and no side effects, so tests drive it in-process with `app.request()`.
 */
export const makeApp = (config: Config): Hono => {
  const readBuffer = makeReadBuffer();
  const readTree = makeReadTree();
  const readIndex = makeReadIndex();

  const openBuffer = makeOpenBuffer({ readBuffer });
  const listTree = makeListTree({ readTree });

  const app = new Hono();
  app.route("/", makeBufferRoutes({ openBuffer, listTree, readIndex, branch: config.branch }));
  return app;
};
