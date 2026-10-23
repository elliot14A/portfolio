import { Schema } from "effect";

export const ProjectSchema = Schema.Struct({
  number: Schema.String,
  title: Schema.String,
  company: Schema.String,
  period: Schema.String,
  summary: Schema.String,
  metrics: Schema.Array(Schema.String),
  link: Schema.String,
});
export type Project = typeof ProjectSchema.Type;

export const ExperienceSubItemSchema = Schema.Struct({
  period: Schema.String,
  role: Schema.String,
});
export type ExperienceSubItem = typeof ExperienceSubItemSchema.Type;

export const ExperienceNodeSchema = Schema.Struct({
  period: Schema.String,
  company: Schema.String,
  role: Schema.String,
  items: Schema.optional(Schema.Array(ExperienceSubItemSchema)),
});
export type ExperienceNode = typeof ExperienceNodeSchema.Type;

export const ProfileSchema = Schema.Struct({
  name: Schema.String,
  role: Schema.String,
  tagline: Schema.String,
  email: Schema.String,
  github: Schema.String,
  linkedin: Schema.String,
  location: Schema.String,
  asciiBanner: Schema.Array(Schema.String),
});
export type Profile = typeof ProfileSchema.Type;

export const decodeProject = (raw: unknown) => Schema.decodeUnknownEffect(ProjectSchema)(raw);

export const decodeExperienceNode = (raw: unknown) =>
  Schema.decodeUnknownEffect(ExperienceNodeSchema)(raw);

export const decodeProfile = (raw: unknown) => Schema.decodeUnknownEffect(ProfileSchema)(raw);
