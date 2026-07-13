# portfolio

A portfolio site that **is** a working replica of my Neovim setup, served from a single
Cloudflare Worker. `content/README.md` is the profile; `content/projects/*.md` are the
projects. They render as real buffers, in real windows, with a real statusline.

SSR-only: Hono returns HTML fragments, htmx swaps them, Alpine holds nothing but transient
editor state. See [`AGENTS.md`](./AGENTS.md) for the architecture and house rules.

## Develop

```bash
bun install
bun run dev          # build content + client, then wrangler dev on :8787
```

| Script                  | Does                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `bun run build`         | content index + client bundle                                 |
| `bun run build:content` | `content/**` → `src/content.generated.ts` (Shiki, rose-pine)  |
| `bun run check`         | `tsc --noEmit` + `biome check`                                |
| `bun test`              | unit + in-process HTTP tests                                  |
| `bun run deploy`        | build, then `wrangler deploy`                                 |

## How it fits together

```
content/**.md ──build──▶ src/content.generated.ts ──▶ infra/content ──▶ app/ ──▶ interfaces/web
                (shiki)       (line-per-row)            (adapter)    (use-cases)   (routes+views)
```

Markdown is highlighted **as source** at build time — nvim shows markdown source with
treesitter colours, so this is both authentic and removes markdown rendering from the
request path entirely. The Worker only slices arrays.

Dependencies point inward only: `infra → app → core`. `core/` and `app/` import no Hono,
no CF binding, and no `Bun.*` (the last is enforced by a biome rule, not just convention).

## Editing content

Edit the markdown, then `bun run build:content`. No code change should ever be needed to
add a file — if one is, the content model is wrong.

`src/content.generated.ts` and `public/js/*.js` are build artifacts and are gitignored.
