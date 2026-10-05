import type { Comment } from "@/core/social/comments";
import { normalizeSlug } from "@/core/social/slug";

export const formatCommentDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  return `${year}-${month}-${day} ${hours}:${mins}`;
};

export function LikeButton(props: {
  slug: string;
  count: number;
  hasLiked?: boolean;
}) {
  const slug = normalizeSlug(props.slug);
  const { count, hasLiked } = props;
  const label = hasLiked ? `[liked: ${count}]` : `[like: ${count}]`;
  const btnClass = hasLiked ? "btn-like liked" : "btn-like";

  return (
    <button
      type="button"
      class={btnClass}
      hx-post={`/api/likes?slug=${encodeURIComponent(slug)}`}
      hx-vals="js:{ handle: localStorage.getItem('comment_handle') || '' }"
      hx-swap="outerHTML"
      title={hasLiked ? "Unlike this buffer" : "Like this buffer"}
      x-on:click="if (!localStorage.getItem('comment_handle')) { const h = prompt('Enter your @handle to like:'); if (h && h.trim()) { const c = h.replace(/^@+/, '').trim(); localStorage.setItem('comment_handle', c); window.dispatchEvent(new CustomEvent('handle-updated', { detail: c })); } else { $event.preventDefault(); return false; } }"
    >
      {label}
    </button>
  );
}

export function CommentsListView(props: { comments: ReadonlyArray<Comment> }) {
  const { comments } = props;
  if (comments.length === 0) {
    return <div class="discussion-empty">- (no comments yet)</div>;
  }

  return (
    <div class="discussion-comments-wrapper">
      {comments.map((comment) => (
        <div class="discussion-comment-item" key={comment.id}>
          <span class="md-bullet">- </span>
          <span class="discussion-comment-author">
            @{comment.author.replace(/^@+/, "")}
          </span>
          <span class="discussion-comment-date">
            {" "}
            ({formatCommentDate(comment.createdAt)}):
          </span>{" "}
          <span class="discussion-comment-body">{comment.message}</span>
        </div>
      ))}
    </div>
  );
}

export function DiscussionSection(props: {
  slug: string;
  likes?: number;
  comments?: ReadonlyArray<Comment>;
}) {
  const slug = normalizeSlug(props.slug);
  const initialLikes = props.likes ?? 0;
  const initialComments = props.comments ?? [];

  return (
    <div class="discussion-section">
      <div class="md-hr">---</div>
      <div class="md-h2">## discussion</div>

      <div
        class="discussion-likes-container"
        hx-get={`/api/likes?slug=${encodeURIComponent(slug)}`}
        hx-vals="js:{ handle: localStorage.getItem('comment_handle') || '' }"
        hx-trigger="load once"
        hx-swap="innerHTML"
      >
        <LikeButton slug={slug} count={initialLikes} />
      </div>

      <div class="md-h3">### comments</div>

      <div
        id="comments-list"
        class="discussion-comments-list"
        hx-get={`/api/comments?slug=${encodeURIComponent(slug)}`}
        hx-trigger="load once"
        hx-swap="innerHTML"
      >
        <CommentsListView comments={initialComments} />
      </div>

      <form
        class="discussion-comment-form"
        hx-post="/api/comments"
        hx-target="#comments-list"
        hx-swap="innerHTML"
        {...{
          "x-data":
            "{ handle: localStorage.getItem('comment_handle') || '', message: '', get isLocked() { return !!this.handle && !!localStorage.getItem('comment_handle'); } }",
          "x-on:handle-updated.window": "handle = $event.detail",
          "x-on:submit":
            "if (handle) localStorage.setItem('comment_handle', handle.replace(/^@+/, '').trim());",
          "hx-on--after-request":
            "if (event.detail && event.detail.successful) { const el = this.querySelector('input[name=message]'); if (el) { el.value = ''; el.dispatchEvent(new Event('input')); } }",
        }}
      >
        <input type="hidden" name="slug" value={slug} />
        <div class="discussion-form-line">
          <span class="md-quote">&gt; @handle: </span>
          <template x-if="isLocked">
            <span class="discussion-handle-locked">
              <span x-text="handle"></span>
              <input type="hidden" name="author" x-bind:value="handle" />
            </span>
          </template>
          <template x-if="!isLocked">
            <input
              type="text"
              name="author"
              x-model="handle"
              x-on:change="if (handle.trim()) { const c = handle.replace(/^@+/, '').trim(); localStorage.setItem('comment_handle', c); handle = c; }"
              placeholder="name"
              required
              minlength={1}
              maxlength={30}
              class="discussion-input discussion-input-author"
              autocomplete="off"
              spellcheck={false}
            />
          </template>
        </div>
        <div class="discussion-form-line">
          <span class="md-quote">&gt; message: </span>
          <input
            type="text"
            name="message"
            x-model="message"
            placeholder="write a comment..."
            required
            minlength={1}
            maxlength={500}
            class="discussion-input discussion-input-msg"
            autocomplete="off"
            spellcheck={false}
          />
          <button type="submit" class="discussion-submit-btn">
            [post]
          </button>
        </div>
      </form>
    </div>
  );
}
