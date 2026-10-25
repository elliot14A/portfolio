import type { JSX } from "preact";
import {
  backLink,
  errorContainer,
  errorDescription,
  errorHeading,
  errorPrompt,
} from "./errorPage.css";

type ErrorPageProps = {
  readonly statusCode: 404 | 500;
  readonly message: string;
};

export const ErrorPage = ({ statusCode, message }: ErrorPageProps): JSX.Element => (
  <main className={errorContainer}>
    <p className={errorPrompt}>{`[elliot14a@portfolio] % status ${statusCode}`}</p>
    <h1 className={errorHeading}>
      {statusCode === 404 ? "Resource Not Found" : "Internal Server Error"}
    </h1>
    <p className={errorDescription}>{message}</p>
    <a className={backLink} href="/">
      {"← return to terminal root"}
    </a>
  </main>
);
