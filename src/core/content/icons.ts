// Nerd Font glyphs as \uXXXX escapes. They live in the Private Use Area;
// pasted literals get stripped silently by tooling, so escapes are the only
// safe form. Every codepoint must also be in public/fonts/NerdIcons.woff2,
// which scripts/buildFonts.sh subsets from exactly this list.
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
