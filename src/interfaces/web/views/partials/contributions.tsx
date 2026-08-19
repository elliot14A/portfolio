import type { Cell, ContributionGraph } from "@/core/git/contributions";

export type ContributionsViewProps = Readonly<{
  graph: ContributionGraph;
  sample: boolean;
}>;

// Sunday-first, matching the row order. Only the odd rows are labelled, as on
// github: seven stacked labels would not fit the cell height.
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;

const LEGEND = [0, 1, 2, 3, 4] as const;

const dayLabel = (cell: Cell): string =>
  `${cell.count === 0 ? "no" : cell.count} contribution${
    cell.count === 1 ? "" : "s"
  } on ${cell.date}`;

function CellSpan(props: { cell: Cell | null }) {
  const { cell } = props;
  // A gap day in the leading or trailing partial week: hold the column open.
  if (cell === null) return <span class="cg-c cg-gap" />;
  return <span class={`cg-c cg-${cell.level}`} title={dayLabel(cell)} />;
}

// Everything is a span: this fragment is swapped into `<span class="txt">`,
// where a div would be invalid phrasing content.
export function ContributionsView(props: ContributionsViewProps) {
  const { graph, sample } = props;
  const label = `${graph.total} contributions in the last year`;
  return (
    <span
      class="cg"
      role="img"
      aria-label={label}
      data-source={sample ? "sample" : "github"}
      style={`--cols:${graph.weeks}`}
    >
      <span class="cg-grid">
        <span class="cg-corner" />
        {graph.months.map((month) => (
          <span class="cg-month" style={`--span:${month.span}`}>
            {month.label}
          </span>
        ))}
        {graph.rows.map((row, weekday) => (
          <>
            <span class="cg-weekday">{WEEKDAYS[weekday]}</span>
            {row.map((cell) => (
              <CellSpan cell={cell} />
            ))}
          </>
        ))}
      </span>
      <span class="cg-foot">
        <span class="cg-count">
          {label}
          {sample ? <span class="cg-badge">sample data</span> : null}
        </span>
        <span class="cg-legend" aria-hidden="true">
          less
          {LEGEND.map((level) => (
            <span class={`cg-c cg-${level}`} />
          ))}
          more
        </span>
      </span>
    </span>
  );
}
