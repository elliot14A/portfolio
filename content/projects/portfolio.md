# portfolio

> this site: a working replica of my Neovim setup that serves itself as a single
> Cloudflare Worker.

| role | solo build                               |
| ---- | ---------------------------------------- |
| when | 2026                                     |
| link | [elliot14A.work](https://elliot14A.work) |

## the problem

A portfolio should demonstrate the thing it claims. I claim backend engineering,
so this isn't a landing page. It's my Neovim setup rebuilt on the web and
server-rendered, with my resume as README.md and every project as a buffer.

## what I built

- **SSR on a single Cloudflare Worker** with Hono. Every interaction is an HTML
  fragment swap over htmx; Alpine holds only the transient editor state, and
  there's no JSON API.
- **Content as a build artifact**: Shiki highlights the markdown source at build
  time, one span per line, into a generated file. The Worker never parses
  markdown at request time, it slices arrays.
- **Real modal editing**: motions, `:` commands, `/` search, a which-key popup,
  and telescope, all bound the way my Neovim is. Keystrokes resolve client-side;
  only things that change what's displayed hit the server.
- **A framework-free vim core** in its own module, pure and unit-tested, so the
  editor logic can be built and tested without a browser.

## stack

| area   | tech                     |
| ------ | ------------------------ |
| server | Hono, Cloudflare Workers |
| ui     | htmx, Alpine.js          |
| build  | Shiki, Bun               |
| lang   | TypeScript               |
