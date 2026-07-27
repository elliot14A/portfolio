import { CONTENT } from "@/content.generated";
import { findBuffer } from "@/core/content/content";
import type { ReadBuffer, ReadIndex, ReadTree } from "@/core/content/ports";

export const makeReadBuffer = (): ReadBuffer => (path) =>
  findBuffer(CONTENT, path);

export const makeReadTree = (): ReadTree => () => CONTENT.tree;

export const makeReadIndex = (): ReadIndex => () => CONTENT;
