import type { ExperienceItem } from "@portfolio/content";
import type { JSX } from "preact";
import {
  branchSymbol,
  companyBlock,
  companyName,
  contentCol,
  experienceList,
  periodCol,
  roleRow,
  roleTitle,
  sectionContainer,
  sectionHeading,
  slashPrefix,
} from "./experienceTree.css";

type ExperienceTreeProps = {
  readonly items: readonly ExperienceItem[];
};

type GroupedCompany = {
  readonly company: string;
  readonly period: string;
  readonly roles: readonly string[];
};

const groupExperience = (items: readonly ExperienceItem[]): readonly GroupedCompany[] => {
  const map = new Map<string, { start: string; end: string; roles: string[] }>();

  for (const item of items) {
    const years = [...item.period.matchAll(/\b(20\d{2})\b/g)].map((m) => m[1] ?? "");
    const itemStart = years[0] ?? "";
    const itemEnd = item.period.toLowerCase().includes("now")
      ? "now"
      : (years[1] ?? years[0] ?? "");

    const existing = map.get(item.company);
    if (existing) {
      existing.roles.push(item.role);
      if (itemStart && (!existing.start || itemStart < existing.start)) {
        existing.start = itemStart;
      }
      if (itemEnd === "now" || (existing.end !== "now" && itemEnd && itemEnd > existing.end)) {
        existing.end = itemEnd;
      }
    } else {
      map.set(item.company, {
        start: itemStart,
        end: itemEnd,
        roles: [item.role],
      });
    }
  }

  return Array.from(map.entries()).map(([company, data]) => {
    const period = data.start === data.end || !data.end ? data.start : `${data.start}-${data.end}`;
    return {
      company,
      period,
      roles: data.roles,
    };
  });
};

export const ExperienceTree = ({ items }: ExperienceTreeProps): JSX.Element => {
  const grouped = groupExperience(items);

  return (
    <section id="experience" className={sectionContainer}>
      <h2 className={sectionHeading}>
        <span className={slashPrefix}>{"// "}</span>
        {"experience"}
      </h2>
      <div className={experienceList}>
        {grouped.map((group, groupIndex) => (
          <div key={groupIndex} className={companyBlock}>
            <div className={periodCol}>{group.period}</div>
            <div className={contentCol}>
              <div className={companyName}>{group.company}</div>
              {group.roles.map((role, roleIndex) => {
                const isLast = roleIndex === group.roles.length - 1;
                const branch = isLast ? "└──" : "├──";
                return (
                  <div key={roleIndex} className={roleRow}>
                    <span className={branchSymbol}>{branch}</span>
                    <span className={roleTitle}>{role}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
