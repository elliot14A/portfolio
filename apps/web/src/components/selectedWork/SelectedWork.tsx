import type { SelectedWorkItem } from "@portfolio/content";
import type { JSX } from "preact";
import {
  cardContainer,
  cardHeader,
  cardMeta,
  cardNumber,
  cardSummary,
  cardTitle,
  highlightBadge,
  highlightsContainer,
  sectionContainer,
  sectionHeading,
  viewProjectLink,
  workList,
} from "./selectedWork.css";

type SelectedWorkProps = {
  readonly items: readonly SelectedWorkItem[];
};

export const SelectedWork = ({ items }: SelectedWorkProps): JSX.Element => (
  <section className={sectionContainer}>
    <h2 className={sectionHeading}>{"// selected work"}</h2>
    <div className={workList}>
      {items.map((item) => (
        <article key={item.slug} className={cardContainer}>
          <div className={cardHeader}>
            <span className={cardTitle}>
              <span className={cardNumber}>{item.number}</span>
              {item.title}
            </span>
            <span className={cardMeta}>
              | {item.company} · {item.period}
            </span>
          </div>
          <p className={cardSummary}>{item.summary}</p>
          <div className={highlightsContainer}>
            {item.highlights.map((highlight, index) => (
              <span key={index} className={highlightBadge}>
                {highlight}
              </span>
            ))}
          </div>
          <a className={viewProjectLink} href={`/projects/${item.slug}`}>
            ▸ view project
          </a>
        </article>
      ))}
    </div>
  </section>
);
