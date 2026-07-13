import type { PfResult } from "../error.ts";
import type { Buffer, ContentIndex, TreeNode } from "./content.ts";

export type ReadBuffer = (path: string) => PfResult<Buffer>;
export type ReadTree = () => ReadonlyArray<TreeNode>;
export type ReadIndex = () => ContentIndex;
