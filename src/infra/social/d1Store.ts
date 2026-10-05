import { err, ok } from "neverthrow";
import {
  type AppResult,
  appError,
  SocialErrorCode,
  SystemErrorCode,
} from "@/core/error";
import type { Comment } from "@/core/social/comments";
import type { LikesStatus, SocialStore } from "@/core/social/ports";

export type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<{ success?: boolean }>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
};

export type D1Database = {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<{ count?: number }>;
};

export type SocialD1Deps = Readonly<{
  db?: D1Database;
}>;

const createMemorySocialStore = (): SocialStore => {
  const postLikes = new Set<string>(); // key: `${slug}:${handle}`
  const handlesMap = new Map<string, string>(); // handle -> tokenHash
  const tokensMap = new Map<string, string>(); // tokenHash -> handle
  const commentsMap = new Map<string, Comment[]>();

  return {
    async verifyOrClaimHandle(
      handle: string,
      tokenHash: string,
    ): Promise<AppResult<string>> {
      if (handlesMap.has(handle)) {
        const boundToken = handlesMap.get(handle);
        if (boundToken !== tokenHash) {
          return err(
            appError(
              SocialErrorCode.FORBIDDEN,
              `Handle @${handle} is already claimed on another device`,
            ),
          );
        }
        return ok(handle);
      }

      const boundHandle = tokensMap.get(tokenHash);
      if (boundHandle && boundHandle !== handle) {
        return err(
          appError(
            SocialErrorCode.FORBIDDEN,
            `This device is already locked to @${boundHandle} and cannot be changed`,
          ),
        );
      }

      handlesMap.set(handle, tokenHash);
      tokensMap.set(tokenHash, handle);
      return ok(handle);
    },

    async getLikes(
      slug: string,
      handle?: string,
    ): Promise<AppResult<LikesStatus>> {
      let count = 0;
      const prefix = `${slug}:`;
      for (const key of postLikes) {
        if (key.startsWith(prefix)) {
          count++;
        }
      }
      const hasLiked = handle ? postLikes.has(`${slug}:${handle}`) : false;
      return ok({ count, hasLiked });
    },

    async toggleLike(
      slug: string,
      handle: string,
    ): Promise<AppResult<LikesStatus>> {
      const key = `${slug}:${handle}`;
      let hasLiked = false;
      if (postLikes.has(key)) {
        postLikes.delete(key);
        hasLiked = false;
      } else {
        postLikes.add(key);
        hasLiked = true;
      }

      let count = 0;
      const prefix = `${slug}:`;
      for (const k of postLikes) {
        if (k.startsWith(prefix)) {
          count++;
        }
      }

      return ok({ count, hasLiked });
    },

    async getComments(
      slug: string,
    ): Promise<AppResult<ReadonlyArray<Comment>>> {
      return ok(commentsMap.get(slug) ?? []);
    },

    async addComment(
      slug: string,
      author: string,
      message: string,
    ): Promise<AppResult<Comment>> {
      const comment: Comment = {
        id: crypto.randomUUID(),
        slug,
        author,
        message,
        createdAt: new Date().toISOString(),
      };
      const existing = commentsMap.get(slug) ?? [];
      commentsMap.set(slug, [comment, ...existing]);
      return ok(comment);
    },
  };
};

export const makeD1SocialStore = (deps: SocialD1Deps = {}): SocialStore => {
  const { db } = deps;
  if (!db) {
    return createMemorySocialStore();
  }

  const verifyOrClaimHandle = async (
    handle: string,
    tokenHash: string,
  ): Promise<AppResult<string>> => {
    try {
      const existingByHandle = await db
        .prepare("SELECT token_hash FROM handles WHERE handle = ?")
        .bind(handle)
        .first<{ token_hash: string }>();

      if (existingByHandle) {
        if (existingByHandle.token_hash !== tokenHash) {
          return err(
            appError(
              SocialErrorCode.FORBIDDEN,
              `Handle @${handle} is already claimed on another device`,
            ),
          );
        }
        return ok(handle);
      }

      const existingByToken = await db
        .prepare("SELECT handle FROM handles WHERE token_hash = ?")
        .bind(tokenHash)
        .first<{ handle: string }>();

      if (existingByToken && existingByToken.handle !== handle) {
        return err(
          appError(
            SocialErrorCode.FORBIDDEN,
            `This device is already locked to @${existingByToken.handle} and cannot be changed`,
          ),
        );
      }

      await db
        .prepare(
          "INSERT INTO handles (handle, token_hash, created_at) VALUES (?, ?, ?)",
        )
        .bind(handle, tokenHash, new Date().toISOString())
        .run();

      return ok(handle);
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to verify handle in D1", {
          cause: e,
        }),
      );
    }
  };

  const getLikes = async (
    slug: string,
    handle?: string,
  ): Promise<AppResult<LikesStatus>> => {
    try {
      const countRow = await db
        .prepare("SELECT COUNT(*) AS count FROM post_likes WHERE slug = ?")
        .bind(slug)
        .first<{ count: number }>();
      const count = countRow?.count ?? 0;

      let hasLiked = false;
      if (handle) {
        const likedRow = await db
          .prepare(
            "SELECT 1 FROM post_likes WHERE slug = ? AND handle = ? LIMIT 1",
          )
          .bind(slug, handle)
          .first();
        hasLiked = !!likedRow;
      }

      return ok({ count, hasLiked });
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to read likes from D1", {
          cause: e,
        }),
      );
    }
  };

  const toggleLike = async (
    slug: string,
    handle: string,
  ): Promise<AppResult<LikesStatus>> => {
    try {
      const existing = await db
        .prepare(
          "SELECT 1 FROM post_likes WHERE slug = ? AND handle = ? LIMIT 1",
        )
        .bind(slug, handle)
        .first();

      let hasLiked = false;
      if (existing) {
        await db
          .prepare("DELETE FROM post_likes WHERE slug = ? AND handle = ?")
          .bind(slug, handle)
          .run();
        hasLiked = false;
      } else {
        await db
          .prepare(
            "INSERT INTO post_likes (slug, handle, created_at) VALUES (?, ?, ?)",
          )
          .bind(slug, handle, new Date().toISOString())
          .run();
        hasLiked = true;
      }

      const countRow = await db
        .prepare("SELECT COUNT(*) AS count FROM post_likes WHERE slug = ?")
        .bind(slug)
        .first<{ count: number }>();

      return ok({ count: countRow?.count ?? 0, hasLiked });
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to update like in D1", {
          cause: e,
        }),
      );
    }
  };

  const getComments = async (
    slug: string,
  ): Promise<AppResult<ReadonlyArray<Comment>>> => {
    try {
      const res = await db
        .prepare(
          "SELECT id, slug, author, message, created_at AS createdAt FROM comments WHERE slug = ? ORDER BY created_at DESC",
        )
        .bind(slug)
        .all<Comment>();
      return ok(res.results ?? []);
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to read comments from D1", {
          cause: e,
        }),
      );
    }
  };

  const addComment = async (
    slug: string,
    author: string,
    message: string,
  ): Promise<AppResult<Comment>> => {
    try {
      const comment: Comment = {
        id: crypto.randomUUID(),
        slug,
        author,
        message,
        createdAt: new Date().toISOString(),
      };
      await db
        .prepare(
          "INSERT INTO comments (id, slug, author, message, created_at) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(
          comment.id,
          comment.slug,
          comment.author,
          comment.message,
          comment.createdAt,
        )
        .run();
      return ok(comment);
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to insert comment in D1", {
          cause: e,
        }),
      );
    }
  };

  return {
    verifyOrClaimHandle,
    getLikes,
    toggleLike,
    getComments,
    addComment,
  };
};
