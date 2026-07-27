export type StartMenu = {
  selected: number;
  init(): void;
  onKey(event: KeyboardEvent): void;
};

const items = (): HTMLAnchorElement[] => [
  ...document.querySelectorAll<HTMLAnchorElement>(".alpha-item"),
];

export const startMenu = (): StartMenu => {
  const paint = (selected: number): void => {
    items().forEach((item, index) => {
      item.classList.toggle("selected", index === selected);
    });
  };

  return {
    selected: 0,

    init() {
      paint(0);
      document.addEventListener("keydown", (event) => this.onKey(event));
    },

    onKey(event) {
      const list = items();
      if (list.length === 0 || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      const { key } = event;

      if (key === "j" || key === "ArrowDown") {
        event.preventDefault();
        this.selected = (this.selected + 1) % list.length;
      } else if (key === "k" || key === "ArrowUp") {
        event.preventDefault();
        this.selected = (this.selected - 1 + list.length) % list.length;
      } else if (key === "Enter") {
        event.preventDefault();
        list[this.selected]?.click();
        return;
      } else {
        const index = list.findIndex((item) => item.dataset.key === key);
        if (index === -1) return;
        event.preventDefault();
        this.selected = index;
        list[index]?.click();
        return;
      }

      paint(this.selected);
      list[this.selected]?.focus({ preventScroll: true });
    },
  };
};
