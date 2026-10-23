import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const sectionContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  marginBottom: vars.space.xl,
});

export const sectionHeading = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.muted,
  margin: 0,
});

export const workList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const cardContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  padding: vars.space.md,
  backgroundColor: vars.color.surface,
  borderRadius: vars.radii.md,
  border: `1px solid ${vars.color.border}`,
  transition: "border-color 0.15s ease",
  ":hover": {
    borderColor: vars.color.borderHover,
  },
});

export const cardHeader = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.space.sm,
  flexWrap: "wrap",
});

export const cardTitle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeMd,
  fontWeight: 600,
  color: vars.color.text,
});

export const cardNumber = style({
  color: vars.color.iris,
  marginRight: vars.space.xs,
});

export const cardMeta = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  color: vars.color.subtle,
  letterSpacing: "0.05em",
});

export const cardSummary = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  lineHeight: vars.typography.lineHeightBase,
  color: vars.color.text,
  margin: 0,
});

export const highlightsContainer = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.xs,
  marginTop: vars.space.xs,
});

export const highlightBadge = style({
  display: "inline-block",
  padding: `2px ${vars.space.sm}`,
  backgroundColor: vars.color.pillBg,
  color: vars.color.pillText,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  borderRadius: vars.radii.sm,
});

export const viewProjectLink = style({
  alignSelf: "flex-start",
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.foam,
  textDecoration: "none",
  marginTop: vars.space.xs,
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.xs,
  ":hover": {
    color: vars.color.linkHover,
    textDecoration: "underline",
  },
});
