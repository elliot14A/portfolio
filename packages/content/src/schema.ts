import { Schema } from "effect";

export const ContactLinksSchema = Schema.Struct({
  email: Schema.NonEmptyString,
  github: Schema.NonEmptyString,
  linkedin: Schema.NonEmptyString,
});
export type ContactLinks = typeof ContactLinksSchema.Type;

export const ProfileSchema = Schema.Struct({
  name: Schema.NonEmptyString,
  role: Schema.NonEmptyString,
  location: Schema.NonEmptyString,
  links: ContactLinksSchema,
  bio: Schema.Array(Schema.NonEmptyString),
});
export type Profile = typeof ProfileSchema.Type;

export const SelectedWorkItemSchema = Schema.Struct({
  number: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  company: Schema.NonEmptyString,
  period: Schema.NonEmptyString,
  summary: Schema.NonEmptyString,
  highlights: Schema.Array(Schema.NonEmptyString),
  slug: Schema.NonEmptyString,
});
export type SelectedWorkItem = typeof SelectedWorkItemSchema.Type;

export const ExperienceItemSchema = Schema.Struct({
  period: Schema.NonEmptyString,
  company: Schema.NonEmptyString,
  role: Schema.NonEmptyString,
});
export type ExperienceItem = typeof ExperienceItemSchema.Type;

export const ProjectDocSchema = Schema.Struct({
  slug: Schema.NonEmptyString,
  title: Schema.NonEmptyString,
  content: Schema.NonEmptyString,
});
export type ProjectDoc = typeof ProjectDocSchema.Type;
