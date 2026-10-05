-- TOFU handle claiming and 1-like-per-handle table

CREATE TABLE IF NOT EXISTS handles (
  handle TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_handles_token ON handles(token_hash);

CREATE TABLE IF NOT EXISTS post_likes (
  slug TEXT NOT NULL,
  handle TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (slug, handle)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_slug ON post_likes(slug);
