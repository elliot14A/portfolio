import type { SystemProject } from "@portfolio/content";
import type { JSX } from "preact";
import { AiAssistant } from "../components/aiAssistant";
import { PageLayout } from "../layout";
import {
  backLink,
  bulletMarker,
  externalLink,
  externalLinksRow,
  highlightPill,
  pageContainer,
  projectHeader,
  projectMeta,
  projectTitle,
  proseHeading,
  proseList,
  proseListItem,
  proseParagraph,
  proseSection,
  techLine,
  terminalCommand,
} from "./projectPage.css";

type ProjectPageProps = {
  readonly project: SystemProject;
};

const renderInline = (text: string): (string | JSX.Element)[] => {
  const parts: (string | JSX.Element)[] = [];
  const regex = /(\[.*?\])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = regex.exec(text);

  while (match !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    const fullMatch = match[0];
    const content = fullMatch.slice(1, -1);
    parts.push(
      <span key={matchIndex} className={highlightPill}>
        {content}
      </span>,
    );
    lastIndex = matchIndex + fullMatch.length;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export const ProjectPage = ({ project }: ProjectPageProps): JSX.Element => (
  <PageLayout>
    <div className={pageContainer}>
      <nav>
        <a className={backLink} href="/">
          ← ../portfolio
        </a>
      </nav>

      <header className={projectHeader}>
        <div className={terminalCommand}>
          elliot14a@portfolio ~/projects/{project.slug} % cat writeup.md
        </div>
        <h1 className={projectTitle}>{project.title}</h1>
        <p className={projectMeta}>
          {project.role} @ {project.company} · {project.period}
        </p>

        {(project.liveUrl || project.repoUrl) && (
          <div className={externalLinksRow}>
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className={externalLink}>
                live: {project.liveUrl} ↗
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className={externalLink}>
                repo: {project.repoUrl} ↗
              </a>
            )}
          </div>
        )}

        <div className={techLine}>stack: {project.techStack.join(", ")}</div>
      </header>

      <div className={proseSection}>
        <div>
          <h2 className={proseHeading}>{"// "}overview</h2>
          {project.overview.map((para, idx) => (
            <p key={idx} className={proseParagraph}>
              {renderInline(para)}
            </p>
          ))}
        </div>

        <div>
          <h2 className={proseHeading}>{"// "}what I built</h2>
          <ul className={proseList}>
            {project.whatIBuilt.map((item, idx) => (
              <li key={idx} className={proseListItem}>
                <span className={bulletMarker}>-</span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={proseHeading}>{"// "}key highlights</h2>
          <ul className={proseList}>
            {project.highlights.map((item, idx) => (
              <li key={idx} className={proseListItem}>
                <span className={bulletMarker}>-</span>
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    <div id="ai-assistant-root">
      <AiAssistant />
    </div>
  </PageLayout>
);
