import type { JSX } from "preact";
import {
  aboutGrid,
  aboutText,
  copyCol,
  highlightPill,
  portraitFrame,
  portraitImage,
  portraitSlot,
  sectionContainer,
  sectionHeading,
  slashPrefix,
} from "./about.css";

type AboutProps = {
  readonly text: string;
};

const renderTextWithPills = (text: string): (string | JSX.Element)[] => {
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

export const About = ({ text }: AboutProps): JSX.Element => (
  <section id="about" className={sectionContainer}>
    <h2 className={sectionHeading}>
      <span className={slashPrefix}>{"// "}</span>
      {"about"}
    </h2>
    <div className={aboutGrid}>
      <div className={copyCol}>
        <p className={aboutText}>{renderTextWithPills(text)}</p>
      </div>
      <div className={portraitSlot}>
        <div className={portraitFrame}>
          <img
            src="/fightclub.jpg"
            alt="Fight Club"
            className={portraitImage}
            loading="lazy"
            width={200}
            height={200}
          />
        </div>
      </div>
    </div>
  </section>
);
