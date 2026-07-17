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
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require
constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due
to overcomplication, and clarifying questions come before implementation rather than after
mistakes.

---

# portfolio

A portfolio site that **is** a working replica of my Neovim setup. `README.md` is the
profile/resume, `projects/*.md` are the projects - they're rendered as real buffers in a
faithful nvim clone. **SSR-only**: Hono returns HTML fragments to htmx. The only client
code is a small vanilla-TS bundle that owns transient editor state (mode, cursor, pending
keys). Ships as a single Cloudflare Worker.

> This project follows the house Engineering Standards (Bun-first, hexagonal + functional,
> errors-as-values), archetype **Hono + htmx SSR**. Code style and structure mirror the
> minitraycer assignment exactly. Keep changes surgical, simple, and verified.

## Runtime ruling - Bun is the toolchain, Workers is the target

The house standard is Bun-first; the deploy target is Cloudflare Workers. These do not
conflict, but the boundary is strict:

- **Bun** runs everything *around* the code: `bun install`, `bun test`, and the build
  scripts in `scripts/`. `Bun.file` / `Bun.Glob` / `Bun.$` are allowed **only there**.
- **The Worker runtime has no `Bun.*` and no `node:*` beyond `nodejs_compat`.** Request-path
  code uses Web-standard APIs (`fetch`, `Request`/`Response`, `URL`, `crypto`) and CF
  bindings only.
- This costs nothing architecturally: `core/` and `app/` were already forbidden from
  importing `Bun.*` (Principle 6). Platform access is confined to `infra/` and the
  composition root, exactly as the standard requires.

Never call `Bun.*` under `src/`. Never import from `src/infra/` inside `scripts/`.

## Architecture - three inward rings + one surface

Dependencies point **inward only**: `infra → app → core`. `core` and `app` import no
Hono, no `hono/jsx`, no CF binding, no `Bun.*`.

| Dir | Owns |
|---|---|
| `core/` | Pure rules + **port definitions**. `content/` (buffer/line/heading model, path resolution), `editor/` (mode machine, motions, keymap trie, search - all pure), `guestbook/` (entry entity, validation rules). Returns `Result`. No I/O. |
| `app/` | Use-cases as **factory functions**: `makeOpenBuffer`, `makeSearchFiles`, `makeGrepContent`, `makeRunCommand`, `makeRunTermCommand`, `makeSignGuestbook`, `makeListGuestbook`. Take ports, return the operation. Framework-free. |
| `infra/` | Adapters implementing the ports: `content/` (reads the build artifact), `git/` (GitHub API + KV cache), `guestbook/` (Durable Object), `analytics/` (PostHog), `http/` (Hono routes + error mapper), `views/` (`hono/jsx`), `config.ts`, `logger.ts`. |
| `client/` | Browser bundle. `vim/` is a **pure** core (keymap trie, motions, mode machine - mirrors `core/editor`), `dom/` is the thin imperative shell that binds it to events and htmx. |
| `app.tsx` | App factory - builds and exports the Hono app with **no** `fetch` export. `app.request()`-testable. |
| `worker.ts` | Composition root: parse env → wire concrete adapters into use-cases → `export default app` + `export { GuestbookDO }`. |

Feature-first slices, layers inside each slice. Views are pure `(props) => JSX` with no
I/O; `core` never imports them.

```
src/
  core/<feature>/{<feature>.ts, ports.ts}
  app/<feature>/<use-case>.ts
  infra/
    content/  git/  guestbook/  analytics/
    http/routes/<feature>.tsx      # branch on HX-Request: fragment vs full page
    http/errorMapper.ts            # single errorToHttp(AppError)
    views/{layouts,pages,partials,components}
    config.ts  logger.ts
  client/vim/  client/dom/
  app.tsx  worker.ts
content/                            # the markdown that IS the site
scripts/buildContent.ts             # → src/content.generated.ts (never edit by hand)
```

## Dependencies

Minimal by default. **Ask before adding anything not listed here.** A dependency goes
in only when the feature that needs it lands, not before.

**Runtime (shipped in the Worker)**
- `hono` v4 - HTTP + `hono/jsx` for SSR, in-core, no extra view dep.
- `neverthrow` - `Result` / `ResultAsync`.

That is the whole runtime surface. No validation library: the only env read is one
optional string, done with a plain type guard in `infra/config.ts`. No analytics or
client-state library yet; add one behind a port when the feature exists.

**Build-time only** (`scripts/`, never shipped)
- `shiki` - highlights markdown/code with the `rose-pine` theme into per-line HTML.
  Use the fine-grained core + JavaScript regex engine, not the default bundle:
  `createHighlighterCore` from `shiki/core` + `createJavaScriptRegexEngine` from
  `shiki/engine/javascript`, with themes/langs imported individually from `@shikijs/themes/*`
  and `@shikijs/langs/*`. The full bundle resolves `shiki/wasm` in a way Bun cannot load,
  and the JS engine keeps the build wasm-free.
- `htmx.org` - vendored into `public/js/` by `scripts/buildClient.ts`, not bundled through
  `src/`.

**Platform (no dependency)**
- `caches.default` for fragment caching; Workers KV / Durable Objects when a feature needs
  them, always behind a port. No ORM.
- `Bun.Glob` / `Bun.file` / `Bun.$` in `scripts/` only.

**Dev**
- `@types/bun`, `@cloudflare/workers-types`, `wrangler`, `typescript`, `@biomejs/biome`.

## Types & errors - errors as values

- **`neverthrow`.** `core` + `app` return `AppResult<T>` / `AppResultAsync<T>` and never
  throw for expected failure. Adapters convert thrown/rejected I/O into `AppError` at the
  boundary; the core never sees an exception.
- **`AppError` taxonomy, minitraycer style.** Codes are grouped `const` objects of coded
  strings (`ContentErrorCode.NOT_FOUND = "CONTENT_ERR_01"`) unioned into `AppErrorCode`, and
  a single `appError(code, message, info?)` factory builds the value
  `{ code; message; cause?; meta? }`. A new failure is a new code in `core/error.ts` plus one
  line in the exhaustive `Record<AppErrorCode, ...>` mapper. Add a group only when a real
  failure needs it.
- **One central `errorToHttp(AppError)`** in `interfaces/web/errorMapper.ts` maps code to
  `{ status, line }`, where the line is the nvim-authentic message the error already carries
  (`E484: Can't open file x`). It is the only place the taxonomy meets HTTP.
- **Never leak a `Result` into a view.** Unwrap in the route handler; views receive plain
  props.
- **Exhaustiveness.** `switch` on a discriminant with a `never` `default`, or an exhaustive
  `Record` keyed by the union, so a new case fails to compile until handled. String unions,
  no `enum`, no branded types.
- **Immutability.** `readonly` fields, `Readonly<>` / `ReadonlyArray<>` on port signatures;
  transforms produce new objects.

## Wiring

- `worker.ts` reads env into a frozen `Config`, builds the concrete adapters, and passes
  them to the use-case factories. Missing a dependency is a **type error**, not a boot
  crash. No DI container.
- **Use-cases are factories** closing over their ports:
  `const makeOpenBuffer = (deps) => (path) => AppResult<Buffer>`. Tests pass fakes.
- **Ports live in `core/`**, split by cohesion: a **function type** for a single capability
  (`type ReadBuffer = (path: string) => AppResult<Buffer>`); an **`interface`** for a
  cohesive multi-method store.
- **Functional core, imperative shell**, twice. Server: pure `core`, effects in `infra` +
  `worker.ts`. Browser: pure `client/vim`, DOM/htmx effects only in `client/dom`.

## SSR & htmx rules

- **The server owns what is displayed; the client owns where the cursor is.** Motions and
  mode changes resolve client-side with no round-trip. Anything that changes buffer content
  - `:e`, `<S-l>`, `gd`, telescope select, harpoon jump - is an htmx request returning a
  fragment plus `hx-swap-oob` tabline and statusline.
- **Every route branches on `HX-Request`**: fragment for htmx, full page otherwise. The
  no-JS path must render a usable site - tree entries and tabs are real `<a href>`.
- Buffer fragments are cacheable (`s-maxage`, `ETag`); guestbook and presence are
  `no-store`.
- `content.generated.ts` is a build artifact. Edit `content/*.md` and re-run the build;
  never hand-edit the artifact.

## Code style

Match the minitraycer assignment (`~/Desktop/files/assignments/minitraycer`) exactly.

- Bun + TypeScript, ESM. Extensionless relative imports (`@/core/error`, not `.ts`);
  `import type` separated (`verbatimModuleSyntax`).
- `tsconfig` baseline: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`,
  `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`,
  `moduleDetection: "force"`, `jsx: "react-jsx"`, `jsxImportSource: "hono/jsx"`. Path alias
  `@/*` -> `src/*`. `tsc --noEmit` is the type-check gate.
- **Biome** (formatter + linter): 2-space indent, 80 columns, double quotes, semicolons,
  recommended rules, imports organized. No Prettier/ESLint. `check` runs `biome check`
  then `tsc --noEmit`.
- **Functional, zero classes.** A Durable Object, if one is ever added, must be a class;
  keep it a thin shell delegating to pure functions.
- Arrow-const for exported helpers; `function` declarations for route handlers, view
  components, and the `appError` factory.
- Types are `Readonly<{...}>`; `type` over `interface` (except cohesive multi-method ports).
  `as const` for stable literals.
- **Comments are rare and terse**, on the "why", never the "what". No decorative dividers.
  No em dashes anywhere, in code or content; use a plain hyphen.
- **camelCase** file names (no dashes); one primary exported function per file with an
  explicit return type; `index.ts` barrels re-export selectively (no blanket `export *`).

## Adding things

- **A buffer / content file:** drop it in `content/`, re-run `bun run build:content`. No
  code change - if one is needed, the content model is wrong.
- **A `:` command:** add the handler to `core/editor/commands.ts` (pure: args →
  `Result<Action>`), then one dispatch arm in `app/editor/runCommand.ts`. Unknown commands
  must return `E492: Not an editor command: <cmd>`, never a silent no-op.
- **A route:** add `infra/http/routes/<feature>.tsx` (validate input → call a use-case →
  map `Result` to a fragment or full page); register it in `app.tsx`.
- **An external integration:** add `infra/<system>/` - one file per operation returning
  `Result`, an `error.ts` mapping its throws to `AppError`, and its **port defined in
  `core/`**.
- **An analytics event:** add it to the union in `core/analytics/events.ts` and capture
  via the `Analytics` port. Never call PostHog from `core` or `app`.

## Testing

`bun test`. Functional DI removes the need for a mocking framework - **inject in-memory
fakes; never monkey-patch modules.**

- **Unit (majority):** pure `core` + `app` use-cases with fake ports injected. The vim
  motion/keymap/mode logic in `core/editor` and `client/vim` is pure and deterministic -
  it should be the densest-tested part of the codebase, and it needs no DOM.
- **Integration:** `app.request()` against the real Hono app with fake adapters; real
  adapters against `wrangler dev`'s local DO/KV via `@cloudflare/vitest-pool-workers`.
  Never mock the driver.
- **Contract tests:** one adapter-agnostic suite per port, run against **both** the fake and
  the real adapter, so the fake can't silently diverge.
- **SSR assertions:** assert on rendered HTML strings from `app.request()` - the fragment
  contains the right lines, the oob statusline shows the right mode.
- **DOM carve-out:** the standard's Vitest carve-out (§9.5) **applies here** - the modal
  input layer is real client logic. Pure `client/vim` is `bun test`; only `client/dom`
  event binding uses Vitest.
- **Test `Result` values:** `expect(fn(x)).toEqual(ok(expected))` /
  `toEqual(err({ code: "NOT_FOUND", … }))`. Test **both** branches of every use-case - error
  paths are ordinary values here.
- **Layout & naming:** colocate `foo.ts` + `foo.test.ts`; slow lanes in `test/integration`.
  Behaviour-statement names ("returns err when the buffer is readonly"). ~85–90% coverage on
  `core`/`app`; adapters covered by integration.

## Fidelity

The editor must match my actual config at `~/.config/home-manager/modules/nixvim/`, not a
generic dark theme. rose-pine `main` with transparent background; `number` +
`relativenumber`; neo-tree on the **right** at width 30; lualine `globalstatus` with `|`
component separators; indent-blankline `│`; leader = `<Space>`. When adding a keybinding,
mirror `keymaps.nix` / `editor.nix` exactly - if it isn't in my config, it doesn't belong
in the site.
