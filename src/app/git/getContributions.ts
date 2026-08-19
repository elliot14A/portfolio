import type { AppResult } from "@/core/error";
import { type ContributionGraph, toGraph } from "@/core/git/contributions";
import type { FetchCalendar } from "@/core/git/ports";

export type GetContributionsDeps = Readonly<{ fetchCalendar: FetchCalendar }>;
export type GetContributions = () => Promise<AppResult<ContributionGraph>>;

export const makeGetContributions =
  (deps: GetContributionsDeps): GetContributions =>
  async () =>
    (await deps.fetchCalendar()).andThen(toGraph);
