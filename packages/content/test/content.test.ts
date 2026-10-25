import { describe, expect, it } from "bun:test";
import { Schema } from "effect";
import { PROFILE, ProfileSchema } from "../src";

describe("Content Validation", () => {
  it("validates profile schema successfully", () => {
    const profile = Schema.decodeUnknownSync(ProfileSchema)(PROFILE);
    expect(profile.name).toBe("Akshith Katkuri");
    expect(profile.experience.length).toBeGreaterThan(0);
  });
});
