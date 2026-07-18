export type Config = Readonly<{
  branch: string;
}>;

// Read once at the composition root; nothing else touches env. The branch is
// cosmetic (shown in the statusline), so a missing value falls back rather
// than failing the request.
export const readConfig = (env: unknown): Config => {
  const branch =
    typeof env === "object" &&
    env !== null &&
    "GIT_BRANCH" in env &&
    typeof env.GIT_BRANCH === "string" &&
    env.GIT_BRANCH !== ""
      ? env.GIT_BRANCH
      : "main";
  return { branch };
};
