import { err, ResultAsync } from "neverthrow";
import { parseCalendar } from "@/core/git/contributions";
import type { FetchCalendar } from "@/core/git/ports";
import type { GithubConfig } from "@/infra/config";
import { badStatus, unreachable } from "@/infra/git/error";

// GitHub rejects requests without one; it is a fixed identity, not a knob.
const USER_AGENT = "portfolio-worker";

// `weekday` comes back per day, so the leading and trailing partial weeks land
// in the right rows without any date parsing.
const QUERY =
  "query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date weekday contributionCount}}}}}}";

export const makeFetchCalendar =
  (config: GithubConfig): FetchCalendar =>
  async () => {
    const response = await ResultAsync.fromPromise(
      fetch(config.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `bearer ${config.token}`,
          "Content-Type": "application/json",
          "User-Agent": USER_AGENT,
        },
        body: JSON.stringify({
          query: QUERY,
          variables: { login: config.login },
        }),
      }),
      unreachable,
    );
    if (response.isErr()) return err(response.error);
    if (!response.value.ok) return err(badStatus(response.value.status));

    const body = await ResultAsync.fromPromise(
      response.value.json(),
      unreachable,
    );
    return body.isErr() ? err(body.error) : parseCalendar(body.value);
  };
