import type { JSX } from "preact";
import { clock, host, meter, percentage, rightSide, sbarContainer, section } from "./statusBar.css";

export const StatusBar = (): JSX.Element => (
  <footer id="sbar" className={sbarContainer} role="contentinfo" aria-label="Terminal status bar">
    <span className={host}>[elliot14a@portfolio]</span>
    <span id="sbar-sect" className={section}>
      {" ▸ intro"}
    </span>
    <div className={rightSide}>
      <span id="sbar-meter" className={meter} aria-hidden="true">
        ░░░░░░░░
      </span>
      <span id="sbar-pct" className={percentage}>
        0%
      </span>
      <span id="sbar-clock" className={clock} />
    </div>
  </footer>
);
