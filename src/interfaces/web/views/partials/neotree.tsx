import type { TreeNode } from "@/core/content/content.ts";
import { ICON } from "@/core/content/icons.ts";

export type NeoTreeProps = Readonly<{
  nodes: ReadonlyArray<TreeNode>;
  active: string;
}>;

/** neo-tree: right-hand side, width 30, dotfiles visible, follows the current file. */
export function NeoTree(props: NeoTreeProps) {
  return (
    <aside id="neotree" class="neotree" aria-label="File explorer">
      <div class="tree-title">portfolio</div>
      {props.nodes.map((node) =>
        node.kind === "directory" ? (
          <div class="tree-row tree-dir" style={`--depth:${node.depth}`}>
            <span class="tree-chevron">{ICON.chevron}</span>
            <span class="tree-icon">{node.icon}</span>
            <span class="tree-name">{node.name}</span>
          </div>
        ) : (
          <a
            class={node.path === props.active ? "tree-row tree-file active" : "tree-row tree-file"}
            style={`--depth:${node.depth}`}
            href={`/b/${node.path}`}
            hx-get={`/b/${node.path}`}
            hx-target="#buffer"
            hx-swap="outerHTML"
            hx-push-url="true"
            data-path={node.path}
          >
            <span class="tree-chevron" />
            <span class="tree-icon">{node.icon}</span>
            <span class="tree-name">{node.name}</span>
          </a>
        ),
      )}
    </aside>
  );
}
