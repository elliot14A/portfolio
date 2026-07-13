import type { Buffer } from "@/core/content/content.ts";
import type { ReadBuffer } from "@/core/content/ports.ts";
import type { PfResult } from "@/core/error.ts";

export type OpenBufferDeps = { readBuffer: ReadBuffer };
export type OpenBuffer = (path: string) => PfResult<Buffer>;

export const makeOpenBuffer =
  (deps: OpenBufferDeps): OpenBuffer =>
  (path) =>
    deps.readBuffer(path);
