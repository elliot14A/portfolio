# portfolio

**This site.** A working Neovim clone that serves itself as a Cloudflare Worker.

## The idea

A portfolio should demonstrate the thing it claims. Mine claims backend
engineering, so it is not a landing page — it is an editor, server-rendered,
with my resume as `README.md` and every project as a file in a buffer list.

## How it works

- **Hono** on a single Worker. Every interaction is an HTML fragment swap.
- **No JSON API for the UI.** htmx asks for HTML, gets HTML back.
- **Alpine** holds nothing but transient editor state — mode, cursor, pending keys.
- **Shiki** highlights the markdown *source* at build time, one span per line.
  The Worker never parses markdown; it slices arrays.

The interesting constraint: keystrokes must never round-trip. Motions and mode
changes resolve client-side. Only things that change *what is displayed* —
`:e`, `<S-l>`, `gd` — hit the server.

## Stack

`hono` · `htmx` · `alpine` · `shiki` · `neverthrow` · `valibot` · `bun`
