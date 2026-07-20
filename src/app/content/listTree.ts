import type { TreeNode } from "@/core/content/content";
import type { ReadTree } from "@/core/content/ports";

export type ListTreeDeps = { readTree: ReadTree };
export type ListTree = () => ReadonlyArray<TreeNode>;

export const makeListTree =
  (deps: ListTreeDeps): ListTree =>
  () =>
    deps.readTree();
