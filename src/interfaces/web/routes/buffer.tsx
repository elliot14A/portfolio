import { type Context, Hono } from "hono";
import { raw } from "hono/html";
import type { ListTree } from "@/app/content/listTree";
import type { OpenBuffer } from "@/app/content/openBuffer";
import type { ReadIndex } from "@/core/content/ports";
import { errorToHttp } from "../errorMapper";
import { EditorPage } from "../views/pages/editor";
import { ErrorPage } from "../views/pages/errorPage";
import { StartPage } from "../views/pages/start";
import { BufferView } from "../views/partials/buffer";
import { Statusline } from "../views/partials/statusline";
import { Tabline } from "../views/partials/tabline";

export type BufferRoutesDeps = Readonly<{
  openBuffer: OpenBuffer;
  listTree: ListTree;
  readIndex: ReadIndex;
  branch: string;
}>;

const isHtmx = (c: Context): boolean => c.req.header("HX-Request") === "true";

const PREVIEW_LINES = 120;

function PreviewBody(props: {
  buffer: import("@/core/content/content").Buffer;
}) {
  return (
    <>
      {props.buffer.lines.slice(0, PREVIEW_LINES).map((line) => (
        <div class="pv-line">{raw(line.html || " ")}</div>
      ))}
    </>
  );
}

const CACHE_CONTROL = "public, max-age=0, s-maxage=3600";

export const makeBufferRoutes = (deps: BufferRoutesDeps): Hono => {
  const app = new Hono();

  const render = (c: Context, path: string) => {
    const result = deps.openBuffer(path);
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);

      return isHtmx(c)
        ? c.html(
            <div id="cmdline" class="cmdline error" hx-swap-oob="true">
              {line}
            </div>,
            status,
          )
        : c.html(
            <ErrorPage status={status} line={line} branch={deps.branch} />,
            status,
          );
    }

    const buffer = result.value;
    const buffers = Object.values(deps.readIndex().buffers);
    c.header("Cache-Control", CACHE_CONTROL);

    if (isHtmx(c)) {
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
      <EditorPage
        buffer={buffer}
        buffers={buffers}
        tree={deps.listTree()}
        branch={deps.branch}
      />,
    );
  };

  app.get("/", (c) => {
    c.header("Cache-Control", CACHE_CONTROL);
    return c.html(<StartPage branch={deps.branch} />);
  });

  app.get("/b/*", (c) => render(c, c.req.path.slice("/b/".length)));

  app.get("/preview/*", (c) => {
    const result = deps.openBuffer(c.req.path.slice("/preview/".length));
    if (result.isErr()) return c.body("", 404);
    c.header("Cache-Control", CACHE_CONTROL);
    return c.html(<PreviewBody buffer={result.value} />);
  });

  return app;
};
