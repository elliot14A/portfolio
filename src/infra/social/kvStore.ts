import { err, ok } from "neverthrow";
import {
  type AppResult,
  appError,
  SocialErrorCode,
  SystemErrorCode,
} from "@/core/error";
import type { Comment } from "@/core/social/comments";
import type { LikesStatus, SocialStore } from "@/core/social/ports";

export type KvStore = Readonly<{
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
}>;

export type SocialKvDeps = Readonly<{
  kv?: KvStore;
}>;

const createMemoryKv = (): KvStore => {
  const store = new Map<string, string>();
  return {
    async get(key: string): Promise<string | null> {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string): Promise<void> {
      store.set(key, value);
    },
  };
};

export const makeSocialStore = (deps: SocialKvDeps = {}): SocialStore => {
  const kv = deps.kv ?? createMemoryKv();

  const verifyOrClaimHandle = async (
    handle: string,
    tokenHash: string,
  ): Promise<AppResult<string>> => {
    try {
      const handleKey = `tofu:handle:${handle}`;
      const tokenKey = `tofu:token:${tokenHash}`;

      const existingToken = await kv.get(handleKey);
      if (existingToken) {
        if (existingToken !== tokenHash) {
          return err(
            appError(
              SocialErrorCode.FORBIDDEN,
              `Handle @${handle} is already claimed on another device`,
            ),
          );
        }
        return ok(handle);
      }

      const existingHandle = await kv.get(tokenKey);
      if (existingHandle && existingHandle !== handle) {
        return err(
          appError(
            SocialErrorCode.FORBIDDEN,
            `This device is already locked to @${existingHandle} and cannot be changed`,
          ),
        );
      }

      await kv.put(handleKey, tokenHash);
      await kv.put(tokenKey, handle);
      return ok(handle);
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to verify handle in KV", {
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
      const key = `post_likes:${slug}`;
      const raw = await kv.get(key);
      const likesList: string[] = raw ? JSON.parse(raw) : [];

      const count = likesList.length;
      const hasLiked = handle ? likesList.includes(handle) : false;

      return ok({ count, hasLiked });
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to read likes", {
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
      const key = `post_likes:${slug}`;
      const raw = await kv.get(key);
      let likesList: string[] = raw ? JSON.parse(raw) : [];

      let hasLiked = false;
      if (likesList.includes(handle)) {
        likesList = likesList.filter((h) => h !== handle);
        hasLiked = false;
      } else {
        likesList.push(handle);
        hasLiked = true;
      }

      await kv.put(key, JSON.stringify(likesList));
      return ok({ count: likesList.length, hasLiked });
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to update like", {
          cause: e,
        }),
      );
    }
  };

  const getComments = async (
    slug: string,
  ): Promise<AppResult<ReadonlyArray<Comment>>> => {
    try {
      const key = `comments:${slug}`;
      const raw =
        (await kv.get(key)) ?? (await kv.get(`social:comments:${slug}`));
      if (!raw) return ok([]);

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return ok(parsed as Comment[]);
      }
      return ok([]);
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to read comments", {
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
      const key = `comments:${slug}`;
      const existingRes = await getComments(slug);
      const existing = existingRes.isOk() ? [...existingRes.value] : [];

      const newComment: Comment = {
        id: crypto.randomUUID(),
        slug,
        author,
        message,
        createdAt: new Date().toISOString(),
      };

      const updated = [newComment, ...existing];
      await kv.put(key, JSON.stringify(updated));
      return ok(newComment);
    } catch (e) {
      return err(
        appError(SystemErrorCode.INTERNAL, "Failed to save comment", {
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
