import type { ComponentChildren, JSX } from "preact";
import { layoutContainer } from "./pageLayout.css";

type PageLayoutProps = {
  readonly children: ComponentChildren;
};

export const PageLayout = ({ children }: PageLayoutProps): JSX.Element => (
  <main className={layoutContainer}>{children}</main>
);
