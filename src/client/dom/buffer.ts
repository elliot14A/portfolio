import { applyMotion, type Motion, type Pos } from "../vim/motions";

const SCROLLOFF = 8;

export type Buffer = Readonly<{
  move: (motion: Motion, count: number) => void;
  gotoLine: (line: number) => void;
  search: (term: string) => boolean;
  clearSearch: () => void;
}>;

type State = {
  el: HTMLElement;

  container: HTMLElement;
  rows: HTMLElement[];
  lines: string[];
  pos: Pos;
};

const windowHeight = (state: State): number => {
  const row = state.rows[0]?.getBoundingClientRect().height ?? 24;
  return Math.max(1, Math.floor(state.container.clientHeight / row));
};

const paintNumbers = (state: State): void => {
  const { line } = state.pos;
  state.rows.forEach((row, index) => {
    const n = index + 1;
    const num = row.querySelector(".num");
    if (num === null) return;
    const distance = Math.abs(n - line);
    if (distance > 120) return;
    num.textContent = String(distance === 0 ? n : distance);
    row.classList.toggle("current", distance === 0);
  });
};

const paintCursor = (state: State): void => {
  const cursor = state.el.querySelector<HTMLElement>(".cursor");
  if (cursor === null) return;
  cursor.style.setProperty("--row", String(state.pos.line - 1));
  cursor.style.setProperty("--col", String(state.pos.column - 1));
};

const paintStatus = (state: State): void => {
  const position = document.querySelector(".sl-z");
  if (position !== null) {
    position.textContent = `${state.pos.line},${state.pos.column}`;
  }
  const progress = document.querySelector(".sl-y");
  if (progress === null) return;
  const total = state.lines.length;
  progress.textContent =
    total <= 1
      ? "All"
      : state.pos.line === 1
        ? "Top"
        : state.pos.line === total
          ? "Bot"
          : `${Math.floor(((state.pos.line - 1) / (total - 1)) * 100)}%`;
};

const keepInView = (state: State): void => {
  const row = state.rows[state.pos.line - 1];
  if (row === undefined) return;
  const view = state.container;
  const rowRect = row.getBoundingClientRect();
  const viewRect = view.getBoundingClientRect();
  const rowTop = rowRect.top - viewRect.top + view.scrollTop;
  const rowHeight = rowRect.height || 24;
  const margin = SCROLLOFF * rowHeight;
  if (rowTop - margin < view.scrollTop) {
    view.scrollTop = Math.max(0, rowTop - margin);
  } else if (rowTop + rowHeight + margin > view.scrollTop + view.clientHeight) {
    view.scrollTop = rowTop + rowHeight + margin - view.clientHeight;
  }
};

const paint = (state: State): void => {
  paintNumbers(state);
  paintCursor(state);
  paintStatus(state);
  keepInView(state);
};

const highlight = (state: State, term: string): void => {
  const api = CSS as unknown as {
    highlights?: {
      set: (n: string, h: unknown) => void;
      delete: (n: string) => void;
    };
  };
  if (api.highlights === undefined || term === "") return;
  const ranges: Range[] = [];
  const lower = term.toLowerCase();
  for (const row of state.rows) {
    const node = row.querySelector(".txt")?.firstChild;
    const text = node?.textContent ?? "";
    let from = text.toLowerCase().indexOf(lower);
    while (from !== -1 && node !== null && node !== undefined) {
      const range = document.createRange();
      range.setStart(node, from);
      range.setEnd(node, from + term.length);
      ranges.push(range);
      from = text.toLowerCase().indexOf(lower, from + term.length);
    }
  }
  api.highlights.set(
    "hlsearch",
    new (
      window as unknown as { Highlight: new (...r: Range[]) => unknown }
    ).Highlight(...ranges),
  );
};

const clearHighlight = (): void => {
  const api = CSS as unknown as {
    highlights?: { delete: (n: string) => void };
  };
  api.highlights?.delete("hlsearch");
};

export const attachBuffer = (): Buffer | null => {
  const el = document.getElementById("buffer");
  if (el === null || el.classList.contains("alpha")) return null;

  const rows = [...el.querySelectorAll<HTMLElement>(".ln[data-n]")];
  const state: State = {
    el,
    container: el.closest<HTMLElement>(".win") ?? el,
    rows,
    lines: rows.map((row) => row.querySelector(".txt")?.textContent ?? ""),
    pos: { line: 1, column: 1 },
  };
  paint(state);

  return {
    move(motion, count) {
      state.pos = applyMotion(
        { lines: state.lines, height: windowHeight(state) },
        state.pos,
        motion,
        count,
      );
      paint(state);
    },
    gotoLine(line) {
      state.pos = applyMotion(
        { lines: state.lines, height: windowHeight(state) },
        { line, column: 1 },
        "firstNonBlank",
      );
      paint(state);
    },
    search(term) {
      const lower = term.toLowerCase();
      const from = state.pos.line;
      const after = state.lines.findIndex(
        (line, i) => i + 1 > from && line.toLowerCase().includes(lower),
      );
      const found =
        after !== -1
          ? after
          : state.lines.findIndex((line) => line.toLowerCase().includes(lower));
      if (found === -1) return false;
      state.pos = { line: found + 1, column: 1 };
      highlight(state, term);
      paint(state);
      return true;
    },
    clearSearch: clearHighlight,
  };
};
