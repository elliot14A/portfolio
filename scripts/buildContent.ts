#!/usr/bin/env bun
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Effect, Schema } from "effect";
import {
  type ContactLinks,
  ExperienceItemSchema,
  type Profile,
  ProfileSchema,
  type ProjectDoc,
  ProjectDocSchema,
  type SelectedWorkItem,
  SelectedWorkItemSchema,
} from "../packages/content/src/schema";

const ROOT = process.cwd();
const CONTENT_DIR = join(ROOT, "packages/content");
const PROFILE_PATH = join(CONTENT_DIR, "profile.md");
const PROJECTS_DIR = join(CONTENT_DIR, "projects");
const OUT_FILE = join(CONTENT_DIR, "src/generated.ts");

const parseProfile = (
  raw: string,
): {
  profile: Profile;
  selectedWork: readonly SelectedWorkItem[];
  experience: readonly ExperienceItemSchema["Type"][];
} => {
  const sections = raw.split(/^##\s+/m);
  const heroSection = sections[0] ?? "";
  const workSection = sections.find((s) => s.startsWith("selected work")) ?? "";
  const aboutSection = sections.find((s) => s.startsWith("about")) ?? "";
  const expSection = sections.find((s) => s.startsWith("experience")) ?? "";

  const heroLines = heroSection.split("\n");
  let name = "";
  let role = "";
  let location = "";
  const links: ContactLinks = {
    email: "",
    github: "",
    linkedin: "",
  };
  const bioLines: string[] = [];
  let inLinks = false;

  for (const line of heroLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ")) {
      name = trimmed.slice(2).trim();
      continue;
    }
    if (trimmed.startsWith("role:")) {
      role = trimmed.slice("role:".length).trim();
      continue;
    }
    if (trimmed.startsWith("location:")) {
      location = trimmed.slice("location:".length).trim();
      continue;
    }
    if (trimmed.startsWith("links:")) {
      inLinks = true;
      continue;
    }
    if (inLinks) {
      if (trimmed.startsWith("email:")) {
        links.email = trimmed.slice("email:".length).trim();
        continue;
      }
      if (trimmed.startsWith("github:")) {
        links.github = trimmed.slice("github:".length).trim();
        continue;
      }
      if (trimmed.startsWith("linkedin:")) {
        links.linkedin = trimmed.slice("linkedin:".length).trim();
        continue;
      }
      if (trimmed.length > 0 && !trimmed.startsWith("-") && !line.startsWith(" ")) {
        inLinks = false;
      }
    }
    if (!inLinks && trimmed.length > 0) {
      bioLines.push(trimmed);
    }
  }

  const about = aboutSection.replace(/^about\s*/, "").trim();

  const workBlocks = workSection
    .replace(/^selected work\s*/, "")
    .trim()
    .split(/\n\n+/);

  const selectedWork: SelectedWorkItem[] = [];

  for (const block of workBlocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 3) continue;

    const headerMatch = lines[0]?.match(/^(\d+)\s+([^|]+)\|\s*(.+?)\s*[·•-]\s*(.+)$/);
    if (!headerMatch) continue;

    const number = headerMatch[1]?.trim() ?? "";
    const title = headerMatch[2]?.trim() ?? "";
    const company = headerMatch[3]?.trim() ?? "";
    const period = headerMatch[4]?.trim() ?? "";
    const summary = lines[1] ?? "";

    const highlightsLine = lines[2] ?? "";
    const highlights = [...highlightsLine.matchAll(/\[(.*?)\]/g)].map((m) => m[1]?.trim() ?? "");

    let slug = "";
    const slugLine = lines.find((l) => l.startsWith("slug:"));
    if (slugLine) {
      slug = slugLine.slice("slug:".length).trim();
    }

    selectedWork.push({
      number,
      title,
      company,
      period,
      summary,
      highlights,
      slug,
    });
  }

  const expLines = expSection
    .replace(/^experience\s*/, "")
    .trim()
    .split("\n");

  const experience: ExperienceItemSchema["Type"][] = [];

  for (const line of expLines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("-")) continue;
    const match = trimmed.match(/^-\s+(.+?)\s{2,}(.+?)\s*[·•-]\s*(.+)$/);
    if (match) {
      experience.push({
        period: match[1]?.trim() ?? "",
        company: match[2]?.trim() ?? "",
        role: match[3]?.trim() ?? "",
      });
    }
  }

  return {
    profile: {
      name,
      role,
      location,
      links,
      bio: bioLines,
      about,
    },
    selectedWork,
    experience,
  };
};

const runBuild = Effect.gen(function* () {
  const profileRaw = yield* Effect.tryPromise({
    try: () => readFile(PROFILE_PATH, "utf-8"),
    catch: (cause) => new Error(`Failed to read profile.md: ${String(cause)}`),
  });

  const parsed = parseProfile(profileRaw);

  const validatedProfile = yield* Schema.decodeUnknownEffect(ProfileSchema)(parsed.profile);
  const validatedWork = yield* Schema.decodeUnknownEffect(Schema.Array(SelectedWorkItemSchema))(
    parsed.selectedWork,
  );
  const validatedExperience = yield* Schema.decodeUnknownEffect(Schema.Array(ExperienceItemSchema))(
    parsed.experience,
  );

  const rawFiles = yield* Effect.tryPromise({
    try: () => readdir(PROJECTS_DIR),
    catch: (cause) => new Error(`Failed to read projects directory: ${String(cause)}`),
  });

  const projectFiles = rawFiles.filter((file) => file.endsWith(".md")).sort();
  const projectsBySlug: Record<string, ProjectDoc> = {};
  const contextParts: string[] = [`# PROFILE\n\n${profileRaw.trim()}`];

  for (const file of projectFiles) {
    const slug = file.replace(/\.md$/, "");
    const raw = yield* Effect.tryPromise({
      try: () => readFile(join(PROJECTS_DIR, file), "utf-8"),
      catch: (cause) => new Error(`Failed to read project file ${file}: ${String(cause)}`),
    });

    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title = titleMatch ? (titleMatch[1]?.trim() ?? slug) : slug;

    const validatedDoc = yield* Schema.decodeUnknownEffect(ProjectDocSchema)({
      slug,
      title,
      content: raw,
    });

    projectsBySlug[slug] = validatedDoc;
    contextParts.push(`# PROJECT: ${slug}\n\n${raw.trim()}`);
  }

  const agentContext = contextParts.join("\n\n---\n\n");

  const code = `// Generated by scripts/buildContent.ts. Do not edit directly.
// Source: packages/content/profile.md and packages/content/projects/*.md
import type {
  ExperienceItem,
  Profile,
  ProjectDoc,
  SelectedWorkItem,
} from "./schema";

export const PROFILE: Profile = ${JSON.stringify(validatedProfile, null, 2)};

export const SELECTED_WORK: readonly SelectedWorkItem[] = ${JSON.stringify(validatedWork, null, 2)};

export const EXPERIENCE: readonly ExperienceItem[] = ${JSON.stringify(
    validatedExperience,
    null,
    2,
  )};

export const PROJECTS_BY_SLUG: Readonly<Record<string, ProjectDoc>> = ${JSON.stringify(
    projectsBySlug,
    null,
    2,
  )};

export const AGENT_CONTEXT = ${JSON.stringify(agentContext)};
`;

  yield* Effect.tryPromise({
    try: () => writeFile(OUT_FILE, code, "utf-8"),
    catch: (cause) => new Error(`Failed to write generated.ts: ${String(cause)}`),
  });

  yield* Effect.tryPromise({
    try: async () => {
      const proc = Bun.spawn(["bun", "x", "biome", "format", "--write", OUT_FILE], {
        stdout: "ignore",
        stderr: "ignore",
      });
      await proc.exited;
    },
    catch: (cause) => new Error(`Failed to format with Biome: ${String(cause)}`),
  });

  console.log(
    `Content generated & validated: ${validatedWork.length} work items, ${validatedExperience.length} career nodes, ${projectFiles.length} projects.`,
  );
});

Effect.runPromise(runBuild).catch((err) => {
  console.error("Build content failed validation:", err);
  process.exit(1);
});
