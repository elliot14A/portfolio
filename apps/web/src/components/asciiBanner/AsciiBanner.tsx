import type { JSX } from "preact";
import { bannerStyle } from "./asciiBanner.css";

const BANNER = `███████╗██╗     ██╗     ██╗ ██████╗ ████████╗ ██╗██╗  ██╗ █████╗ 
██╔════╝██║     ██║     ██║██╔═══██╗╚══██╔══╝███║██║  ██║██╔══██╗
▓▓▓▓▓╗  ▓▓║     ▓▓║     ▓▓║▓▓║   ▓▓║   ▓▓║   ╚▓▓║▓▓▓▓▓▓▓║▓▓▓▓▓▓▓║
▒▒╔══╝  ▒▒║     ▒▒║     ▒▒║▒▒║   ▒▒║   ▒▒║    ▒▒║╚════▒▒║▒▒╔══▒▒║
░░░░░░░╗░░░░░░░╗░░░░░░░╗░░║╚░░░░░░╔╝   ░░║    ░░║     ░░║░░║  ░░║
╚══════╝╚══════╝╚══════╝╚═╝ ╚═════╝    ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝`;

export const AsciiBanner = (): JSX.Element => (
  <pre className={bannerStyle} role="img" aria-label="elliot14a">
    {BANNER}
  </pre>
);
