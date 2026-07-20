import { CONTENT } from "@/content.generated";
import { findBuffer } from "@/core/content/content";
import type { ReadBuffer, ReadIndex, ReadTree } from "@/core/content/ports";

// The content index is a build artifact baked into the bundle, so these
// adapters are synchronous and never do I/O.
export const makeReadBuffer = (): ReadBuffer => (path) =>
  findBuffer(CONTENT, path);

export const makeReadTree = (): ReadTree => () => CONTENT.tree;

export const makeReadIndex = (): ReadIndex => () => CONTENT;
