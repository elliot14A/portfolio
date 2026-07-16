/**
 * Nerd Font glyphs, written as `\uXXXX` escapes.
 *
 * These live in the Unicode Private Use Area. Pasting the literal characters through
 * editors and tooling loses them silently — you ship empty strings and only find out from
 * a screenshot. Escapes survive any round-trip, so they are the only safe form here.
 *
 * Every codepoint below must exist in `public/fonts/NerdIcons.woff2`, which is subset from
 * exactly this list by `scripts/buildFonts.sh`. The site self-hosts that file; nothing
 * depends on the visitor having a Nerd Font installed.
 */

export const ICON = {
  markdown: "\ue73e",
  typescript: "\ue628",
  lua: "\ue620",
  nix: "\uf313",
  shell: "\uf489",
  json: "\ue60b",
  text: "\uf15c",
  folder: "\uf07b",
  folderOpen: "\uf07c",
  file: "\uf016",
  branch: "\ue0a0",
  chevron: "\uf105",
  user: "\uf007",
  cog: "\uf013",
  question: "\uf059",
  github: "\uf09b",
  mail: "\uf0e0",
} as const;

export const ICON_BY_EXT: Readonly<Record<string, string>> = {
  md: ICON.markdown,
  ts: ICON.typescript,
  lua: ICON.lua,
  nix: ICON.nix,
  sh: ICON.shell,
  json: ICON.json,
  txt: ICON.text,
};

export const iconForPath = (path: string): string =>
  ICON_BY_EXT[path.split(".").pop() ?? ""] ?? ICON.file;
