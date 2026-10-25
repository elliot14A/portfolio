import type { ToolboxItem } from "@portfolio/content";
import type { JSX } from "preact";
import {
  categoryCol,
  itemsCol,
  sectionContainer,
  sectionHeading,
  slashPrefix,
  toolboxRow,
  toolboxTable,
} from "./toolbox.css";

type ToolboxProps = {
  readonly items: readonly ToolboxItem[];
};

export const Toolbox = ({ items }: ToolboxProps): JSX.Element => (
  <section id="toolbox" className={sectionContainer}>
    <h2 className={sectionHeading}>
      <span className={slashPrefix}>{"// "}</span>
      {"the toolbox"}
    </h2>
    <table className={toolboxTable}>
      <tbody>
        {items.map((entry, index) => (
          <tr key={index} className={toolboxRow}>
            <td className={categoryCol}>{entry.category}</td>
            <td className={itemsCol}>{entry.items.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);
