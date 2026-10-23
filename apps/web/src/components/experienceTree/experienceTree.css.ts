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

export const treeList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.xs,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const treeNode = style({
  display: "flex",
  alignItems: "baseline",
  gap: vars.space.sm,
  flexWrap: "wrap",
});

export const treeBranch = style({
  color: vars.color.muted,
  userSelect: "none",
});

export const treePeriod = style({
  color: vars.color.subtle,
  minWidth: "160px",
});

export const treeDetails = style({
  color: vars.color.text,
});

export const treeRole = style({
  color: vars.color.foam,
});
