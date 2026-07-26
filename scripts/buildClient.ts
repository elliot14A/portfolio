#!/usr/bin/env bun

// Builds the browser assets: bundles the client entry, vendors htmx, and
// concatenates styles/*.css into public/css/editor.css. Bun only.

const JS_DIR = "public/js";
const CSS_OUT = "public/css/editor.css";

const bundle = await Bun.build({
  entrypoints: ["src/client/dom/index.ts"],
  outdir: JS_DIR,
  naming: "client.js",
  target: "browser",
  minify: true,
});

if (!bundle.success) {
  for (const log of bundle.logs) process.stderr.write(`${log}\n`);
  process.exit(1);
}

const htmx = await Bun.file("node_modules/htmx.org/dist/htmx.min.js").text();
await Bun.write(`${JS_DIR}/htmx.js`, htmx);

// Numeric prefixes give a stable cascade order (fonts, tokens, base, ...).
const parts = [...new Bun.Glob("*.css").scanSync({ cwd: "styles" })].sort();
const css = (
  await Promise.all(parts.map((p) => Bun.file(`styles/${p}`).text()))
).join("\n");
await Bun.write(CSS_OUT, css);

const jsSize = (await Bun.file(`${JS_DIR}/client.js`).text()).length;
process.stdout.write(
  `client: ${(jsSize / 1024).toFixed(1)}kb, css: ${parts.length} parts\n`,
);
