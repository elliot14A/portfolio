import {
  ALL_PROJECTS,
  PERSONAL_PROJECTS,
  PROJECTS_BY_SLUG,
  ROLE_EXPERIENCES,
} from "@portfolio/content";
import { Effect, Schema } from "effect";
import { Tool, Toolkit } from "effect/unstable/ai";

export const ProjectSummary = Schema.Struct({
  slug: Schema.String,
  title: Schema.String,
  tagline: Schema.String,
  techStack: Schema.Array(Schema.String),
  href: Schema.String,
});
export type ProjectSummary = typeof ProjectSummary.Type;

export const ProjectDetails = Schema.Struct({
  slug: Schema.String,
  title: Schema.String,
  overview: Schema.Array(Schema.String),
  whatIBuilt: Schema.Array(Schema.String),
  highlights: Schema.Array(Schema.String),
  liveUrl: Schema.optional(Schema.String),
  repoUrl: Schema.optional(Schema.String),
  href: Schema.String,
});
export type ProjectDetails = typeof ProjectDetails.Type;

export const ExperienceItem = Schema.Struct({
  role: Schema.String,
  company: Schema.String,
  period: Schema.String,
  location: Schema.String,
  bullets: Schema.Array(Schema.String),
});
export type ExperienceItem = typeof ExperienceItem.Type;

export const searchProjects = (query: string): readonly ProjectSummary[] => {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);

  const matchesSystem = (p: (typeof ALL_PROJECTS)[number]) => {
    if (tokens.length === 0) return true;
    const haystack = [p.title, p.tagline, p.summary, ...p.highlights, ...p.techStack]
      .join(" ")
      .toLowerCase();
    return tokens.some((t) => haystack.includes(t));
  };

  const matchesPersonal = (p: (typeof PERSONAL_PROJECTS)[number]) => {
    if (tokens.length === 0) return true;
    const haystack = [p.name, p.description, ...p.highlights, ...p.techStack]
      .join(" ")
      .toLowerCase();
    return tokens.some((t) => haystack.includes(t));
  };

  const seenSlugs = new Set<string>();
  const results: ProjectSummary[] = [];

  for (const p of ALL_PROJECTS) {
    if (matchesSystem(p)) {
      seenSlugs.add(p.slug.toLowerCase());
      results.push({
        slug: p.slug,
        title: p.title,
        tagline: p.tagline,
        techStack: [...p.techStack],
        href: `/projects/${p.slug}`,
      });
    }
  }

  for (const p of PERSONAL_PROJECTS) {
    const slug = (p.writeupSlug ?? p.name).toLowerCase();
    if (!seenSlugs.has(slug) && matchesPersonal(p)) {
      seenSlugs.add(slug);
      results.push({
        slug: p.writeupSlug ?? p.name,
        title: p.name,
        tagline: p.description,
        techStack: [...p.techStack],
        href: p.writeupSlug ? `/projects/${p.writeupSlug}` : (p.liveUrl ?? p.repoUrl),
      });
    }
  }

  if (results.length === 0) {
    return ALL_PROJECTS.map((p) => ({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      techStack: [...p.techStack],
      href: `/projects/${p.slug}`,
    }));
  }

  return results;
};

export const getProjectDetails = (rawSlug: string): ProjectDetails | null => {
  const slug = rawSlug.toLowerCase().trim();
  const systemProject = PROJECTS_BY_SLUG[slug];

  if (systemProject) {
    return {
      slug: systemProject.slug,
      title: systemProject.title,
      overview: [...systemProject.overview],
      whatIBuilt: [...systemProject.whatIBuilt],
      highlights: [...systemProject.highlights],
      ...(systemProject.liveUrl ? { liveUrl: systemProject.liveUrl } : {}),
      ...(systemProject.repoUrl ? { repoUrl: systemProject.repoUrl } : {}),
      href: `/projects/${systemProject.slug}`,
    };
  }

  const personal = PERSONAL_PROJECTS.find(
    (p) => p.name.toLowerCase() === slug || p.writeupSlug?.toLowerCase() === slug,
  );

  if (personal) {
    return {
      slug: personal.writeupSlug ?? personal.name,
      title: personal.name,
      overview: [personal.description],
      whatIBuilt: [...personal.highlights],
      highlights: [...personal.highlights],
      ...(personal.liveUrl ? { liveUrl: personal.liveUrl } : {}),
      ...(personal.repoUrl ? { repoUrl: personal.repoUrl } : {}),
      href: personal.writeupSlug
        ? `/projects/${personal.writeupSlug}`
        : (personal.liveUrl ?? personal.repoUrl),
    };
  }

  return null;
};

export const getExperience = (companyOrRole: string): readonly ExperienceItem[] => {
  const term = companyOrRole.toLowerCase().trim();
  if (!term) {
    return [...ROLE_EXPERIENCES];
  }
  const matches = ROLE_EXPERIENCES.filter(
    (r) =>
      r.company.toLowerCase().includes(term) ||
      r.role.toLowerCase().includes(term) ||
      r.bullets.some((b) => b.toLowerCase().includes(term)),
  );
  return matches.length > 0 ? matches : [...ROLE_EXPERIENCES];
};

export const searchProjectsTool = Tool.make("searchProjects", {
  description:
    "Search Akshith's projects by keyword, technology, or topic. Returns matched project summaries and links.",
  parameters: Schema.Struct({
    query: Schema.String,
  }),
  success: Schema.Array(ProjectSummary),
});

export const getProjectDetailsTool = Tool.make("getProjectDetails", {
  description:
    "Get full deep-dive architectural details, overview, and what Akshith built for a specific project.",
  parameters: Schema.Struct({
    slug: Schema.String,
  }),
  success: Schema.NullOr(ProjectDetails),
});

export const getExperienceTool = Tool.make("getExperience", {
  description:
    "Get detailed work experience, roles, achievements, and metrics for a specific company or role.",
  parameters: Schema.Struct({
    companyOrRole: Schema.String,
  }),
  success: Schema.Array(ExperienceItem),
});

export const chatToolkit = Toolkit.make(
  searchProjectsTool,
  getProjectDetailsTool,
  getExperienceTool,
);

export const chatToolkitHandlers = chatToolkit.toLayer({
  searchProjects: ({ query }) => Effect.sync(() => searchProjects(query)),
  getProjectDetails: ({ slug }) => Effect.sync(() => getProjectDetails(slug)),
  getExperience: ({ companyOrRole }) => Effect.sync(() => getExperience(companyOrRole)),
});
