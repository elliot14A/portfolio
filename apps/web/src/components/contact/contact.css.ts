import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const sectionContainer = style({
  margin: `${vars.space.xl} 0 0 0`,
});

export const sectionHeading = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.accent,
  letterSpacing: "0.06em",
  margin: `0 0 ${vars.space.md} 0`,
  fontWeight: 500,
});

export const slashPrefix = style({
  color: vars.color.accent,
});

export const kvTable = style({
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
});

export const kvRow = style({
  borderTop: `1px solid ${vars.color.border}`,
  ":first-child": {
    borderTop: "none",
  },
});

export const keyCell = style({
  padding: "12px 24px 12px 0",
  verticalAlign: "top",
  color: vars.color.accent,
  whiteSpace: "nowrap",
  width: "1%",
  fontWeight: 500,
});

export const valueCell = style({
  padding: "12px 0",
  verticalAlign: "top",
  color: vars.color.text,
});

export const link = style({
  color: vars.color.accent,
  textDecoration: "underline",
  textUnderlineOffset: "4px",
  ":hover": {
    color: vars.color.linkHover,
  },
});

export const footerNotice = style({
  marginTop: vars.space.xl,
  padding: `${vars.space.lg} 0 ${vars.space.xxl} 0`,
  color: vars.color.muted,
  fontSize: vars.typography.sizeXs,
  letterSpacing: "0.08em",
  textAlign: "center",
  fontFamily: vars.typography.fontMono,
});
