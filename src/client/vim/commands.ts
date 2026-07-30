export type Command =
  | { kind: "edit"; path: string }
  | { kind: "bufferNext" }
  | { kind: "bufferPrev" }
  | { kind: "bufferIndex"; index: number }
  | { kind: "alternate" }
  | { kind: "close" }
  | { kind: "quit" }
  | { kind: "gotoLine"; line: number }
  | { kind: "toggleTree" }
  | { kind: "telescope"; source: "files" | "buffers" }
  | { kind: "dashboard" }
  | { kind: "help" }
  | { kind: "nohlsearch" }
  | { kind: "toggleTerm" }
  | { kind: "chat"; text: string }
  | { kind: "noop" }
  | { kind: "unimplemented"; feature: string }
  | { kind: "unknown"; input: string };

export const parseCommand = (raw: string): Command => {
  const input = raw.trim();
  if (input === "") return { kind: "noop" };

  if (/^\d+$/.test(input)) return { kind: "gotoLine", line: Number(input) };

  const [head = "", ...rest] = input.split(/\s+/);
  const arg = rest.join(" ").trim();

  const bufferNumber = /^b(?:uffer)?(\d+)$/.exec(head);
  if (bufferNumber) {
    return { kind: "bufferIndex", index: Number(bufferNumber[1]) };
  }

  switch (head) {
    case "e":
    case "edit":
      if (arg === "#") return { kind: "alternate" };
      return arg === ""
        ? { kind: "unknown", input }
        : { kind: "edit", path: arg };
    case "b":
    case "buffer":
      return /^\d+$/.test(arg)
        ? { kind: "bufferIndex", index: Number(arg) }
        : { kind: "unknown", input };
    case "bn":
    case "bnext":
      return { kind: "bufferNext" };
    case "bp":
    case "bprev":
    case "bprevious":
      return { kind: "bufferPrev" };
    case "bd":
    case "bdelete":
    case "q":
    case "quit":
      return { kind: "close" };
    case "qa":
    case "qall":
      return { kind: "quit" };
    case "noh":
    case "nohlsearch":
      return { kind: "nohlsearch" };
    case "help":
    case "h":
      return { kind: "help" };
    case "Neotree":
    case "tree":
      return { kind: "toggleTree" };
    case "Alpha":
    case "alpha":
    case "Dashboard":
      return { kind: "dashboard" };
    case "term":
    case "terminal":
      return { kind: "toggleTerm" };
    case "chat":
    case "ask":
    case "ai":
      return { kind: "chat", text: arg };
    default:
      return { kind: "unknown", input };
  }
};
