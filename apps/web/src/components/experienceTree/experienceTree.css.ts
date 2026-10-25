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

export const experienceList = style({
  display: "flex",
  flexDirection: "column",
});

export const companyBlock = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.xl,
  padding: `${vars.space.xl} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  "@media": {
    "(max-width: 640px)": {
      flexDirection: "column",
      gap: vars.space.sm,
    },
  },
});

export const periodCol = style({
  color: vars.color.accent,
  minWidth: "120px",
  flexShrink: 0,
  fontSize: vars.typography.sizeSm,
});

export const contentCol = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  flexGrow: 1,
});

export const companyName = style({
  color: vars.color.text,
  fontWeight: 600,
  fontSize: vars.typography.sizeBase,
});

export const roleRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  color: vars.color.subtle,
  fontSize: vars.typography.sizeSm,
  lineHeight: vars.typography.lineHeightBase,
});

export const branchSymbol = style({
  color: vars.color.muted,
  userSelect: "none",
});

export const roleTitle = style({
  color: vars.color.subtle,
});
