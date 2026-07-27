import { type Command, parseCommand } from "../vim/commands";
import { resolveLeader, type WhichKeyEntry } from "../vim/keymap";
import type { Motion } from "../vim/motions";
import { attachBuffer, type Buffer } from "./buffer";

type Htmx = {
  ajax: (verb: string, url: string, opts: object) => Promise<void>;
};
const htmx = (): Htmx | undefined =>
  (window as unknown as { htmx?: Htmx }).htmx;

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

type WhichKey = { prefix: string; entries: ReadonlyArray<WhichKeyEntry> };

export type Editor = {
  mode: "normal" | "command";
  cmd: string;
  cmdPrefix: string;
  message: string;
  messageError: boolean;
  whichkey: WhichKey | null;
  telescopeOpen: boolean;
  telescopeTitle: string;
  telescopeQuery: string;
  telescopeSel: number;
  telescopeAll: TelItem[];
  previewHtml: string;
  init(): void;
  onKey(event: KeyboardEvent): void;
  openLeader(): void;
  pushLeader(key: string): void;
  closeWhichkey(): void;
  openCommand(prefix: string): void;
  exitCommand(): void;
  runCommand(): void;
  execute(command: Command): void;
  editPath(path: string): void;
  flash(message: string, error?: boolean): void;
  openTelescope(source: "files" | "buffers"): void;
  closeTelescope(): void;
  telescopeItems(): TelItem[];
  telescopeMove(delta: number): void;
  telescopeConfirm(path?: string): void;
  loadPreview(): void;
};

type TelItem = { path: string; icon: string };

const iconFrom = (el: HTMLElement, selector: string): string =>
  el.querySelector(selector)?.textContent ?? "";

const treeFiles = (): TelItem[] =>
  [...document.querySelectorAll<HTMLElement>(".tree-file[data-path]")].map(
    (el) => ({ path: el.dataset.path ?? "", icon: iconFrom(el, ".tree-icon") }),
  );

const tabItems = (): TelItem[] =>
  [...document.querySelectorAll<HTMLElement>(".tab[data-path]")].map((el) => ({
    path: el.dataset.path ?? "",
    icon: iconFrom(el, ".tab-icon"),
  }));

const matches = (query: string, path: string): boolean => {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  const s = path.toLowerCase();
  let at = 0;
  for (const char of s) {
    if (char === q[at]) at += 1;
    if (at === q.length) return true;
  }
  return false;
};

const activePath = (): string | null =>
  document.getElementById("buffer")?.dataset.path ?? null;

const knownPaths = (): string[] => [
  ...new Set(
    [...document.querySelectorAll<HTMLElement>("[data-path]")]
      .map((el) => el.dataset.path ?? "")
      .filter((path) => path !== "" && path !== "alpha"),
  ),
];

const tabPaths = (): string[] =>
  [...document.querySelectorAll<HTMLElement>(".tab[data-path]")].map(
    (tab) => tab.dataset.path ?? "",
  );

const setStatusMode = (mode: string): void => {
  const chip = document.querySelector<HTMLElement>(".sl-a");
  if (chip === null) return;
  chip.textContent = mode.toUpperCase();
  chip.dataset.mode = mode;
};

const focusSoon = (id: string, tries = 12): void => {
  const el = document.getElementById(id);
  if (el === null) return;
  el.focus();
  if (document.activeElement !== el && tries > 0) {
    requestAnimationFrame(() => focusSoon(id, tries - 1));
  }
};

export const editor = (): Editor => {
  let buffer: Buffer | null = null;
  let alternate: string | null = null;
  let leaderKeys: string[] = [];
  let pendingCount = "";
  let pendingG = false;
  let previewToken = 0;

  const takeCount = (): number => {
    const count = pendingCount === "" ? 1 : Number.parseInt(pendingCount, 10);
    pendingCount = "";
    return count;
  };

  return {
    mode: "normal",
    cmd: "",
    cmdPrefix: ":",
    message: "",
    messageError: false,
    whichkey: null,
    telescopeOpen: false,
    telescopeTitle: "Find Files",
    telescopeQuery: "",
    telescopeSel: 0,
    telescopeAll: [],
    previewHtml: "",

    init() {
      buffer = attachBuffer();

      document.addEventListener("keydown", (event) => this.onKey(event));
      document.body.addEventListener("htmx:afterSwap", () => {
        buffer = attachBuffer();
        this.exitCommand();
        this.closeWhichkey();
        this.closeTelescope();
        this.flash("");

        const path = activePath();
        for (const row of document.querySelectorAll<HTMLElement>(
          ".tree-file",
        )) {
          row.classList.toggle("active", row.dataset.path === path);
        }
      });
    },

    flash(message, error = false) {
      this.message = message;
      this.messageError = error;
    },

    onKey(event) {
      if (this.telescopeOpen) {
        const key = event.key;
        if (key === "Escape") {
          event.preventDefault();
          this.closeTelescope();
        } else if (key === "Enter") {
          event.preventDefault();
          this.telescopeConfirm();
        } else if (
          key === "ArrowDown" ||
          (event.ctrlKey && (key === "n" || key === "j"))
        ) {
          event.preventDefault();
          this.telescopeMove(1);
        } else if (
          key === "ArrowUp" ||
          (event.ctrlKey && (key === "p" || key === "k"))
        ) {
          event.preventDefault();
          this.telescopeMove(-1);
        }
        return;
      }

      if (this.mode === "command") {
        if (event.key === "Enter") {
          event.preventDefault();
          this.runCommand();
        } else if (event.key === "Escape") {
          event.preventDefault();
          this.exitCommand();
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      const { key } = event;

      if (this.whichkey !== null) {
        if (key === "Escape") {
          event.preventDefault();
          this.closeWhichkey();
        } else if (!["Shift", "Control", "Alt", "Meta"].includes(key)) {
          event.preventDefault();
          this.pushLeader(key);
        }
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        if (event.ctrlKey && (key === "d" || key === "u")) {
          event.preventDefault();
          buffer?.move(
            key === "d" ? "halfPageDown" : "halfPageUp",
            takeCount(),
          );
        }
        return;
      }

      if (key === ":" || key === "/") {
        event.preventDefault();
        this.openCommand(key);
        return;
      }
      if (key === " ") {
        event.preventDefault();
        this.openLeader();
        return;
      }
      if (key === "Escape") {
        buffer?.clearSearch();
        this.flash("");
        return;
      }
      if (key === "L") {
        event.preventDefault();
        this.execute({ kind: "bufferNext" });
        return;
      }
      if (key === "H") {
        event.preventDefault();
        this.execute({ kind: "bufferPrev" });
        return;
      }

      if (pendingG) {
        pendingG = false;
        if (key === "g") {
          event.preventDefault();
          buffer?.move("bufferStart", takeCount());
          return;
        }
      }
      if (key === "g") {
        pendingG = true;
        return;
      }

      if (/^[1-9]$/.test(key) || (key === "0" && pendingCount !== "")) {
        pendingCount += key;
        return;
      }

      const motion = MOTION_KEYS[key];
      if (motion !== undefined && buffer !== null) {
        event.preventDefault();
        buffer.move(motion, takeCount());
      }
    },

    openLeader() {
      leaderKeys = [];
      const result = resolveLeader(leaderKeys);
      if (result.kind === "pending") {
        this.whichkey = { prefix: result.prefix, entries: result.entries };
      }
    },

    pushLeader(key) {
      leaderKeys = [...leaderKeys, key];
      const result = resolveLeader(leaderKeys);
      if (result.kind === "pending") {
        this.whichkey = { prefix: result.prefix, entries: result.entries };
      } else if (result.kind === "action") {
        this.closeWhichkey();
        this.execute(result.command);
      } else {
        this.closeWhichkey();
        this.flash(`no mapping for <leader>${leaderKeys.join("")}`);
      }
    },

    closeWhichkey() {
      leaderKeys = [];
      this.whichkey = null;
    },

    openCommand(prefix) {
      this.mode = "command";
      this.cmdPrefix = prefix;
      this.cmd = "";
      this.flash("");
      setStatusMode("command");
      focusSoon("cmd-input");
    },

    exitCommand() {
      if (this.mode !== "command") return;
      this.mode = "normal";
      this.cmd = "";
      setStatusMode("normal");
    },

    runCommand() {
      const text = this.cmd;
      const prefix = this.cmdPrefix;
      this.exitCommand();
      if (prefix === "/") {
        if (text !== "" && buffer !== null && !buffer.search(text)) {
          this.flash(`E486: Pattern not found: ${text}`, true);
        }
      } else {
        this.execute(parseCommand(text));
      }
    },

    execute(command) {
      switch (command.kind) {
        case "edit":
          this.editPath(command.path);
          return;
        case "bufferNext":
        case "bufferPrev": {
          const tabs = tabPaths();
          const current = activePath();
          if (current === null || tabs.length === 0) return;
          const delta = command.kind === "bufferNext" ? 1 : -1;
          const next =
            tabs[(tabs.indexOf(current) + delta + tabs.length) % tabs.length];
          if (next !== undefined && next !== current) this.editPath(next);
          return;
        }
        case "bufferIndex": {
          const path = knownPaths()[command.index - 1];
          if (path !== undefined) this.editPath(path);
          return;
        }
        case "alternate":
          if (alternate !== null) this.editPath(alternate);
          else this.flash("E23: No alternate file", true);
          return;
        case "close":
          if (alternate !== null) this.editPath(alternate);
          else window.location.assign("/");
          return;
        case "quit":
        case "dashboard":
          window.location.assign("/");
          return;
        case "gotoLine":
          buffer?.gotoLine(command.line);
          return;
        case "toggleTree":
          document.querySelector(".neotree")?.classList.toggle("hidden");
          return;
        case "telescope":
          this.openTelescope(command.source);
          return;
        case "help":
          this.editPath("doc/help.txt");
          return;
        case "nohlsearch":
          buffer?.clearSearch();
          this.flash("");
          return;
        case "toggleTerm":
          this.flash("not implemented yet: terminal");
          return;
        case "unimplemented":
          this.flash(`not implemented yet: ${command.feature}`);
          return;
        case "unknown":
          this.flash(`E492: Not an editor command: ${command.input}`, true);
          return;
        case "noop":
          return;
      }
    },

    editPath(path) {
      const paths = knownPaths();
      if (paths.length > 0 && !paths.includes(path)) {
        this.flash(`E484: Can't open file ${path}`, true);
        return;
      }
      const current = activePath();
      if (current !== null) alternate = current;

      const url = `/b/${path}`;
      const client = htmx();
      if (client !== undefined && document.getElementById("tabline") !== null) {
        client
          .ajax("GET", url, { target: "#buffer", swap: "outerHTML" })
          .then(() => history.pushState({}, "", url));
      } else {
        window.location.assign(url);
      }
    },

    openTelescope(source) {
      this.telescopeAll = source === "buffers" ? tabItems() : treeFiles();
      this.telescopeTitle = source === "buffers" ? "Buffers" : "Find Files";
      this.telescopeQuery = "";
      this.telescopeSel = 0;
      this.previewHtml = "";
      this.telescopeOpen = true;
      this.loadPreview();
      focusSoon("tel-input");
    },

    closeTelescope() {
      this.telescopeOpen = false;
      this.telescopeQuery = "";
      this.previewHtml = "";
    },

    telescopeItems() {
      return this.telescopeAll.filter((item) =>
        matches(this.telescopeQuery, item.path),
      );
    },

    telescopeMove(delta) {
      const count = this.telescopeItems().length;
      if (count === 0) return;
      this.telescopeSel = (this.telescopeSel + delta + count) % count;
      this.loadPreview();
    },

    telescopeConfirm(path) {
      const items = this.telescopeItems();
      const pick =
        path ?? items[Math.min(this.telescopeSel, items.length - 1)]?.path;
      this.closeTelescope();
      if (pick !== undefined && pick !== "") this.editPath(pick);
    },

    loadPreview() {
      const items = this.telescopeItems();
      const pick = items[Math.min(this.telescopeSel, items.length - 1)];
      if (pick === undefined) {
        this.previewHtml = "";
        return;
      }
      previewToken += 1;
      const token = previewToken;
      fetch(`/preview/${pick.path}`)
        .then((res) => (res.ok ? res.text() : ""))
        .then((html) => {
          if (token === previewToken) this.previewHtml = html;
        })
        .catch(() => {});
    },
  };
};
