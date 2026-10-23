import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const pageContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
});

export const backLink = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.foam,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
  marginBottom: vars.space.md,
  ":hover": {
    color: vars.color.linkHover,
    textDecoration: "underline",
  },
});

export const projectHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: vars.space.lg,
  marginBottom: vars.space.md,
});

export const projectTitle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXl,
  fontWeight: 700,
  color: vars.color.text,
  margin: 0,
});

export const terminalCommand = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.muted,
  marginBottom: vars.space.sm,
  userSelect: "none",
});

export const proseSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const proseHeading = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeLg,
  fontWeight: 600,
  color: vars.color.iris,
  margin: `${vars.space.lg} 0 ${vars.space.xs} 0`,
});

export const proseParagraph = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
  lineHeight: vars.typography.lineHeightBase,
  color: vars.color.text,
  margin: 0,
});

export const proseList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  paddingLeft: vars.space.lg,
  margin: 0,
});

export const proseListItem = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  lineHeight: vars.typography.lineHeightBase,
  color: vars.color.text,
});
