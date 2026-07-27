export type Config = Readonly<{
  branch: string;
}>;

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
