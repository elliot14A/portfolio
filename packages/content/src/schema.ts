import { Schema } from "effect";

export const ContactLinksSchema = Schema.Struct({
  email: Schema.NonEmptyString,
  github: Schema.NonEmptyString,
  linkedin: Schema.NonEmptyString,
  resume: Schema.optional(Schema.NonEmptyString),
});
export type ContactLinks = typeof ContactLinksSchema.Type;

export const ToolboxItemSchema = Schema.Struct({
  category: Schema.NonEmptyString,
  items: Schema.Array(Schema.NonEmptyString),
});
export type ToolboxItem = typeof ToolboxItemSchema.Type;

export const RoleExperienceSchema = Schema.Struct({
  role: Schema.NonEmptyString,
  company: Schema.NonEmptyString,
  period: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
  bullets: Schema.Array(Schema.NonEmptyString),
});
export type RoleExperience = typeof RoleExperienceSchema.Type;

export const PersonalProjectSchema = Schema.Struct({
  name: Schema.NonEmptyString,
  repoUrl: Schema.NonEmptyString,
  liveUrl: Schema.optional(Schema.NonEmptyString),
  writeupSlug: Schema.optional(Schema.NonEmptyString),
  description: Schema.NonEmptyString,
  highlights: Schema.Array(Schema.NonEmptyString),
  techStack: Schema.Array(Schema.NonEmptyString),
});
export type PersonalProject = typeof PersonalProjectSchema.Type;

export const SystemProjectSchema = Schema.Struct({
  slug: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  role: Schema.NonEmptyString,
  company: Schema.NonEmptyString,
  period: Schema.NonEmptyString,
  tagline: Schema.NonEmptyString,
  summary: Schema.NonEmptyString,
  liveUrl: Schema.optional(Schema.NonEmptyString),
  repoUrl: Schema.optional(Schema.NonEmptyString),
  highlights: Schema.Array(Schema.NonEmptyString),
  techStack: Schema.Array(Schema.NonEmptyString),
  overview: Schema.Array(Schema.NonEmptyString),
  whatIBuilt: Schema.Array(Schema.NonEmptyString),
});
export type SystemProject = typeof SystemProjectSchema.Type;

export const ProfileSchema = Schema.Struct({
  name: Schema.NonEmptyString,
  handle: Schema.NonEmptyString,
  roleBadges: Schema.Array(Schema.NonEmptyString),
  location: Schema.NonEmptyString,
  links: ContactLinksSchema,
  bio: Schema.Array(Schema.NonEmptyString),
  photoUrl: Schema.NonEmptyString,
  toolbox: Schema.Array(ToolboxItemSchema),
  experience: Schema.Array(RoleExperienceSchema),
  personalProjects: Schema.Array(PersonalProjectSchema),
});
export type Profile = typeof ProfileSchema.Type;

// Compatibility aliases
export type SelectedWorkItem = {
  readonly number?: string;
  readonly title: string;
  readonly company: string;
  readonly period: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly slug: string;
};

export type ExperienceItem = {
  readonly period: string;
  readonly company: string;
  readonly role: string;
};

export type ProjectDoc = {
  readonly slug: string;
  readonly title: string;
  readonly content: string;
};
