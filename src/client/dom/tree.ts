// The Alpine controller for the file tree: clicking a directory row collapses
// or expands it. Row visibility is applied imperatively (a flat server-rendered
// list, not Alpine's job), keyed off each row's data-parent chain.
export type Tree = {
  init(): void;
  toggle(path: string | undefined): void;
};

const rows = (): HTMLElement[] => [
  ...document.querySelectorAll<HTMLElement>("#neotree .tree-row"),
];

export const tree = (): Tree => {
  const collapsed = new Set<string>();

  const hiddenByAncestor = (parent: string): boolean => {
    let path = parent;
    while (path !== "") {
      if (collapsed.has(path)) return true;
      const cut = path.lastIndexOf("/");
      path = cut === -1 ? "" : path.slice(0, cut);
    }
    return false;
  };

  const refresh = (): void => {
    for (const row of rows()) {
      row.classList.toggle(
        "tree-hidden",
        hiddenByAncestor(row.dataset.parent ?? ""),
      );
      if (row.dataset.dir === "1") {
        row.classList.toggle(
          "tree-open",
          !collapsed.has(row.dataset.path ?? ""),
        );
      }
    }
  };

  return {
    init() {
      refresh();
    },
    toggle(path) {
      if (path === undefined) return;
      if (collapsed.has(path)) collapsed.delete(path);
      else collapsed.add(path);
      refresh();
    },
  };
};
