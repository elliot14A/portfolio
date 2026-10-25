import type { JSX } from "preact";
import { commandStyle, promptStyle, userStyle } from "./terminalPrompt.css";

export const TerminalPrompt = (): JSX.Element => (
  <div className={promptStyle}>
    <span className={userStyle}>elliot14a@portfolio</span>
    <span> ~ % </span>
    <span className={commandStyle}>./portfolio</span>
  </div>
);
