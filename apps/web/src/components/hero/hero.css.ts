import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const heroContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  marginBottom: vars.space.xl,
});

export const roleBadge = style({
  alignSelf: "flex-start",
  display: "inline-block",
  padding: `${vars.space.xs} ${vars.space.sm}`,
  backgroundColor: vars.color.badgeBg,
  color: vars.color.badgeText,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  borderRadius: vars.radii.sm,
  fontWeight: 500,
  border: `1px solid ${vars.color.badgeBg}`,
});

export const bioText = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
  lineHeight: vars.typography.lineHeightBase,
  color: vars.color.text,
  margin: 0,
});

export const highlightPill = style({
  display: "inline-block",
  padding: `0 ${vars.space.xs}`,
  backgroundColor: vars.color.pillBg,
  color: vars.color.pillText,
  borderRadius: vars.radii.sm,
});

export const linksRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: vars.space.md,
  marginTop: vars.space.xs,
});

export const linksList = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const linkItem = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.foam,
  textDecoration: "none",
  ":hover": {
    color: vars.color.linkHover,
    textDecoration: "underline",
  },
});
