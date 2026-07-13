import { applyMotion, type Motion, type Pos } from "../vim/motions.ts";

/**
 * The imperative shell: reads the DOM, delegates every decision to the pure motion core,
 * writes the result back.
 *
 * Motions never touch the network. Only things that change *what is displayed* go to the
 * server, and those go through htmx.
 */

const SCROLLOFF = 8;

type BufferState = {
  el: HTMLElement;
  rows: HTMLElement[];
  lines: string[];
  pos: Pos;
};

const MOTION_KEYS: Readonly<Record<string, Motion>> = {
  h: "left",
  j: "down",
  k: "up",
  l: "right",
  ArrowLeft: "left",
  ArrowDown: "down",
  ArrowUp: "up",
  ArrowRight: "right",
  w: "wordForward",
  b: "wordBack",
  "0": "lineStart",
  "^": "firstNonBlank",
  $: "lineEnd",
  G: "bufferEnd",
};

let state: BufferState | undefined;
let pendingCount = "";
let pendingG = false;

const readBuffer = (): BufferState | undefined => {
  const el = document.getElementById("buffer");
  if (el === null) return undefined;
  const rows = [...el.querySelectorAll<HTMLElement>(".ln[data-n]")];
  return {
    el,
    rows,
    lines: rows.map((row) => row.querySelector(".txt")?.textContent ?? ""),
    pos: { line: 1, column: 1 },
  };
};

const windowHeight = (current: BufferState): number => {
  const row = current.rows[0]?.getBoundingClientRect().height ?? 24;
  return Math.max(1, Math.floor(current.el.clientHeight / row));
};

/** Hybrid number + relativenumber, applied only to rows near the cursor. */
const paintNumbers = (current: BufferState): void => {
  const { line } = current.pos;
  current.rows.forEach((row, index) => {
    const n = index + 1;
    const num = row.querySelector(".num");
    if (num === null) return;
    const distance = Math.abs(n - line);
    if (distance > 120) return;
    num.textContent = String(distance === 0 ? n : distance);
    row.classList.toggle("current", distance === 0);
  });
};

const paintCursor = (current: BufferState): void => {
  const cursor = current.el.querySelector<HTMLElement>(".cursor");
  if (cursor === null) return;
  cursor.style.setProperty("--row", String(current.pos.line - 1));
  cursor.style.setProperty("--col", String(current.pos.column - 1));
};

const paintStatus = (current: BufferState): void => {
  const position = document.querySelector(".sl-z");
  if (position !== null) {
    position.textContent = `${current.pos.line},${current.pos.column}`;
  }
  const progress = document.querySelector(".sl-y");
  if (progress !== null) {
    const total = current.lines.length;
    progress.textContent =
      total <= 1
        ? "All"
        : current.pos.line === 1
          ? "Top"
          : current.pos.line === total
            ? "Bot"
            : `${Math.floor(((current.pos.line - 1) / (total - 1)) * 100)}%`;
  }
};

/** `scrolloff = 8` — keep eight rows of context above and below the cursor. */
const keepInView = (current: BufferState): void => {
  const row = current.rows[current.pos.line - 1];
  if (row === undefined) return;
  const rowHeight = row.getBoundingClientRect().height || 24;
  const margin = SCROLLOFF * rowHeight;
  const view = current.el;
  const top = row.offsetTop;
  if (top - margin < view.scrollTop) {
    view.scrollTop = Math.max(0, top - margin);
  } else if (top + rowHeight + margin > view.scrollTop + view.clientHeight) {
    view.scrollTop = top + rowHeight + margin - view.clientHeight;
  }
};

const paint = (current: BufferState): void => {
  paintNumbers(current);
  paintCursor(current);
  paintStatus(current);
  keepInView(current);
};

const move = (motion: Motion, count: number): void => {
  if (state === undefined) return;
  state.pos = applyMotion(
    { lines: state.lines, height: windowHeight(state) },
    state.pos,
    motion,
    count,
  );
  paint(state);
};

const takeCount = (): number => {
  const count = pendingCount === "" ? 1 : Number.parseInt(pendingCount, 10);
  pendingCount = "";
  return count;
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (state === undefined) return;
  const target = event.target as HTMLElement | null;
  if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
  if (event.ctrlKey || event.metaKey || event.altKey) {
    if (event.ctrlKey && (event.key === "d" || event.key === "u")) {
      event.preventDefault();
      move(event.key === "d" ? "halfPageDown" : "halfPageUp", takeCount());
    }
    return;
  }

  const { key } = event;

  // `gg` — the only two-key sequence bound so far.
  if (pendingG) {
    pendingG = false;
    if (key === "g") {
      event.preventDefault();
      move("bufferStart", takeCount());
      return;
    }
  }
  if (key === "g") {
    pendingG = true;
    return;
  }

  // A leading 0 is the `0` motion; any other digit builds a count.
  if (/^[1-9]$/.test(key) || (key === "0" && pendingCount !== "")) {
    pendingCount += key;
    return;
  }

  const motion = MOTION_KEYS[key];
  if (motion !== undefined) {
    event.preventDefault();
    move(motion, takeCount());
  }
};

const attach = (): void => {
  state = readBuffer();
  if (state === undefined) return;
  paint(state);
};

document.body.classList.add("js");
document.addEventListener("keydown", onKeyDown);
document.addEventListener("DOMContentLoaded", attach);
document.body.addEventListener("htmx:afterSwap", attach);
attach();
