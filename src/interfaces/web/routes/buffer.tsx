import { type Context, Hono } from "hono";
import type { ListTree } from "@/app/content/listTree.ts";
import type { OpenBuffer } from "@/app/content/openBuffer.ts";
import type { ReadIndex } from "@/core/content/ports.ts";
import { errorToHttp } from "../errorMapper.ts";
import { EditorPage } from "../views/pages/editor.tsx";
import { StartPage } from "../views/pages/start.tsx";
import { BufferView } from "../views/partials/buffer.tsx";
import { Statusline } from "../views/partials/statusline.tsx";
import { Tabline } from "../views/partials/tabline.tsx";

export type BufferRoutesDeps = Readonly<{
  openBuffer: OpenBuffer;
  listTree: ListTree;
  readIndex: ReadIndex;
  branch: string;
}>;

/** Buffers are immutable per deploy, so the edge can serve them for the whole hour. */
const CACHE_CONTROL = "public, max-age=0, s-maxage=3600";

export const makeBufferRoutes = (deps: BufferRoutesDeps): Hono => {
  const app = new Hono();

  const render = (c: Context, path: string) => {
    const result = deps.openBuffer(path);
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);
      return c.html(
        <div id="cmdline" class="cmdline error" hx-swap-oob="true">
          {line}
        </div>,
        status,
      );
    }

    const buffer = result.value;
    const index = deps.readIndex();
    const buffers = Object.values(index.buffers);
    c.header("Cache-Control", CACHE_CONTROL);

    // htmx swaps the buffer and picks up tabline + statusline out of band; a cold request
    // gets the whole editor.
    if (c.req.header("HX-Request") === "true") {
      return c.html(
        <>
          <BufferView buffer={buffer} />
          <Tabline buffers={buffers} active={buffer.path} />
          <Statusline
            mode="NORMAL"
            path={buffer.path}
            lang={buffer.lang}
            line={1}
            column={1}
            total={buffer.lines.length}
            branch={deps.branch}
            readOnly={buffer.readOnly}
          />
        </>,
      );
    }

    return c.html(
      <EditorPage buffer={buffer} buffers={buffers} tree={deps.listTree()} branch={deps.branch} />,
    );
  };

  // `/` is the alpha start screen, as nvim opens with no buffer loaded.
  app.get("/", (c) => {
    const index = deps.readIndex();
    const buffers = Object.values(index.buffers);
    c.header("Cache-Control", CACHE_CONTROL);
    return c.html(
      <StartPage
        buffers={buffers.length}
        lines={buffers.reduce((sum, buffer) => sum + buffer.lines.length, 0)}
        branch={deps.branch}
      />,
    );
  });

  app.get("/b/*", (c) => render(c, c.req.path.slice("/b/".length)));

  return app;
};
