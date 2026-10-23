import type { Profile } from "@portfolio/content";
import type { JSX } from "preact";
import { AsciiBanner } from "../asciiBanner";
import { CatAscii } from "../catAscii";
import { TerminalPrompt } from "../terminalPrompt";
import {
  bioText,
  heroContainer,
  highlightPill,
  linkItem,
  linksList,
  linksRow,
  roleBadge,
} from "./hero.css";

type HeroProps = {
  readonly profile: Profile;
};

const renderBioText = (text: string): (string | JSX.Element)[] => {
  const parts = text.split(/(\[.*?\])/);
  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return (
        <span key={index} className={highlightPill}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

export const Hero = ({ profile }: HeroProps): JSX.Element => (
  <header className={heroContainer}>
    <TerminalPrompt />
    <AsciiBanner />
    <div className={roleBadge}>{profile.role}</div>
    {profile.bio.map((paragraph, index) => (
      <p key={index} className={bioText}>
        {renderBioText(paragraph)}
      </p>
    ))}
    <div className={linksRow}>
      <ul className={linksList}>
        <li>
          <a className={linkItem} href={`mailto:${profile.links.email}`}>
            email
          </a>
        </li>
        <li>
          <a className={linkItem} href={profile.links.github} target="_blank" rel="noreferrer">
            github
          </a>
        </li>
        <li>
          <a className={linkItem} href={profile.links.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </li>
      </ul>
      <CatAscii />
    </div>
  </header>
);
