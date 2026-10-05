export const normalizeSlug = (input: string): string => {
  const cleaned = input.trim().replace(/\/+$/, "");
  if (!cleaned) return "";
  return cleaned
    .replace(/^.*[\\/]/, "")
    .replace(/\.[a-zA-Z0-9]+$/, "")
    .toLowerCase();
};
