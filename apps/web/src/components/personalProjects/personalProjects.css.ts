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

export const projectList = style({
  display: "flex",
  flexDirection: "column",
});

export const projectBlock = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.xl,
  padding: `${vars.space.xl} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  "@media": {
    "(max-width: 680px)": {
      flexDirection: "column",
      gap: vars.space.sm,
    },
  },
});

export const nameCol = style({
  minWidth: "160px",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  "@media": {
    "(max-width: 680px)": {
      minWidth: 0,
      width: "100%",
    },
  },
});

export const projectName = style({
  color: vars.color.accent,
  fontWeight: 600,
  fontSize: vars.typography.sizeBase,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  ":hover": {
    color: vars.color.linkHover,
  },
});

export const projectLinks = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  fontSize: vars.typography.sizeXs,
});

export const smallLink = style({
  color: vars.color.muted,
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  ":hover": {
    color: vars.color.accent,
  },
});

export const contentCol = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  flexGrow: 1,
  minWidth: 0,
});

export const projectDesc = style({
  color: vars.color.text,
  fontSize: vars.typography.sizeSm,
  lineHeight: "1.8",
  margin: 0,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
});

export const bulletList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const bulletItem = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.sm,
  color: vars.color.subtle,
  fontSize: vars.typography.sizeSm,
  lineHeight: "1.7",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
});

export const bulletMarker = style({
  color: vars.color.muted,
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
