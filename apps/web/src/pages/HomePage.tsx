import type { Profile } from "@portfolio/content";
import type { JSX } from "preact";
import { AiAssistant } from "../components/aiAssistant";
import { Contact } from "../components/contact";
import { ExperienceTimeline } from "../components/experienceTimeline";
import { type ContributionGraph, GitContributions } from "../components/gitContributions";
import { Hero } from "../components/hero";
import { PersonalProjects } from "../components/personalProjects";
import { StatusBar } from "../components/statusBar";
import { Toolbox } from "../components/toolbox";
import { PageLayout } from "../layout";

type HomePageProps = {
  readonly profile: Profile;
  readonly contributions?: ContributionGraph;
};

export const HomePage = ({ profile, contributions }: HomePageProps): JSX.Element => (
  <PageLayout>
    <Hero profile={profile} />
    <GitContributions graph={contributions} />
    <Toolbox items={profile.toolbox} />
    <ExperienceTimeline roles={profile.experience} />
    <PersonalProjects projects={profile.personalProjects} />
    <Contact profile={profile} />
    <div id="ai-assistant-root">
      <AiAssistant />
    </div>
    <StatusBar />
  </PageLayout>
);
