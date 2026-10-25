import type { PersonalProject } from "@portfolio/content";
import type { JSX } from "preact";
import {
  bulletItem,
  bulletList,
  bulletMarker,
  contentCol,
  highlightPill,
  nameCol,
  projectBlock,
  projectDesc,
  projectLinks,
  projectList,
  projectName,
  sectionContainer,
  sectionHeading,
  slashPrefix,
  smallLink,
} from "./personalProjects.css";

type PersonalProjectsProps = {
  readonly projects: readonly PersonalProject[];
};

const renderInline = (text: string): (string | JSX.Element)[] => {
  const parts = text.split(/(\[.*?\])/);
  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <span key={index} className={highlightPill}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

export const PersonalProjects = ({ projects }: PersonalProjectsProps): JSX.Element => (
  <section id="projects" className={sectionContainer}>
    <h2 className={sectionHeading}>
      <span className={slashPrefix}>{"// "}</span>
      {"personal projects"}
    </h2>
    <div className={projectList}>
      {projects.map((proj, index) => (
        <div key={index} className={projectBlock}>
          <div className={nameCol}>
            {proj.writeupSlug ? (
              <a href={`/projects/${proj.writeupSlug}`} className={projectName}>
                {proj.name}
              </a>
            ) : (
              <a href={proj.repoUrl} target="_blank" rel="noreferrer" className={projectName}>
                {proj.name}
              </a>
            )}
            <div className={projectLinks}>
              {proj.writeupSlug && (
                <>
                  <a href={`/projects/${proj.writeupSlug}`} className={smallLink}>
                    writeup
                  </a>
                  <span>·</span>
                </>
              )}
              <a href={proj.repoUrl} target="_blank" rel="noreferrer" className={smallLink}>
                github
              </a>
              {proj.liveUrl && (
                <>
                  <span>·</span>
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className={smallLink}>
                    live
                  </a>
                </>
              )}
            </div>
          </div>
          <div className={contentCol}>
            <p className={projectDesc}>{renderInline(proj.description)}</p>
            <ul className={bulletList}>
              {proj.highlights.map((h, hIdx) => (
                <li key={hIdx} className={bulletItem}>
                  <span className={bulletMarker}>•</span>
                  <span>{renderInline(h)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
);
