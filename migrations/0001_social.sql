CREATE TABLE IF NOT EXISTS likes (
  slug TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  author TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments (slug, created_at DESC);
