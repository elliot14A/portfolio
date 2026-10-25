import type { Profile } from "@portfolio/content";
import type { JSX } from "preact";
import { AsciiBanner } from "../asciiBanner";
import { TerminalPrompt } from "../terminalPrompt";
import {
  badgeRow,
  bioSection,
  bioText,
  heroBodyGrid,
  heroContainer,
  highlightPill,
  linkItem,
  linksRow,
  portraitFrame,
  portraitImage,
  portraitSlot,
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
  <header id="intro" className={heroContainer}>
    <TerminalPrompt />
    <AsciiBanner />
    <div className={badgeRow}>
      {profile.roleBadges.map((badge, index) => (
        <div key={index} className={roleBadge}>
          {badge}
        </div>
      ))}
    </div>
    <div className={heroBodyGrid}>
      <div className={bioSection}>
        {profile.bio.map((paragraph, index) => (
          <p key={index} className={bioText}>
            {renderBioText(paragraph)}
          </p>
        ))}
        <div className={linksRow}>
          <a className={linkItem} href={`mailto:${profile.links.email}`}>
            email
          </a>
          <a className={linkItem} href={profile.links.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a className={linkItem} href={profile.links.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
        </div>
      </div>
      <div className={portraitSlot}>
        <div className={portraitFrame}>
          <img
            src={profile.photoUrl}
            alt="Akshith Katkuri"
            className={portraitImage}
            loading="eager"
            width={180}
            height={180}
          />
        </div>
      </div>
    </div>
  </header>
);
