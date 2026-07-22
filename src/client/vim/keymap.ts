import type { Command } from "./commands";

// The which-key tree for the leader (<Space>) key, transcribed from
// keymaps.nix / editor.nix / lsp.nix. Leaves resolve to a Command; groups
// nest. Bindings whose plugins are not built yet resolve to `unimplemented` so
// the popup still lists them honestly.
type Leaf = { label: string; command: Command };
type Group = { label: string; children: Record<string, Node> };
type Node = Leaf | Group;

const isGroup = (node: Node): node is Group => "children" in node;

const todo = (feature: string): Command => ({ kind: "unimplemented", feature });

const LEADER: Record<string, Node> = {
  e: { label: "Toggle file explorer", command: { kind: "toggleTree" } },
  "`": { label: "Switch to other buffer", command: { kind: "alternate" } },
  j: { label: "Lsp diagnostic goto_next", command: todo("lsp diagnostics") },
  k: { label: "Lsp diagnostic goto_prev", command: todo("lsp diagnostics") },
  "-": { label: "Horizontal split", command: todo("splits") },
  "|": { label: "Vertical split", command: todo("splits") },
  b: {
    label: "Buffer",
    children: {
      b: { label: "Switch to other buffer", command: { kind: "alternate" } },
      d: { label: "Delete buffer", command: { kind: "close" } },
    },
  },
  f: {
    label: "Find",
    children: {
      f: {
        label: "Find files",
        command: { kind: "telescope", source: "files" },
      },
      b: {
        label: "Find buffers",
        command: { kind: "telescope", source: "buffers" },
      },
      g: { label: "Live grep", command: todo("telescope live_grep") },
      w: { label: "Grep word", command: todo("telescope grep_string") },
    },
  },
  l: {
    label: "LSP",
    children: {
      a: { label: "Code action", command: todo("lsp code_action") },
      r: { label: "Rename", command: todo("lsp rename") },
      d: { label: "Diagnostics float", command: todo("lsp diagnostics") },
    },
  },
  t: {
    label: "Terminal",
    children: {
      h: { label: "Horizontal terminal", command: todo("terminal") },
      v: { label: "Vertical terminal", command: todo("terminal") },
    },
  },
};

export type WhichKeyEntry = {
  key: string;
  label: string;
  group: boolean;
};

export type WhichKey =
  | { kind: "pending"; prefix: string; entries: ReadonlyArray<WhichKeyEntry> }
  | { kind: "action"; command: Command }
  | { kind: "unmapped" };

const entriesOf = (nodes: Record<string, Node>): WhichKeyEntry[] =>
  Object.entries(nodes)
    .map(([key, node]) => ({ key, label: node.label, group: isGroup(node) }))
    .sort((a, b) => a.key.localeCompare(b.key));

// Walk the leader tree by the keys pressed so far.
export const resolveLeader = (keys: ReadonlyArray<string>): WhichKey => {
  let level: Record<string, Node> = LEADER;
  const prefix: string[] = [];

  for (const key of keys) {
    const node = level[key];
    if (node === undefined) return { kind: "unmapped" };
    prefix.push(key);
    if (isGroup(node)) {
      level = node.children;
    } else {
      return { kind: "action", command: node.command };
    }
  }

  return {
    kind: "pending",
    prefix: prefix.join(""),
    entries: entriesOf(level),
  };
};
