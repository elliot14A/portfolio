/**
 * Key handling for the alpha start screen.
 *
 * Separate from the buffer bindings because alpha is not a buffer: there are no motions
 * here, just a menu. `j`/`k` walk it, Enter follows, and each entry's own letter jumps
 * straight to it — the same as the dashboard plugins.
 */

let items: HTMLAnchorElement[] = [];
let selected = 0;

const paint = (): void => {
  items.forEach((item, index) => {
    item.classList.toggle("selected", index === selected);
  });
};

const select = (next: number): void => {
  if (items.length === 0) return;
  selected = (next + items.length) % items.length;
  paint();
  items[selected]?.focus({ preventScroll: true });
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (items.length === 0) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const { key } = event;

  if (key === "j" || key === "ArrowDown") {
    event.preventDefault();
    select(selected + 1);
    return;
  }
  if (key === "k" || key === "ArrowUp") {
    event.preventDefault();
    select(selected - 1);
    return;
  }
  if (key === "Enter") {
    event.preventDefault();
    items[selected]?.click();
    return;
  }

  const shortcut = items.findIndex((item) => item.dataset.key === key);
  if (shortcut !== -1) {
    event.preventDefault();
    selected = shortcut;
    paint();
    items[shortcut]?.click();
  }
};

/** Returns true when this screen is alpha, so the buffer bindings can stand down. */
export const attachAlpha = (): boolean => {
  const root = document.querySelector(".alpha");
  if (root === null) {
    items = [];
    return false;
  }
  items = [...root.querySelectorAll<HTMLAnchorElement>(".alpha-item")];
  selected = 0;
  paint();
  return true;
};

document.addEventListener("keydown", onKeyDown);
