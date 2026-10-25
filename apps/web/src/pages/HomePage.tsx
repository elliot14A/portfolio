import type { Profile } from "@portfolio/content";
import type { JSX } from "preact";
import { Contact } from "../components/contact";
import { ExperienceTimeline } from "../components/experienceTimeline";
import { Hero } from "../components/hero";
import { PersonalProjects } from "../components/personalProjects";
import { StatusBar } from "../components/statusBar";
import { Toolbox } from "../components/toolbox";
import { PageLayout } from "../layout";

type HomePageProps = {
  readonly profile: Profile;
};

export const HomePage = ({ profile }: HomePageProps): JSX.Element => (
  <PageLayout>
    <Hero profile={profile} />
    <Toolbox items={profile.toolbox} />
    <ExperienceTimeline roles={profile.experience} />
    <PersonalProjects projects={profile.personalProjects} />
    <Contact profile={profile} />
    <StatusBar />
  </PageLayout>
);
