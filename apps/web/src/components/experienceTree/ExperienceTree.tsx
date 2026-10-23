import type { ExperienceItem } from "@portfolio/content";
import type { JSX } from "preact";
import {
  sectionContainer,
  sectionHeading,
  treeBranch,
  treeDetails,
  treeList,
  treeNode,
  treePeriod,
  treeRole,
} from "./experienceTree.css";

type ExperienceTreeProps = {
  readonly items: readonly ExperienceItem[];
};

export const ExperienceTree = ({ items }: ExperienceTreeProps): JSX.Element => (
  <section className={sectionContainer}>
    <h2 className={sectionHeading}>{"// experience"}</h2>
    <ul className={treeList}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const branchSymbol = isLast ? "└──" : "├──";
        return (
          <li key={index} className={treeNode}>
            <span className={treeBranch}>{branchSymbol}</span>
            <span className={treePeriod}>{item.period}</span>
            <span className={treeDetails}>
              {item.company} · <span className={treeRole}>{item.role}</span>
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);
