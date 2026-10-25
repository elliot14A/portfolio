import { globalFontFace, globalStyle, style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

globalFontFace("JetBrains Mono", {
  src: 'url("/fonts/JetBrainsMono-Regular.woff2") format("woff2")',
  fontWeight: "normal",
  fontStyle: "normal",
  fontDisplay: "swap",
});

globalFontFace("JetBrains Mono", {
  src: 'url("/fonts/JetBrainsMono-Bold.woff2") format("woff2")',
  fontWeight: "bold",
  fontStyle: "normal",
  fontDisplay: "swap",
});

globalFontFace("JetBrains Mono", {
  src: 'url("/fonts/JetBrainsMono-Italic.woff2") format("woff2")',
  fontWeight: "normal",
  fontStyle: "italic",
  fontDisplay: "swap",
});

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  backgroundColor: vars.color.base,
  color: vars.color.text,
  fontFamily: vars.typography.fontMono,
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  overflowX: "hidden",
  width: "100%",
  maxWidth: "100%",
});

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

globalStyle("a", {
  color: "inherit",
});

globalStyle("::selection", {
  backgroundColor: vars.color.accent,
  color: vars.color.base,
});

globalStyle("#crt", {
  position: "fixed",
  inset: 0,
  zIndex: 40,
  pointerEvents: "none",
  background:
    "repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.022) 0 1px, transparent 1px 3px)",
});

globalStyle("#crt::after", {
  content: '""',
  position: "absolute",
  inset: 0,
  boxShadow: "inset 0 0 160px rgba(0, 0, 0, 0.65)",
});

export const layoutContainer = style({
  maxWidth: vars.space.containerMax,
  margin: "0 auto",
  padding: `${vars.space.xxl} ${vars.space.md} 80px ${vars.space.md}`,
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
  overflowX: "hidden",
  "@media": {
    "(max-width: 640px)": {
      padding: `${vars.space.xl} 16px 80px 16px`,
    },
  },
});
