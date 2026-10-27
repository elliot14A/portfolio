import type { Profile } from "@portfolio/content";
import type { JSX } from "preact";
import {
  footerNotice,
  keyCell,
  kvRow,
  kvTable,
  link,
  sectionContainer,
  sectionHeading,
  slashPrefix,
  valueCell,
} from "./contact.css";

type ContactProps = {
  readonly profile: Profile;
};

export const Contact = ({ profile }: ContactProps): JSX.Element => (
  <section id="contact" className={sectionContainer}>
    <h2 className={sectionHeading}>
      <span className={slashPrefix}>{"// "}</span>
      {"contact"}
    </h2>
    <table className={kvTable}>
      <tbody>
        <tr className={kvRow}>
          <td className={keyCell}>email</td>
          <td className={valueCell}>
            <a className={link} href={`mailto:${profile.links.email}`}>
              {profile.links.email}
            </a>
          </td>
        </tr>
        <tr className={kvRow}>
          <td className={keyCell}>linkedin</td>
          <td className={valueCell}>
            <a className={link} href={profile.links.linkedin} target="_blank" rel="noreferrer">
              {profile.links.linkedin.replace(/^https?:\/\//, "")}
            </a>
          </td>
        </tr>
        <tr className={kvRow}>
          <td className={keyCell}>github</td>
          <td className={valueCell}>
            <a className={link} href={profile.links.github} target="_blank" rel="noreferrer">
              {profile.links.github.replace(/^https?:\/\//, "")}
            </a>
          </td>
        </tr>
        {profile.links.resume && (
          <tr className={kvRow}>
            <td className={keyCell}>resume</td>
            <td className={valueCell}>
              <a className={link} href={profile.links.resume} target="_blank" rel="noreferrer">
                resume.pdf
              </a>
            </td>
          </tr>
        )}
        <tr className={kvRow}>
          <td className={keyCell}>based</td>
          <td className={valueCell}>{profile.location}</td>
        </tr>
      </tbody>
    </table>
    <footer className={footerNotice}>{"© 2026 elliot14a · hyderabad, in"}</footer>
  </section>
);
