import type { SelectedWorkItem } from "@portfolio/content";
import type { JSX } from "preact";
import {
  arrowPrefix,
  highlightPill,
  itemContainer,
  itemHeader,
  itemMeta,
  itemNumber,
  itemSummary,
  itemTitle,
  linkText,
  sectionContainer,
  sectionHeading,
  slashPrefix,
  viewProjectLink,
  workList,
} from "./selectedWork.css";

type SelectedWorkProps = {
  readonly items: readonly SelectedWorkItem[];
};

const renderSummaryWithPills = (text: string): (string | JSX.Element)[] => {
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

export const SelectedWork = ({ items }: SelectedWorkProps): JSX.Element => (
  <section id="selected-work" className={sectionContainer}>
    <h2 className={sectionHeading}>
      <span className={slashPrefix}>{"// "}</span>
      {"selected work"}
    </h2>
    <div className={workList}>
      {items.map((item) => (
        <article key={item.slug} className={itemContainer}>
          <div className={itemHeader}>
            <span className={itemTitle}>
              <span className={itemNumber}>{item.number}</span>
              {item.title}
            </span>
            <span className={itemMeta}>
              {item.company} · {item.period}
            </span>
          </div>
          <p className={itemSummary}>{renderSummaryWithPills(item.summary)}</p>
          <a className={viewProjectLink} href={`/projects/${item.slug}`}>
            <span className={arrowPrefix}>▸</span>
            <span className={linkText}>view project</span>
          </a>
        </article>
      ))}
    </div>
  </section>
);
