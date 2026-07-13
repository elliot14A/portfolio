import type { TreeNode } from "@/core/content/content.ts";
import type { ReadTree } from "@/core/content/ports.ts";

export type ListTreeDeps = { readTree: ReadTree };
export type ListTree = () => ReadonlyArray<TreeNode>;

export const makeListTree =
  (deps: ListTreeDeps): ListTree =>
  () =>
    deps.readTree();
