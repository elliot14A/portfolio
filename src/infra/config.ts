import { err, ok } from "neverthrow";
import * as v from "valibot";
import { type PfResult, validationError } from "@/core/error.ts";

const envSchema = v.object({
  GIT_BRANCH: v.optional(v.pipe(v.string(), v.minLength(1)), "main"),
});

export type Config = Readonly<{
  branch: string;
}>;

/** Parsed once at the composition root; nothing else reads `env`. */
export const readConfig = (env: unknown): PfResult<Config> => {
  const parsed = v.safeParse(envSchema, env ?? {});
  return parsed.success
    ? ok({ branch: parsed.output.GIT_BRANCH })
    : err(validationError("invalid environment", { meta: { issues: parsed.issues.length } }));
};
