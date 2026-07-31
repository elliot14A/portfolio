# portfolio

A portfolio site that **is** a working replica of my Neovim setup, served from a single
Cloudflare Worker. `content/README.md` is the profile; `content/projects/*.md` are the
projects. They render as real buffers, in real windows, with a real statusline.

Live at **[elliot14a.work](https://elliot14a.work)**.

SSR-only: Hono returns HTML fragments, htmx swaps them, Alpine holds nothing but transient
editor state. See [`AGENTS.md`](./AGENTS.md) for the architecture and house rules.

## What's in it

- A modal editor in the browser: motions, counts, `/` search, `:` commands, telescope,
  which-key, splits. The input engine (`src/client/vim/`) is pure and unit-tested.
- Real buffers rendered from markdown highlighted **as source** at build time.
- An **assistant** (`:ask`, or the dashboard's Ask entry). Ask about my work and it
  streams an answer token by token while driving the editor, opening the relevant buffer
  as it talks. It speaks the OpenAI chat-completions API, so any compatible provider works
  (see [Configuration](#configuration)).

## Develop

```bash
bun install
bun run dev          # build content + client, then wrangler dev on :8787
```

| Script                  | Does                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `bun run build`         | content index + client bundle                                 |
| `bun run build:content` | `content/**` to `src/content.generated.ts` (Shiki, rose-pine) |
| `bun run check`         | `tsc --noEmit` + `biome check`                                |
| `bun test`              | unit + in-process HTTP tests                                  |
| `bun run deploy`        | build, then `wrangler deploy`                                 |

Without an API key the assistant runs in a dev-mock mode, so the site is fully usable
locally with no configuration.

## How it fits together

```
content/**.md ──build──▶ src/content.generated.ts ──▶ infra/content ──▶ app/ ──▶ interfaces/web
                (shiki)       (line-per-row)            (adapter)    (use-cases)   (routes+views)
```

Markdown is highlighted **as source** at build time. nvim shows markdown source with
treesitter colours, so this is both authentic and removes markdown rendering from the
request path entirely. The Worker only slices arrays.

Dependencies point inward only: `infra → app → core`. `core/` and `app/` import no Hono,
no CF binding, and no `Bun.*` (the last is enforced by a biome rule, not just convention).
Each feature follows the same shape: `core/` holds pure logic and port types, `infra/`
implements the ports, `app/` composes them into a use-case, and the route is a thin HTTP
adapter. The assistant (`core/chat`, `app/chat`, `infra/chat`) is wired the same way.

## Configuration

The assistant is provider-agnostic. Set these as Worker secrets/vars for production, or
copy [`.dev.vars.example`](./.dev.vars.example) to `.dev.vars` (gitignored) for local dev.

| Variable                     | Purpose                                          | Default                          |
| ---------------------------- | ------------------------------------------------ | -------------------------------- |
| `PORTFOLIO_OPENAI_BASE_URL`  | OpenAI-compatible base URL                       | `https://openrouter.ai/api/v1`   |
| `PORTFOLIO_OPENAI_API_KEY`   | provider API key (**secret**, never committed)   | unset (dev-mock mode)            |
| `PORTFOLIO_OPENAI_MODEL`     | model id                                         | `deepseek/deepseek-v4-flash-0731` |
| `PORTFOLIO_OPENAI_EXTRA_BODY`| optional JSON merged into every request body     | `{}`                             |

```bash
wrangler secret put PORTFOLIO_OPENAI_API_KEY     # set the key out of band
```

`PORTFOLIO_OPENAI_EXTRA_BODY` keeps provider-specific tuning out of the code. The default
uses two OpenRouter fields: `reasoning: { enabled: false }` so deepseek streams answer text
instead of hidden thinking, and `provider: { order: ["DeepInfra"] }` to pin one provider so
**prompt caching** actually hits (caching needs a stable provider; OpenRouter otherwise
load-balances and each call misses the cache). The static portfolio context sits at the
front of every request, so on repeat calls in a conversation it is served from cache.
Leave the var empty for a plain OpenAI-compatible endpoint.

Rate limiting (per-IP and global daily caps, keyed on the unspoofable `CF-Connecting-IP`)
uses the `CHAT` KV namespace. It is optional: without the binding the limiter is a no-op.

## Editing content

Edit the markdown, then `bun run build:content`. No code change should ever be needed to
add a file. If one is, the content model is wrong.

`src/content.generated.ts` and `public/js/*.js` are build artifacts and are gitignored.

## License

[MIT](./LICENSE).
