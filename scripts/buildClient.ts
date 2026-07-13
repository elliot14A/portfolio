#!/usr/bin/env bun

/** Bundles the browser entry and vendors htmx into `public/js/`. Bun-only. */

const OUT_DIR = "public/js";

const bundle = await Bun.build({
  entrypoints: ["src/client/dom/bind.ts"],
  outdir: OUT_DIR,
  naming: "client.js",
  target: "browser",
  minify: true,
});

if (!bundle.success) {
  for (const log of bundle.logs) process.stderr.write(`${log}\n`);
  process.exit(1);
}

const htmx = await Bun.file("node_modules/htmx.org/dist/htmx.min.js").text();
await Bun.write(`${OUT_DIR}/htmx.js`, htmx);

const size = (await Bun.file(`${OUT_DIR}/client.js`).text()).length;
process.stdout.write(`client: ${(size / 1024).toFixed(1)}kb → ${OUT_DIR}/client.js\n`);
