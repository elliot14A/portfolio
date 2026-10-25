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

export const roleList = style({
  display: "flex",
  flexDirection: "column",
});

export const roleBlock = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.xl,
  padding: `${vars.space.xl} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  "@media": {
    "(max-width: 680px)": {
      flexDirection: "column",
      gap: vars.space.sm,
    },
  },
});

export const periodCol = style({
  color: vars.color.accent,
  minWidth: "160px",
  flexShrink: 0,
  fontSize: vars.typography.sizeSm,
  letterSpacing: "0.02em",
});

export const contentCol = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.md,
  flexGrow: 1,
});

export const roleHeader = style({
  display: "flex",
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: vars.space.sm,
});

export const roleTitle = style({
  color: vars.color.text,
  fontWeight: 600,
  fontSize: vars.typography.sizeBase,
});

export const roleSeparator = style({
  color: vars.color.muted,
});

export const companyName = style({
  color: vars.color.subtle,
  fontWeight: 500,
});

export const bulletList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.space.sm,
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const bulletItem = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space.sm,
  color: vars.color.text,
  fontSize: vars.typography.sizeSm,
  lineHeight: "1.9",
});

export const bulletMarker = style({
  color: vars.color.muted,
  flexShrink: 0,
  userSelect: "none",
});

export const bulletContent = style({
  flexGrow: 1,
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

export const hoverCardContainer = style({
  position: "relative",
  display: "inline-block",
});

export const projectLink = style({
  color: vars.color.accent,
  fontWeight: 600,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  cursor: "pointer",
  transition: "color 0.2s ease",
  ":hover": {
    color: vars.color.linkHover,
  },
});

export const hoverCardPopup = style({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%) translateY(4px)",
  opacity: 0,
  visibility: "hidden",
  pointerEvents: "none",
  transition:
    "opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
  backgroundColor: vars.color.overlay,
  border: `1px solid ${vars.color.borderHover}`,
  borderRadius: vars.radii.sm,
  boxShadow: "0 10px 30px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(196, 167, 231, 0.15)",
  padding: "8px 12px",
  minWidth: "220px",
  maxWidth: "320px",
  zIndex: 99,
  display: "flex",
  flexDirection: "column",
  gap: "3px",
  selectors: {
    [`${hoverCardContainer}:hover &`]: {
      opacity: 1,
      visibility: "visible",
      transform: "translateX(-50%) translateY(0)",
    },
  },
  "@media": {
    "(max-width: 640px)": {
      left: "0",
      transform: "translateX(0) translateY(4px)",
      maxWidth: "260px",
      selectors: {
        [`${hoverCardContainer}:hover &`]: {
          transform: "translateX(0) translateY(0)",
        },
      },
    },
  },
});

export const hoverCardHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.xs,
});

export const hoverCardTitle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  fontWeight: 700,
  color: vars.color.accent,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
});

export const hoverCardArrowIcon = style({
  color: vars.color.muted,
  fontSize: vars.typography.sizeXs,
});

export const hoverCardDesc = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  color: vars.color.text,
  lineHeight: "1.5",
  margin: 0,
});

export const hoverCardArrow = style({
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  width: 0,
  height: 0,
  borderLeft: "5px solid transparent",
  borderRight: "5px solid transparent",
  borderTop: `5px solid ${vars.color.borderHover}`,
  "@media": {
    "(max-width: 640px)": {
      left: "20px",
      transform: "translateX(0)",
    },
  },
});
