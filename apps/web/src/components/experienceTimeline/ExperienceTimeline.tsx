import type { RoleExperience } from "@portfolio/content";
import type { JSX } from "preact";
import {
  bulletContent,
  bulletItem,
  bulletList,
  bulletMarker,
  companyName,
  contentCol,
  highlightPill,
  hoverCardArrow,
  hoverCardArrowIcon,
  hoverCardContainer,
  hoverCardDesc,
  hoverCardHeader,
  hoverCardPopup,
  hoverCardTitle,
  periodCol,
  projectLink,
  roleBlock,
  roleHeader,
  roleList,
  roleSeparator,
  roleTitle,
  sectionContainer,
  sectionHeading,
  slashPrefix,
} from "./experienceTimeline.css";

type ExperienceTimelineProps = {
  readonly roles: readonly RoleExperience[];
};

const PROJECT_TOOLTIPS: Record<string, string> = {
  Gaur: "AI data platform taking customer data to queryable apps in under 10 minutes",
  Gopie: "Natural-language-to-SQL data analyst agent across dual OLAP engines",
  "Tagore AI": "Research platform delivering cited answers across 2,000,000+ government documents",
  Meterus: "Event-driven telemetry pipeline in Go & Rust with 99.99% uptime over two years",
  Kavach: "Factly's internal authentication and authorization platform on the Ory stack",
  ruspie: "In-place query engine for CSV and Parquet files in Rust on Apache Arrow",
  Rocky: "Custom opinionated NixOS fleet deployment tool in Rust",
  roapi: "Open-source query framework for static datasets",
};

const renderInline = (text: string): (string | JSX.Element)[] => {
  const regex = /(\[[^\]]+\]\([^)]+\)|\[[^\]]+\])/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    const fullMatch = match[0];
    const linkMatch = fullMatch.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (linkMatch) {
      const label = linkMatch[1] ?? "";
      const url = linkMatch[2] ?? "";
      const tooltip = PROJECT_TOOLTIPS[label] ?? label;
      const isExternal = url.startsWith("http");

      parts.push(
        <span key={matchIndex} className={hoverCardContainer}>
          <a
            href={url}
            className={projectLink}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noreferrer" : undefined}
          >
            {label}
          </a>
          <span className={hoverCardPopup} role="tooltip">
            <span className={hoverCardHeader}>
              <span className={hoverCardTitle}>{label}</span>
              <span className={hoverCardArrowIcon}>↗</span>
            </span>
            <span className={hoverCardDesc}>{tooltip}</span>
            <span className={hoverCardArrow} />
          </span>
        </span>,
      );
    } else if (fullMatch.startsWith("[") && fullMatch.endsWith("]")) {
      const content = fullMatch.slice(1, -1);
      const tooltip = PROJECT_TOOLTIPS[content];

      if (tooltip) {
        parts.push(
          <span key={matchIndex} className={hoverCardContainer}>
            <span className={highlightPill}>{content}</span>
            <span className={hoverCardPopup} role="tooltip">
              <span className={hoverCardHeader}>
                <span className={hoverCardTitle}>{content}</span>
                <span className={hoverCardArrowIcon}>★</span>
              </span>
              <span className={hoverCardDesc}>{tooltip}</span>
              <span className={hoverCardArrow} />
            </span>
          </span>,
        );
      } else {
        parts.push(
          <span key={matchIndex} className={highlightPill}>
            {content}
          </span>,
        );
      }
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export const ExperienceTimeline = ({ roles }: ExperienceTimelineProps): JSX.Element => (
  <section id="experience" className={sectionContainer}>
    <h2 className={sectionHeading}>
      <span className={slashPrefix}>{"// "}</span>
      {"experience"}
    </h2>
    <div className={roleList}>
      {roles.map((item, index) => (
        <div key={index} className={roleBlock}>
          <div className={periodCol}>{item.period}</div>
          <div className={contentCol}>
            <div className={roleHeader}>
              <span className={roleTitle}>{item.role}</span>
              <span className={roleSeparator}>·</span>
              <span className={companyName}>{item.company}</span>
            </div>

            <ul className={bulletList}>
              {item.bullets.map((bullet, bulletIdx) => (
                <li key={bulletIdx} className={bulletItem}>
                  <span className={bulletMarker}>•</span>
                  <div className={bulletContent}>{renderInline(bullet)}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
);
