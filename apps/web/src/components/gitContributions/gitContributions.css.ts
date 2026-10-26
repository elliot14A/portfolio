import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const sectionContainer = style({
  marginBottom: vars.space.xxl,
  width: "100%",
  boxSizing: "border-box",
});

export const sectionHeading = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeMd,
  fontWeight: 600,
  color: vars.color.text,
  marginBottom: vars.space.md,
});

export const slashPrefix = style({
  color: vars.color.iris,
});

export const scrollArea = style({
  width: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  paddingBottom: "8px",
  touchAction: "pan-x",
  boxSizing: "border-box",
  selectors: {
    "&::-webkit-scrollbar": {
      height: "4px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: vars.color.highlightMed,
      borderRadius: vars.radii.sm,
    },
  },
});

export const gridWrapper = style({
  display: "flex",
  flexDirection: "column",
  width: "max-content",
  gap: "8px",
});

export const cgGrid = style({
  display: "grid",
  gridTemplateColumns: "3ch repeat(53, 14px)",
  gap: "4px",
  width: "max-content",
  "@media": {
    "(max-width: 640px)": {
      gridTemplateColumns: "3ch repeat(53, 11px)",
      gap: "3px",
    },
  },
});

export const monthSpans = [
  style({ gridColumn: "span 1" }),
  style({ gridColumn: "span 1" }),
  style({ gridColumn: "span 2" }),
  style({ gridColumn: "span 3" }),
  style({ gridColumn: "span 4" }),
  style({ gridColumn: "span 5" }),
  style({ gridColumn: "span 6" }),
  style({ gridColumn: "span 7" }),
  style({ gridColumn: "span 8" }),
] as const;

export const cgCorner = style({
  color: vars.color.muted,
  fontSize: vars.typography.sizeSm,
  fontFamily: vars.typography.fontMono,
  lineHeight: "1",
  userSelect: "none",
});

export const cgMonth = style({
  color: vars.color.muted,
  fontSize: vars.typography.sizeSm,
  fontFamily: vars.typography.fontMono,
  lineHeight: "1",
  textAlign: "left",
  overflow: "hidden",
  whiteSpace: "nowrap",
  userSelect: "none",
});

export const cgWeekday = style({
  color: vars.color.muted,
  fontSize: vars.typography.sizeSm,
  fontFamily: vars.typography.fontMono,
  lineHeight: "1",
  alignSelf: "center",
  textAlign: "right",
  paddingRight: "4px",
  userSelect: "none",
});

export const cgCell = style({
  display: "block",
  width: "14px",
  height: "14px",
  borderRadius: vars.radii.sm,
  transition: "transform 0.1s ease",
  "@media": {
    "(max-width: 640px)": {
      width: "11px",
      height: "11px",
    },
  },
  selectors: {
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
});

export const cgGap = style({
  background: "transparent",
});

export const cgLevel0 = style({
  background: vars.color.highlightMed,
});

export const cgLevel1 = style({
  background: vars.color.iris,
  opacity: 0.25,
});

export const cgLevel2 = style({
  background: vars.color.iris,
  opacity: 0.5,
});

export const cgLevel3 = style({
  background: vars.color.iris,
  opacity: 0.75,
});

export const cgLevel4 = style({
  background: vars.color.iris,
});

export const cgFoot = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginTop: "4px",
  color: vars.color.muted,
  fontSize: vars.typography.sizeXs,
  fontFamily: vars.typography.fontMono,
});

export const cgCount = style({
  color: vars.color.subtle,
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
});

export const cgBadge = style({
  color: vars.color.gold,
});

export const cgLegend = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  userSelect: "none",
});

export const cgLegendCell = style({
  display: "block",
  width: "11px",
  height: "11px",
  borderRadius: vars.radii.sm,
});
