import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const sectionContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  marginBottom: vars.space.xxl,
});

export const sectionHeading = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.accent,
  margin: 0,
});

export const slashPrefix = style({
  color: vars.color.accent,
});

export const toolboxTable = style({
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  lineHeight: "1.8",
  "@media": {
    "(max-width: 640px)": {
      display: "block",
    },
  },
});

export const toolboxRow = style({
  verticalAlign: "top",
  "@media": {
    "(max-width: 640px)": {
      display: "flex",
      flexDirection: "column",
      marginBottom: vars.space.sm,
    },
  },
});

export const categoryCol = style({
  color: vars.color.muted,
  whiteSpace: "nowrap",
  width: "1%",
  padding: "8px 48px 8px 0",
  verticalAlign: "top",
  letterSpacing: "0.02em",
  "@media": {
    "(max-width: 640px)": {
      padding: "0 0 2px 0",
      width: "100%",
    },
  },
});

export const itemsCol = style({
  color: vars.color.text,
  padding: "8px 0",
  verticalAlign: "top",
  "@media": {
    "(max-width: 640px)": {
      padding: "0 0 8px 0",
    },
  },
});
