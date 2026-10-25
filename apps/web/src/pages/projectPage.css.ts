import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const pageContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xl,
});

export const backLink = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.accent,
  textDecoration: "underline",
  textUnderlineOffset: "4px",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
  marginBottom: vars.space.md,
  ":hover": {
    color: vars.color.linkHover,
  },
});

export const projectHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: vars.space.xl,
});

export const terminalCommand = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.muted,
  marginBottom: vars.space.xs,
  userSelect: "none",
});

export const projectTitle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXl,
  fontWeight: 700,
  color: vars.color.text,
  margin: 0,
});

export const projectMeta = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.subtle,
  margin: 0,
});

export const externalLinksRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
  marginTop: vars.space.xs,
});

export const externalLink = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.accent,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  fontWeight: 600,
  ":hover": {
    color: vars.color.linkHover,
  },
});

export const techLine = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.muted,
  marginTop: vars.space.xs,
});

export const proseSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.lg,
  marginTop: vars.space.md,
});

export const proseHeading = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeMd,
  fontWeight: 600,
  color: vars.color.accent,
  margin: `0 0 ${vars.space.xs} 0`,
});

export const proseParagraph = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
  lineHeight: "2.0",
  color: vars.color.text,
  margin: 0,
});

export const proseList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const proseListItem = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.sm,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  lineHeight: "1.8",
  color: vars.color.text,
});

export const bulletMarker = style({
  color: vars.color.accent,
  flexShrink: 0,
  userSelect: "none",
});

export const highlightPill = style({
  display: "inline",
  padding: "2px 6px",
  backgroundColor: vars.color.pillBg,
  color: vars.color.pillText,
  borderRadius: vars.radii.sm,
  fontWeight: 600,
  boxDecorationBreak: "clone",
  WebkitBoxDecorationBreak: "clone",
});
