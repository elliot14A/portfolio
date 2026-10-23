import type { ProjectDoc } from "@portfolio/content";
import type { JSX } from "preact";
import { PageLayout } from "../layout";
import {
  backLink,
  pageContainer,
  projectHeader,
  projectTitle,
  proseHeading,
  proseList,
  proseListItem,
  proseParagraph,
  proseSection,
  terminalCommand,
} from "./projectPage.css";

type ProjectPageProps = {
  readonly project: ProjectDoc;
};

const formatInline = (text: string): (string | JSX.Element)[] => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const renderMarkdownContent = (raw: string): JSX.Element[] => {
  const blocks = raw
    .replace(/^#\s+[^\n]+\n+/, "")
    .trim()
    .split(/\n\n+/);

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      const heading = trimmed.slice(3).trim();
      return (
        <h2 key={index} className={proseHeading}>
          {"// "}
          {heading}
        </h2>
      );
    }
    if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
      const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
      return (
        <ul key={index} className={proseList}>
          {lines.map((line, lineIndex) => {
            const cleanLine = line.replace(/^-\s+/, "").trim();
            return (
              <li key={lineIndex} className={proseListItem}>
                {formatInline(cleanLine)}
              </li>
            );
          })}
        </ul>
      );
    }
    return (
      <p key={index} className={proseParagraph}>
        {formatInline(trimmed)}
      </p>
    );
  });
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
          akshith@portfolio ~/projects/{project.slug} % cat writeup.md
        </div>
        <h1 className={projectTitle}>{project.title}</h1>
      </header>
      <div className={proseSection}>{renderMarkdownContent(project.content)}</div>
    </div>
  </PageLayout>
);
