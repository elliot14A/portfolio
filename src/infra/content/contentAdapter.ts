import { CONTENT } from "@/content.generated.ts";
import { findBuffer } from "@/core/content/content.ts";
import type { ReadBuffer, ReadIndex, ReadTree } from "@/core/content/ports.ts";

/**
 * The content index is a build artifact baked into the bundle, so these adapters are
 * synchronous and allocation-free — there is no I/O to fail at.
 */
export const makeReadBuffer = (): ReadBuffer => (path) => findBuffer(CONTENT, path);

export const makeReadTree = (): ReadTree => () => CONTENT.tree;

export const makeReadIndex = (): ReadIndex => () => CONTENT;
