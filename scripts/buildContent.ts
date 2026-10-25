#!/usr/bin/env bun
import { Effect, Schema } from "effect";
import { PROFILE, ProfileSchema } from "../packages/content/src";

const runValidation = Effect.gen(function* () {
  yield* Schema.decodeUnknownEffect(ProfileSchema)(PROFILE);
  console.log(
    `Content validated successfully: ${PROFILE.experience.length} career roles, ${PROFILE.toolbox.length} toolbox categories.`,
  );
});

Effect.runPromise(runValidation).catch((err) => {
  console.error("Content validation failed:", err);
  process.exit(1);
});
