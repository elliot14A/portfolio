import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const heroContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  marginBottom: vars.space.xxl,
});

export const roleBadge = style({
  alignSelf: "flex-start",
  display: "inline-block",
  padding: `4px ${vars.space.sm}`,
  backgroundColor: vars.color.badgeBg,
  color: vars.color.badgeText,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  borderRadius: vars.radii.sm,
  fontWeight: 600,
});

export const bioSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
});

export const bioText = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
  lineHeight: "2.1",
  color: vars.color.text,
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

export const linksRow = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: vars.space.lg,
  marginTop: vars.space.sm,
});

export const linkItem = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.accent,
  textDecoration: "underline",
  textUnderlineOffset: "4px",
  ":hover": {
    color: vars.color.linkHover,
  },
});
