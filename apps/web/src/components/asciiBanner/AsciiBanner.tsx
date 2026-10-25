import type { JSX } from "preact";
import { bannerStyle, bannerWrapper } from "./asciiBanner.css";

const BANNER = `███████╗██╗     ██╗     ██╗ ██████╗ ████████╗ ██╗██╗  ██╗ █████╗ 
██╔════╝██║     ██║     ██║██╔═══██╗╚══██╔══╝███║██║  ██║██╔══██╗
▓▓▓▓▓╗  ▓▓║     ▓▓║     ▓▓║▓▓║   ▓▓║   ▓▓║   ╚▓▓║▓▓▓▓▓▓▓║▓▓▓▓▓▓▓║
▒▒╔══╝  ▒▒║     ▒▒║     ▒▒║▒▒║   ▒▒║   ▒▒║    ▒▒║╚════▒▒║▒▒╔══▒▒║
░░░░░░░╗░░░░░░░╗░░░░░░░╗░░║╚░░░░░░╔╝   ░░║    ░░║     ░░║░░║  ░░║
╚══════╝╚══════╝╚══════╝╚═╝ ╚═════╝    ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝`;

export const AsciiBanner = (): JSX.Element => (
  <div className={bannerWrapper}>
    <pre className={bannerStyle} role="img" aria-label="elliot14a">
      {BANNER}
    </pre>
  </div>
);
