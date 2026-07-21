import type { TreeNode } from "@/core/content/content";
import { ICON } from "@/core/content/icons";

export type NeoTreeProps = Readonly<{
  nodes: ReadonlyArray<TreeNode>;
  active: string;
}>;

const parentOf = (path: string): string =>
  path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";

// neo-tree, on the right at width 30, matching editor.nix. The `tree` Alpine
// component makes directories collapsible.
export function NeoTree(props: NeoTreeProps) {
  return (
    <aside
      id="neotree"
      class="neotree"
      x-data="tree"
      aria-label="File explorer"
    >
      <a class="tree-title" href="/" title="Back to the start screen">
        portfolio
      </a>
      {props.nodes.map((node) =>
        node.kind === "directory" ? (
          <div
            class="tree-row tree-dir"
            style={`--depth:${node.depth}`}
            data-path={node.path}
            data-parent={parentOf(node.path)}
            data-dir="1"
            x-on:click="toggle($el.dataset.path)"
          >
            <span class="tree-chevron">{ICON.chevron}</span>
            <span class="tree-icon">{node.icon}</span>
            <span class="tree-name">{node.name}</span>
          </div>
        ) : (
          <a
            class={
              node.path === props.active
                ? "tree-row tree-file active"
                : "tree-row tree-file"
            }
            style={`--depth:${node.depth}`}
            href={`/b/${node.path}`}
            hx-get={`/b/${node.path}`}
            hx-target="#buffer"
            hx-swap="outerHTML"
            hx-push-url="true"
            data-path={node.path}
            data-parent={parentOf(node.path)}
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
