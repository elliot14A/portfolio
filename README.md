# Akshith Katkuri - Portfolio

A clean, recruiter-friendly portfolio with an interactive AI terminal prompt, built with **Effect 4.x** and **Preact**, deployed on **Cloudflare Workers**.

Live at **[elliot14a.work](https://elliot14a.work)**.

## Architecture

Structured as a **Bun Workspace** monorepo:

- **`apps/server`**: Cloudflare Worker deployment target embedding Preact SSR and routing `/api/chat` via `HttpApiBuilder`.
- **`apps/web`**: Preact frontend application rendering the layout components, design tokens, and the interactive terminal prompt island.
- **`packages/chat`**: Effect 4.x LLM agent pipeline, OpenAI streaming adapter, rate limiting, and type-safe `HttpApi` contract.
- **`packages/content`**: Pure typed data models and datasets for projects, experience timeline, and profile metadata.
- **`packages/tsconfig`**: Shared TypeScript compiler presets (`base.json`, `worker.json`).
- **`scripts/`**: Workspace build and client bundling scripts (`buildClient.ts`).

## Features

- **Recruiter-First Readability**: Clean vertical scrolling layout with high-impact metric badges (`[built solo from scratch]`, `[10x throughput]`), selected projects, and an experience timeline.
- **Centerpiece Terminal Prompt**: Top terminal prompt (`akshith@mac ~ % ask "..."`) allowing visitors and recruiters to interact with an AI agent trained on Akshith's work, streaming responses token-by-token.
- **Type-Safe API Contracts**: Server routes and client communication are governed by Effect's `HttpApi` and `HttpApiClient`, with zero manual `fetch` calls.
- **Edge Performance**: Fast initial paint with Preact Server-Side Rendering (SSR). All static assets (fonts, images, bundles) are served directly from Cloudflare Workers Static Assets CDN edge cache.

## Development

Requires [Bun](https://bun.sh) and [Nix](https://nixos.org) (optional, via `flake.nix`):

```bash
# Enter nix devshell (optional)
nix develop

# Install dependencies
bun install

# Run typecheck across all workspaces
bun run typecheck

# Run Biome linter and formatter
bun run lint
```

## Standards & Operating Rules

See [`AGENTS.md`](./AGENTS.md) and the Obsidian knowledge base at `~/Desktop/Obsidian/standards/` for detailed architectural standards and rules.

## License

[MIT](./LICENSE)
