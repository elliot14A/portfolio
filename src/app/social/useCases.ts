import { err } from "neverthrow";
import { type AppResult, appError, SocialErrorCode } from "@/core/error";
import type { Comment } from "@/core/social/comments";
import { sanitizeAuthor, validateCommentInput } from "@/core/social/comments";
import type {
  AddComment,
  GetComments,
  GetLikes,
  LikesStatus,
  ToggleLike,
  VerifyOrClaimHandle,
} from "@/core/social/ports";
import { normalizeSlug } from "@/core/social/slug";

export const makeGetLikes =
  (deps: { getLikes: GetLikes }) =>
  async (
    rawSlug: string,
    rawHandle?: string,
  ): Promise<AppResult<LikesStatus>> => {
    const slug = normalizeSlug(rawSlug);
    if (!slug) {
      return err(appError(SocialErrorCode.BAD_REQUEST, "Slug is required"));
    }
    const handle = rawHandle ? sanitizeAuthor(rawHandle) : undefined;
    return deps.getLikes(slug, handle);
  };

export const makeToggleLike =
  (deps: {
    toggleLike: ToggleLike;
    verifyOrClaimHandle: VerifyOrClaimHandle;
  }) =>
  async (
    rawSlug: string,
    rawHandle: string,
    tokenHash: string,
  ): Promise<AppResult<LikesStatus>> => {
    const slug = normalizeSlug(rawSlug);
    if (!slug) {
      return err(appError(SocialErrorCode.BAD_REQUEST, "Slug is required"));
    }
    const handle = sanitizeAuthor(rawHandle);
    if (!handle) {
      return err(
        appError(SocialErrorCode.BAD_REQUEST, "Handle is required to like"),
      );
    }
    if (!tokenHash) {
      return err(
        appError(SocialErrorCode.BAD_REQUEST, "Device token is required"),
      );
    }

    const claimRes = await deps.verifyOrClaimHandle(handle, tokenHash);
    if (claimRes.isErr()) {
      return err(claimRes.error);
    }

    return deps.toggleLike(slug, handle);
  };

export const makeGetComments =
  (deps: { getComments: GetComments }) =>
  async (rawSlug: string): Promise<AppResult<ReadonlyArray<Comment>>> => {
    const slug = normalizeSlug(rawSlug);
    if (!slug) {
      return err(appError(SocialErrorCode.BAD_REQUEST, "Slug is required"));
    }
    return deps.getComments(slug);
  };

export const makeAddComment =
  (deps: {
    addComment: AddComment;
    verifyOrClaimHandle: VerifyOrClaimHandle;
  }) =>
  async (
    rawSlug: string,
    rawAuthor: string,
    message: string,
    tokenHash: string,
  ): Promise<AppResult<Comment>> => {
    const slug = normalizeSlug(rawSlug);
    if (!slug) {
      return err(appError(SocialErrorCode.BAD_REQUEST, "Slug is required"));
    }
    const validated = validateCommentInput(rawAuthor, message);
    if (validated.isErr()) {
      return err(validated.error);
    }
    if (!tokenHash) {
      return err(
        appError(SocialErrorCode.BAD_REQUEST, "Device token is required"),
      );
    }

    const claimRes = await deps.verifyOrClaimHandle(
      validated.value.author,
      tokenHash,
    );
    if (claimRes.isErr()) {
      return err(claimRes.error);
    }

    return deps.addComment(
      slug,
      validated.value.author,
      validated.value.message,
    );
  };
