import type { JSX } from "preact";
import { catStyle } from "./catAscii.css";

const CAT = ` /\\_/\\
( o.o )
 > ^ <`;

export const CatAscii = (): JSX.Element => (
  <pre className={catStyle} role="img" aria-label="ASCII cat">
    {CAT}
  </pre>
);
