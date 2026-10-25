import type { ExperienceItem, Profile, SelectedWorkItem } from "@portfolio/content";
import type { JSX } from "preact";
import { About } from "../components/about";
import { Contact } from "../components/contact";
import { DogAscii } from "../components/dogAscii";
import { ExperienceTree } from "../components/experienceTree";
import { Hero } from "../components/hero";
import { SelectedWork } from "../components/selectedWork";
import { StatusBar } from "../components/statusBar";
import { PageLayout } from "../layout";

type HomePageProps = {
  readonly profile: Profile;
  readonly selectedWork: readonly SelectedWorkItem[];
  readonly experience: readonly ExperienceItem[];
};

export const HomePage = ({ profile, selectedWork, experience }: HomePageProps): JSX.Element => (
  <PageLayout>
    <Hero profile={profile} />
    <SelectedWork items={selectedWork} />
    <About text={profile.about} />
    <ExperienceTree items={experience} />
    <DogAscii />
    <Contact profile={profile} />
    <StatusBar />
  </PageLayout>
);
