import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  backgroundColor: vars.color.base,
  color: vars.color.text,
  fontFamily: vars.typography.fontMono,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
});

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

globalStyle("a", {
  color: "inherit",
});

export const layoutContainer = style({
  maxWidth: vars.space.containerMax,
  margin: "0 auto",
  padding: `${vars.space.xl} ${vars.space.md}`,
  minHeight: "100vh",
});
