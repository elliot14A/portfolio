import { type Context, Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { AppResult } from "@/core/error";
import type { Comment } from "@/core/social/comments";
import type { LikesStatus } from "@/core/social/ports";
import { normalizeSlug } from "@/core/social/slug";
import { generateDeviceToken, hashToken } from "@/core/social/tofu";
import { errorToHttp } from "../errorMapper";
import { CommentsListView, LikeButton } from "../views/partials/discussion";

export type SocialRoutesDeps = Readonly<{
  getLikes: (slug: string, handle?: string) => Promise<AppResult<LikesStatus>>;
  toggleLike: (
    slug: string,
    handle: string,
    tokenHash: string,
  ) => Promise<AppResult<LikesStatus>>;
  getComments: (slug: string) => Promise<AppResult<ReadonlyArray<Comment>>>;
  addComment: (
    slug: string,
    author: string,
    message: string,
    tokenHash: string,
  ) => Promise<AppResult<Comment>>;
}>;

const getOrCreateDeviceToken = async (
  c: Context,
): Promise<{ token: string; tokenHash: string }> => {
  let token = getCookie(c, "p_session");
  if (!token) {
    token = generateDeviceToken();
    setCookie(c, "p_session", token, {
      path: "/",
      maxAge: 31536000,
      httpOnly: true,
      sameSite: "Lax",
    });
  }
  const tokenHash = await hashToken(token);
  return { token, tokenHash };
};

const parseBody = async (c: Context): Promise<Record<string, string>> => {
  const contentType = c.req.header("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const data = await c.req.json();
      if (typeof data === "object" && data !== null) {
        return Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, String(v)]),
        );
      }
    } catch {
      return {};
    }
  }
  try {
    const data = await c.req.parseBody();
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, typeof v === "string" ? v : ""]),
    );
  } catch {
    return {};
  }
};

export const makeSocialRoutes = (deps: SocialRoutesDeps): Hono => {
  const app = new Hono();

  app.get("/likes", async (c) => {
    const rawSlug = c.req.query("slug") ?? "";
    const rawHandle = c.req.query("handle");
    const slug = normalizeSlug(rawSlug);
    const result = await deps.getLikes(slug, rawHandle);
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);
      return c.text(line, status);
    }
    return c.html(
      <LikeButton
        slug={slug}
        count={result.value.count}
        hasLiked={result.value.hasLiked}
      />,
    );
  });

  app.post("/likes", async (c) => {
    const body = await parseBody(c);
    const rawSlug = body.slug || c.req.query("slug") || "";
    const rawHandle = body.handle || body.author || c.req.query("handle") || "";
    const slug = normalizeSlug(rawSlug);

    const { tokenHash } = await getOrCreateDeviceToken(c);
    const result = await deps.toggleLike(slug, rawHandle, tokenHash);
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);
      return c.text(line, status);
    }
    return c.html(
      <LikeButton
        slug={slug}
        count={result.value.count}
        hasLiked={result.value.hasLiked}
      />,
    );
  });

  app.get("/comments", async (c) => {
    const rawSlug = c.req.query("slug") ?? "";
    const slug = normalizeSlug(rawSlug);
    const result = await deps.getComments(slug);
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);
      return c.text(line, status);
    }
    return c.html(<CommentsListView comments={result.value} />);
  });

  app.post("/comments", async (c) => {
    const body = await parseBody(c);
    const rawSlug = body.slug || c.req.query("slug") || "";
    const slug = normalizeSlug(rawSlug);
    const author = body.author ?? "";
    const message = body.message ?? "";

    const { tokenHash } = await getOrCreateDeviceToken(c);
    const result = await deps.addComment(slug, author, message, tokenHash);
    if (result.isErr()) {
      const { status, line } = errorToHttp(result.error);
      return c.text(line, status);
    }

    const commentsResult = await deps.getComments(slug);
    const comments = commentsResult.isOk()
      ? commentsResult.value
      : [result.value];
    return c.html(<CommentsListView comments={comments} />);
  });

  return app;
};
