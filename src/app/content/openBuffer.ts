import type { Buffer } from "@/core/content/content";
import type { ReadBuffer } from "@/core/content/ports";
import type { AppResult } from "@/core/error";

export type OpenBufferDeps = { readBuffer: ReadBuffer };
export type OpenBuffer = (path: string) => AppResult<Buffer>;

export const makeOpenBuffer =
  (deps: OpenBufferDeps): OpenBuffer =>
  (path) =>
    deps.readBuffer(path);
