import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const errorContainer = style({
  maxWidth: vars.space.containerMax,
  margin: "80px auto",
  padding: `0 ${vars.space.md}`,
  fontFamily: vars.typography.fontMono,
});

export const errorPrompt = style({
  color: vars.color.accent,
  fontSize: vars.typography.sizeSm,
  marginBottom: vars.space.md,
});

export const errorHeading = style({
  color: vars.color.text,
  fontSize: vars.typography.sizeXl,
  margin: `${vars.space.md} 0 ${vars.space.sm} 0`,
  fontWeight: 600,
});

export const errorDescription = style({
  color: vars.color.subtle,
  lineHeight: vars.typography.lineHeightBase,
  fontSize: vars.typography.sizeBase,
});

export const backLink = style({
  display: "inline-block",
  marginTop: vars.space.xl,
  color: vars.color.accent,
  textDecoration: "underline",
  textUnderlineOffset: "4px",
  ":hover": {
    color: vars.color.linkHover,
  },
});
