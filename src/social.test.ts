import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { makeApp } from "@/app";
import {
  makeAddComment,
  makeGetComments,
  makeGetLikes,
  makeToggleLike,
} from "@/app/social/useCases";
import { SocialErrorCode } from "@/core/error";
import { sanitizeAuthor, validateCommentInput } from "@/core/social/comments";
import { formatLikes } from "@/core/social/likes";
import { normalizeSlug } from "@/core/social/slug";
import { makeD1SocialStore } from "@/infra/social/d1Store";
import { makeSocialStore } from "@/infra/social/kvStore";
import { DiscussionSection } from "@/interfaces/web/views/partials/discussion";

describe("core: slug", () => {
  test("normalizeSlug removes directory paths, slashes, and extensions", () => {
    expect(normalizeSlug("blogs/building-minimal-software.md")).toBe(
      "building-minimal-software",
    );
    expect(normalizeSlug("/blogs/why-sqlite-in-production.md")).toBe(
      "why-sqlite-in-production",
    );
    expect(normalizeSlug("building-minimal-software")).toBe(
      "building-minimal-software",
    );
    expect(normalizeSlug("blogs/building-minimal-software/")).toBe(
      "building-minimal-software",
    );
    expect(normalizeSlug("")).toBe("");
  });
});

describe("core: likes", () => {
  test("formatLikes formats count as markdown text without emoji", () => {
    expect(formatLikes(0)).toBe("[like: 0]");
    expect(formatLikes(42)).toBe("[like: 42]");
  });
});

describe("core: comments", () => {
  test("sanitizeAuthor trims, removes leading @, and strips angle brackets", () => {
    expect(sanitizeAuthor("@alice")).toBe("alice");
    expect(sanitizeAuthor("@@@bob ")).toBe("bob");
    expect(sanitizeAuthor("<script>alert(1)</script>")).toBe(
      "scriptalert(1)/script",
    );
  });

  test("validateCommentInput succeeds for valid author and message", () => {
    const res = validateCommentInput("@developer", "Looks awesome!");
    expect(res.isOk()).toBe(true);
    if (res.isOk()) {
      expect(res.value.author).toBe("developer");
      expect(res.value.message).toBe("Looks awesome!");
    }
  });

  test("validateCommentInput rejects empty or too long author", () => {
    const empty = validateCommentInput("   ", "valid message");
    expect(empty.isErr()).toBe(true);
    if (empty.isErr()) {
      expect(empty.error.code).toBe(SocialErrorCode.BAD_REQUEST);
    }

    const tooLong = validateCommentInput("a".repeat(31), "valid message");
    expect(tooLong.isErr()).toBe(true);
    if (tooLong.isErr()) {
      expect(tooLong.error.code).toBe(SocialErrorCode.BAD_REQUEST);
    }
  });

  test("validateCommentInput rejects empty or too long message", () => {
    const empty = validateCommentInput("alice", "   ");
    expect(empty.isErr()).toBe(true);
    if (empty.isErr()) {
      expect(empty.error.code).toBe(SocialErrorCode.BAD_REQUEST);
    }

    const tooLong = validateCommentInput("alice", "m".repeat(501));
    expect(tooLong.isErr()).toBe(true);
    if (tooLong.isErr()) {
      expect(tooLong.error.code).toBe(SocialErrorCode.BAD_REQUEST);
    }
  });
});

describe("app: social use cases", () => {
  test("makeGetLikes validates slug and delegates to port", async () => {
    const store = makeSocialStore();
    const getLikes = makeGetLikes(store);

    const badSlug = await getLikes("");
    expect(badSlug.isErr()).toBe(true);

    const okRes = await getLikes("test-buffer");
    expect(okRes.isOk()).toBe(true);
    if (okRes.isOk()) {
      expect(okRes.value.count).toBe(0);
      expect(okRes.value.hasLiked).toBe(false);
    }
  });

  test("makeToggleLike toggles 1 like per handle and checks TOFU", async () => {
    const store = makeSocialStore();
    const toggleLike = makeToggleLike(store);

    const badSlug = await toggleLike("", "alice", "hash1");
    expect(badSlug.isErr()).toBe(true);

    const badHandle = await toggleLike("test-buffer", "", "hash1");
    expect(badHandle.isErr()).toBe(true);

    // 1st like: liked
    const like1 = await toggleLike("test-buffer", "alice", "hash1");
    expect(like1.isOk()).toBe(true);
    if (like1.isOk()) {
      expect(like1.value.count).toBe(1);
      expect(like1.value.hasLiked).toBe(true);
    }

    // 2nd like by same handle: unliked (toggled)
    const like2 = await toggleLike("test-buffer", "alice", "hash1");
    expect(like2.isOk()).toBe(true);
    if (like2.isOk()) {
      expect(like2.value.count).toBe(0);
      expect(like2.value.hasLiked).toBe(false);
    }

    // Spoof attempt: different device hash trying to use alice
    const spoof = await toggleLike("test-buffer", "alice", "hash2");
    expect(spoof.isErr()).toBe(true);
    if (spoof.isErr()) {
      expect(spoof.error.code).toBe(SocialErrorCode.FORBIDDEN);
    }

    // Handle change attempt: same device hash trying to change handle to bob
    const changeHandle = await toggleLike("test-buffer", "bob", "hash1");
    expect(changeHandle.isErr()).toBe(true);
    if (changeHandle.isErr()) {
      expect(changeHandle.error.code).toBe(SocialErrorCode.FORBIDDEN);
    }
  });

  test("makeGetComments and makeAddComment validate inputs and TOFU", async () => {
    const store = makeSocialStore();
    const getComments = makeGetComments(store);
    const addComment = makeAddComment(store);

    const badSlugGet = await getComments("");
    expect(badSlugGet.isErr()).toBe(true);

    const badComment = await addComment("test-buffer", "", "", "hash1");
    expect(badComment.isErr()).toBe(true);

    const commentRes = await addComment(
      "test-buffer",
      "@alice",
      "hello world",
      "hash1",
    );
    expect(commentRes.isOk()).toBe(true);
    if (commentRes.isOk()) {
      expect(commentRes.value.author).toBe("alice");
      expect(commentRes.value.message).toBe("hello world");
      expect(commentRes.value.slug).toBe("test-buffer");
    }

    // Spoof attempt on comment
    const spoofComment = await addComment(
      "test-buffer",
      "@alice",
      "impersonation",
      "hash2",
    );
    expect(spoofComment.isErr()).toBe(true);
    if (spoofComment.isErr()) {
      expect(spoofComment.error.code).toBe(SocialErrorCode.FORBIDDEN);
    }

    const listRes = await getComments("test-buffer");
    expect(listRes.isOk()).toBe(true);
    if (listRes.isOk()) {
      expect(listRes.value.length).toBe(1);
      expect(listRes.value[0]?.author).toBe("alice");
    }
  });
});

describe("infra: d1Store adapter", () => {
  test("memory fallback persists likes, comments, and TOFU handles", async () => {
    const store = makeD1SocialStore();

    const claim1 = await store.verifyOrClaimHandle("alice", "token_a");
    expect(claim1.isOk()).toBe(true);

    // Another device cannot claim alice
    const claimSpoof = await store.verifyOrClaimHandle("alice", "token_b");
    expect(claimSpoof.isErr()).toBe(true);

    // Same device cannot change handle to bob
    const claimChange = await store.verifyOrClaimHandle("bob", "token_a");
    expect(claimChange.isErr()).toBe(true);

    // Toggle like
    const like1 = await store.toggleLike("post-1", "alice");
    expect(like1.isOk()).toBe(true);
    expect(like1._unsafeUnwrap().count).toBe(1);
    expect(like1._unsafeUnwrap().hasLiked).toBe(true);

    const like2 = await store.toggleLike("post-1", "alice");
    expect(like2.isOk()).toBe(true);
    expect(like2._unsafeUnwrap().count).toBe(0);
    expect(like2._unsafeUnwrap().hasLiked).toBe(false);
  });
});

describe("integration: routes & editor page", () => {
  const app = makeApp({});

  test("POST /api/likes toggles like and returns LikeButton fragment", async () => {
    const res = await app.request("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "p_session=test_cookie_charlie",
      },
      body: JSON.stringify({ slug: "README.md", handle: "charlie" }),
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('class="btn-like liked"');
    expect(html).toContain("[liked: 1]");
    expect(html).not.toContain("♥");
    expect(html).toContain('hx-post="/api/likes?slug=');
    expect(html).toContain('hx-swap="outerHTML"');

    // Clicking again toggles off
    const res2 = await app.request("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "p_session=test_cookie_charlie",
      },
      body: JSON.stringify({ slug: "README.md", handle: "charlie" }),
    });
    expect(res2.status).toBe(200);
    const html2 = await res2.text();
    expect(html2).toContain("[like: 0]");
  });

  test("POST /api/likes rejects spoofing with 403", async () => {
    // Another cookie session trying to use charlie
    const res = await app.request("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "p_session=attacker_cookie",
      },
      body: JSON.stringify({ slug: "README.md", handle: "charlie" }),
    });
    expect(res.status).toBe(403);
  });

  test("POST /api/likes rejects missing handle with 400", async () => {
    const res = await app.request("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "README.md" }),
    });
    expect(res.status).toBe(400);
  });

  test("GET /api/likes returns LikeButton for slug", async () => {
    const res = await app.request("/api/likes?slug=README.md");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('class="btn-like"');
    expect(html).toContain('hx-post="/api/likes?slug=');
  });

  test("POST /api/comments adds a comment and locks handle", async () => {
    const res = await app.request("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "p_session=author_dave_session",
      },
      body: JSON.stringify({
        slug: "README.md",
        author: "@dave",
        message: "Clean Neovim aesthetic!",
      }),
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("discussion-comment-item");
    expect(html).toContain("@dave");
    expect(html).toContain("Clean Neovim aesthetic!");

    // Dave cannot change handle to eve on same cookie session
    const resChange = await app.request("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "p_session=author_dave_session",
      },
      body: JSON.stringify({
        slug: "README.md",
        author: "@eve",
        message: "Attempting to change handle",
      }),
    });
    expect(resChange.status).toBe(403);
  });

  test("POST /api/comments rejects empty message with 400", async () => {
    const res = await app.request("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "README.md",
        author: "author",
        message: "",
      }),
    });
    expect(res.status).toBe(400);
  });

  test("GET /api/comments returns CommentsListView", async () => {
    const res = await app.request("/api/comments?slug=README.md");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("discussion-comment-item");
    expect(html).toContain("@dave");
  });

  test("GET /api/comments returns empty placeholder if no comments", async () => {
    const res = await app.request("/api/comments?slug=empty-file.md");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("no comments yet");
  });

  test("renders Markdown-style bottom discussion strictly on blogs and not on README", async () => {
    const readmeRes = await app.request("/b/README.md");
    expect(readmeRes.status).toBe(200);
    const readmeHtml = await readmeRes.text();
    expect(readmeHtml).not.toContain('class="discussion-section"');

    const testApp = new Hono();
    testApp.get("/test", (c) =>
      c.html(DiscussionSection({ slug: "my-first-post" })),
    );
    const blogRes = await testApp.request("/test");
    expect(blogRes.status).toBe(200);
    const blogHtml = await blogRes.text();

    expect(blogHtml).toContain('class="discussion-section"');
    expect(blogHtml).toContain("## discussion");
    expect(blogHtml).toContain("### comments");
    expect(blogHtml).toContain('class="btn-like"');
    expect(blogHtml).toContain('hx-post="/api/likes?slug=my-first-post"');
    expect(blogHtml).toContain('hx-get="/api/likes?slug=my-first-post"');
    expect(blogHtml).toContain('hx-get="/api/comments?slug=my-first-post"');
    expect(blogHtml).toContain('value="my-first-post"');
    expect(blogHtml).not.toContain("slug=blogs/");
    expect(blogHtml).toContain('hx-post="/api/comments"');
    expect(blogHtml).toContain("comment_handle");
    expect(blogHtml).toContain("isLocked");
    expect(blogHtml).not.toContain("[locked]");
    expect(blogHtml).toContain("[post]");
    expect(blogHtml).not.toContain("♥");
  });
});
