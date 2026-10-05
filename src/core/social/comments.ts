import { err, ok } from "neverthrow";
import { type AppResult, appError, SocialErrorCode } from "@/core/error";

export type Comment = Readonly<{
  id: string;
  slug: string;
  author: string;
  message: string;
  createdAt: string;
}>;

export const sanitizeAuthor = (input: string): string =>
  input
    .replace(/^@+/, "")
    .replace(/[<>&"']/g, "")
    .trim();

export const validateCommentInput = (
  author: string,
  message: string,
): AppResult<Readonly<{ author: string; message: string }>> => {
  const sanitizedAuthor = sanitizeAuthor(author);
  if (sanitizedAuthor.length < 1 || sanitizedAuthor.length > 30) {
    return err(
      appError(
        SocialErrorCode.BAD_REQUEST,
        "Author handle must be between 1 and 30 characters",
      ),
    );
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length < 1 || trimmedMessage.length > 500) {
    return err(
      appError(
        SocialErrorCode.BAD_REQUEST,
        "Message must be between 1 and 500 characters",
      ),
    );
  }

  return ok({ author: sanitizedAuthor, message: trimmedMessage });
};
