import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const sectionContainer = style({
  margin: `${vars.space.xl} 0`,
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

export const aboutGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: vars.space.xl,
  alignItems: "start",
  "@media": {
    "(min-width: 680px)": {
      gridTemplateColumns: "1.8fr 1fr",
    },
  },
});

export const copyCol = style({
  minWidth: 0,
});

export const aboutText = style({
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

export const portraitSlot = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "@media": {
    "(min-width: 680px)": {
      justifyContent: "flex-end",
    },
  },
});

export const portraitFrame = style({
  position: "relative",
  width: "min(200px, 60vw)",
  aspectRatio: "1 / 1",
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radii.md,
  overflow: "hidden",
  background: vars.color.surface,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const portraitImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
  filter: "contrast(1.05) brightness(0.95)",
});
