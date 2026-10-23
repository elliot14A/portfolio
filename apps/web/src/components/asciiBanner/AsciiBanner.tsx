import type { JSX } from "preact";
import { bannerStyle } from "./asciiBanner.css";

const BANNER = `    _    _  ______  _   _ ___ _____ _   _ 
   / \\  | |/ / ___|| | | |_ _|_   _| | | |
  / _ \\ | ' /\\___ \\| |_| || |  | | | |_| |
 / ___ \\| . \\ ___) |  _  || |  | | |  _  |
/_/   \\_\\_|\\_\\____/|_| |_|___| |_| |_| |_|`;

export const AsciiBanner = (): JSX.Element => (
  <pre className={bannerStyle} role="img" aria-label="Akshith">
    {BANNER}
  </pre>
);
