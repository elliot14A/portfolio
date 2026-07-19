import type { AppResult } from "../error";
import type { Buffer, ContentIndex, TreeNode } from "./content";

export type ReadBuffer = (path: string) => AppResult<Buffer>;
export type ReadTree = () => ReadonlyArray<TreeNode>;
export type ReadIndex = () => ContentIndex;
