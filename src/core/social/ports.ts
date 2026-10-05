import type { AppResult } from "@/core/error";
import type { Comment } from "./comments";

export type LikesStatus = Readonly<{
  count: number;
  hasLiked: boolean;
}>;

export type GetLikes = (
  slug: string,
  handle?: string,
) => Promise<AppResult<LikesStatus>>;

export type ToggleLike = (
  slug: string,
  handle: string,
) => Promise<AppResult<LikesStatus>>;

export type VerifyOrClaimHandle = (
  handle: string,
  tokenHash: string,
) => Promise<AppResult<string>>;

export type GetComments = (
  slug: string,
) => Promise<AppResult<ReadonlyArray<Comment>>>;

export type AddComment = (
  slug: string,
  author: string,
  message: string,
) => Promise<AppResult<Comment>>;

export type SocialStore = Readonly<{
  getLikes: GetLikes;
  toggleLike: ToggleLike;
  verifyOrClaimHandle: VerifyOrClaimHandle;
  getComments: GetComments;
  addComment: AddComment;
}>;
