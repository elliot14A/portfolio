import { join } from "node:path";
import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";
import esbuild from "esbuild";

const ROOT = process.cwd();
const ENTRY = join(ROOT, "apps/server/src/index.ts");
const OUT_FILE = join(ROOT, "dist/worker.js");

const main = async (): Promise<void> => {
  await esbuild.build({
    entryPoints: [ENTRY],
    bundle: true,
    format: "esm",
    outfile: OUT_FILE,
    platform: "browser",
    conditions: ["workerd", "worker", "browser"],
    external: ["cloudflare:*", "/fonts/*"],
    plugins: [vanillaExtractPlugin({ processCss: false })],
    write: true,
  });

  console.log(`Worker bundle generated: dist/worker.js`);
};

await main();
