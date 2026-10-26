# Akshith Katkuri - Portfolio

A high-performance personal portfolio and interactive AI terminal assistant, built with **Effect 4.x** and **Preact**, deployed on **Cloudflare Workers**.

Live at **[elliot14a.work](https://elliot14a.work)**.

## Architecture

Structured as a **Bun Workspace** monorepo:

- **`apps/server`**: Cloudflare Worker runtime embedding Preact SSR and routing the SSE `/api/chat` endpoint via Effect HTTP.
- **`apps/web`**: Preact frontend application rendering layout components, design tokens, and the interactive terminal island.
- **`packages/chat`**: Effect 4.x agent runtime, tool calling, Server-Sent Events (SSE) streaming adapter, and type-safe `HttpApi` contract.
- **`packages/content`**: Pure typed data models and datasets for projects, experience timeline, and profile metadata.
- **`packages/d1`**: Cloudflare D1 persistence, schema migrations, and atomic SQLite rate limiting.
- **`packages/tsconfig`**: Shared TypeScript compiler presets (`base.json`, `worker.json`).
- **`scripts/`**: Workspace build and bundling scripts (`buildClient.ts`, `buildWorker.ts`, `buildContent.ts`).

## Features

- **Performance-First Design**: Scannable layout with highlighted metric pills, architectural deep dives, and an experience timeline.
- **AI Terminal Assistant**: Embedded terminal assistant powered by Effect AI tools that query structured models directly, streaming answers and references token-by-token over Server-Sent Events.
- **Type-Safe API Contracts**: Server routes and client communication are governed by Effect's `HttpApi` and `HttpApiClient`, with zero manual `fetch` calls.
- **Edge Deployment**: Fast initial render with Preact SSR. All static assets (fonts, images, bundles) are served directly from Cloudflare Workers Static Assets CDN.
- **Atomic Rate Limiting**: Abuse prevention with Cloudflare D1 atomic conditional upserts.

## Development

Requires [Bun](https://bun.sh) and [Nix](https://nixos.org) (optional, via `flake.nix`):

```bash
# Enter nix devshell (optional)
nix develop

# Install dependencies
bun install

# Build content, client, and worker bundles
bun run build

# Run local dev server
bun run dev

# Run D1 migrations
bun x wrangler d1 migrations apply portfolio-db --local   # local dev
bun x wrangler d1 migrations apply portfolio-db --remote  # production

# Typecheck and lint
bun run typecheck
bun run lint
```

## Standards & Operating Rules

See [`AGENTS.md`](./AGENTS.md) for architectural standards and invariants.

## License

[MIT](./LICENSE)
