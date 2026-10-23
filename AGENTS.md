# AGENTS.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific
instructions as needed. *(Preface adapted from Andrej Karpathy's CLAUDE.md -
github.com/multica-ai/andrej-karpathy-skills.)*

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use
judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" -> "Write schemas and verify invalid inputs fail"
- "Fix the bug" -> "Identify cause, fix, and verify"
- "Refactor X" -> "Ensure typechecks pass before and after"

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due
to overcomplication, and clarifying questions come before implementation rather than after
mistakes.

---

# Portfolio Architecture and Operating Contract

A clean, high-performance portfolio featuring a scannable layout and an interactive AI terminal prompt, deployed as a single Cloudflare Worker.

> Runtime: **Effect 4.x (`4.0.0-rc.115`)** + **Preact (`10.29.8`)**  
> Toolchain: **Bun Workspaces** + **Nix (Flakes)**  
> Standards: **`~/Desktop/Obsidian/standards/`**  
> Tracker: **`~/Desktop/Obsidian/portfolio/kanban-board.md`**  

## 1. Monorepo Structure

```text
portfolio/
├── apps/
│   ├── server/       # Cloudflare Worker deployment target (embeds Preact SSR + API router)
│   └── web/          # Preact presentation layer (layout components, tokens, terminal island)
├── packages/
│   ├── chat/         # Effect 4.x LLM agent, streaming adapter, rate-limiting, HttpApi contract
│   ├── content/      # Structured typed data models (projects, experience, profile)
│   └── tsconfig/     # Shared compiler presets (base.json, worker.json)
├── scripts/          # Workspace build scripts (e.g. buildClient.ts)
├── flake.nix         # Nix devshell (bun, nodejs_22, wrangler, git)
├── biome.json        # Biome 2.5 linter and formatter
├── bun.lock          # Bun lockfile
└── package.json      # Workspace root
```

## 2. Hard Operating Rules

1. **Never commit without human consent**:
   NEVER run `git commit` or `git push` without explicit user permission.
2. **Never use `throw` or `try/catch`**:
   All business logic and external I/O must return `Effect<A, DomainError>` or `Either` (per `standards/effect-rules.md`).
3. **Type-safe API contracts with zero manual fetch**:
   All endpoints must be declared using `HttpApiEndpoint` / `HttpApiGroup` in `@portfolio/chat`. The client consumes `HttpApiClient` directly. Never write raw `fetch('/api/chat', ...)` (per `standards/api-contracts.md`).
4. **Zero raw hex colors and zero inline styles**:
   All colors, spacing, and typography come from `tokens.ts`. Co-locate styles in companion style files (per `standards/frontend-styles.md`).
5. **Zero em dashes**:
   The long dash (`—` or `--`) is strictly forbidden anywhere in code, comments, docs, or UI text. Use hyphens, colons, or commas (per `standards/plain-english-and-naming.md`).
6. **Folder `index.ts` is the public interface**:
   Outside code imports from `index.ts`, never from deep internal sub-paths (per `standards/project-structure.md`).
7. **Static assets served via CDN**:
   All static assets (`public/`) are strictly served via Cloudflare Workers Static Assets CDN. The Worker compute executes only for dynamic Preact SSR (`GET /`) and the streaming API (`POST /api/chat`).
8. **Dependencies hoisted to root**:
   Shared runtime packages (`effect`, `preact`) are declared once in root `package.json` and inherited by all packages and apps.

## 3. Verification Commands

Before requesting review:
```bash
bun run typecheck && bun x biome check .
```
All checks must exit with code `0`.
