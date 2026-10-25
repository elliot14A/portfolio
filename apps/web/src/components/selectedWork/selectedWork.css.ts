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

export const workList = style({
  display: "flex",
  flexDirection: "column",
});

export const itemContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  padding: `${vars.space.xl} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const itemHeader = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: vars.space.xs,
  "@media": {
    "(max-width: 640px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: vars.space.xs,
    },
  },
});

export const itemTitle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeMd,
  fontWeight: 600,
  color: vars.color.text,
});

export const itemNumber = style({
  color: vars.color.accent,
  marginRight: vars.space.sm,
});

export const itemMeta = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  color: vars.color.subtle,
  letterSpacing: "0.05em",
});

export const itemSummary = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
  lineHeight: "2.1",
  color: vars.color.subtle,
  margin: 0,
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

export const viewProjectLink = style({
  alignSelf: "flex-start",
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.text,
  textDecoration: "none",
  marginTop: vars.space.xs,
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
});

export const arrowPrefix = style({
  color: vars.color.accent,
});

export const linkText = style({
  textDecoration: "underline",
  textUnderlineOffset: "4px",
  ":hover": {
    color: vars.color.linkHover,
  },
});
