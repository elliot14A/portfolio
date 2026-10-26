import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  cgBadge,
  cgCell,
  cgCorner,
  cgCount,
  cgFoot,
  cgGap,
  cgGrid,
  cgLegend,
  cgLegendCell,
  cgLevel0,
  cgLevel1,
  cgLevel2,
  cgLevel3,
  cgLevel4,
  cgMonth,
  cgWeekday,
  gridWrapper,
  monthSpans,
  scrollArea,
  sectionContainer,
  sectionHeading,
  slashPrefix,
  slotNotice,
} from "./gitContributions.css";

export type Cell = Readonly<{
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}>;

export type MonthSpan = Readonly<{
  label: string;
  span: number;
}>;

export type ContributionGraph = Readonly<{
  total: number;
  weeks: number;
  months: readonly MonthSpan[];
  rows: readonly (readonly (Cell | null)[])[];
  sample: boolean;
}>;

export type GitContributionsProps = {
  readonly graph?: ContributionGraph;
};

const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const LEGEND_LEVELS = [0, 1, 2, 3, 4] as const;

const getLevelClass = (level: 0 | 1 | 2 | 3 | 4): string => {
  switch (level) {
    case 1:
      return cgLevel1;
    case 2:
      return cgLevel2;
    case 3:
      return cgLevel3;
    case 4:
      return cgLevel4;
    default:
      return cgLevel0;
  }
};

const dayTooltip = (cell: Cell): string =>
  `${cell.count === 0 ? "No" : cell.count} contribution${
    cell.count === 1 ? "" : "s"
  } on ${cell.date}`;

export const GitContributions = ({
  graph: initialGraph,
}: GitContributionsProps = {}): JSX.Element => {
  const [graph, setGraph] = useState<ContributionGraph | null>(initialGraph ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (graph) return;

    let unmounted = false;
    fetch("/api/contributions")
      .then((res) => {
        if (!res.ok) throw new Error(`status: ${res.status}`);
        return res.json() as Promise<ContributionGraph>;
      })
      .then((data) => {
        if (!unmounted) setGraph(data);
      })
      .catch(() => {
        if (!unmounted) setFailed(true);
      });

    return () => {
      unmounted = true;
    };
  }, [graph]);

  return (
    <section id="contributions" className={sectionContainer}>
      <h2 className={sectionHeading}>
        <span className={slashPrefix}>{"// "}</span>
        {"git contributions"}
      </h2>

      {!graph && !failed && <div className={slotNotice}>{"// loading contributions..."}</div>}

      {failed && <div className={slotNotice}>{"// failed to load contributions"}</div>}

      {graph && (
        <div className={scrollArea}>
          <div className={gridWrapper}>
            <div
              className={cgGrid}
              role="img"
              aria-label={`${graph.total} contributions in the last year`}
            >
              <span className={cgCorner} />
              {graph.months.map((m, idx) => (
                <span
                  key={`m-${idx}`}
                  className={`${cgMonth} ${monthSpans[m.span] ?? monthSpans[1]}`}
                >
                  {m.label}
                </span>
              ))}

              {graph.rows.map((row, weekday) => (
                <>
                  <span key={`wd-${weekday}`} className={cgWeekday}>
                    {WEEKDAYS[weekday]}
                  </span>
                  {row.map((cell, weekIdx) => {
                    if (cell === null) {
                      return (
                        <span key={`c-${weekday}-${weekIdx}`} className={`${cgCell} ${cgGap}`} />
                      );
                    }
                    return (
                      <span
                        key={`c-${weekday}-${weekIdx}`}
                        className={`${cgCell} ${getLevelClass(cell.level)}`}
                        title={dayTooltip(cell)}
                      />
                    );
                  })}
                </>
              ))}
            </div>

            <div className={cgFoot}>
              <span className={cgCount}>
                <span>{`${graph.total} contributions in the last year`}</span>
                {graph.sample && <span className={cgBadge}>[sample data]</span>}
              </span>
              <div className={cgLegend} aria-hidden="true">
                <span>less</span>
                {LEGEND_LEVELS.map((lvl) => (
                  <span key={`leg-${lvl}`} className={`${cgLegendCell} ${getLevelClass(lvl)}`} />
                ))}
                <span>more</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
