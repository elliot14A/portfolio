import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const triggerButton = style({
  position: "fixed",
  bottom: "44px",
  right: "24px",
  zIndex: 70,
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 14px",
  background: vars.color.surface,
  border: `1px solid ${vars.color.highlightMed}`,
  borderRadius: vars.radii.md,
  color: vars.color.text,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  cursor: "pointer",
  transition: "border-color 0.1s ease",
  selectors: {
    "&:hover": {
      borderColor: vars.color.iris,
    },
  },
  "@media": {
    "screen and (max-width: 640px)": {
      bottom: "44px",
      right: "12px",
      padding: "6px 12px",
      fontSize: vars.typography.sizeXs,
      minHeight: "36px",
    },
  },
});

export const triggerDot = style({
  width: "6px",
  height: "6px",
  borderRadius: vars.radii.sm,
  background: vars.color.iris,
});

export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  backgroundColor: vars.color.scrim,
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: vars.space.md,
  "@media": {
    "screen and (max-width: 640px)": {
      padding: "8px",
      alignItems: "flex-end",
    },
  },
});

export const backdropDismiss = style({
  position: "absolute",
  inset: 0,
  background: "transparent",
  border: "none",
  cursor: "default",
  width: "100%",
  height: "100%",
  padding: 0,
  margin: 0,
});

export const modal = style({
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: "700px",
  maxHeight: "82vh",
  background: vars.color.base,
  border: `1px solid ${vars.color.highlightMed}`,
  borderRadius: vars.radii.lg,
  boxShadow: `0 24px 64px rgba(0, 0, 0, 0.95), 0 0 0 1px ${vars.color.border}`,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  fontFamily: vars.typography.fontMono,
  "@media": {
    "screen and (max-width: 640px)": {
      maxHeight: "85dvh",
      height: "85dvh",
      borderRadius: vars.radii.md,
    },
  },
});

export const modalHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 22px",
  borderBottom: `1px solid ${vars.color.highlightMed}`,
  background: vars.color.surface,
  fontSize: vars.typography.sizeSm,
});

export const headerTitle = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  color: vars.color.text,
  fontSize: vars.typography.sizeSm,
  fontWeight: 500,
});

export const slashPrefix = style({
  color: vars.color.iris,
});

export const headerActions = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const closeButton = style({
  background: "transparent",
  border: "none",
  color: vars.color.muted,
  fontSize: vars.typography.sizeXs,
  fontFamily: vars.typography.fontMono,
  cursor: "pointer",
  padding: "2px 6px",
  borderRadius: vars.radii.sm,
  transition: "color 0.12s ease",
  selectors: {
    "&:hover": {
      color: vars.color.text,
    },
  },
});

export const contentArea = style({
  flex: 1,
  padding: "22px 26px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  minHeight: "260px",
  maxHeight: "54vh",
  background: vars.color.base,
  "@media": {
    "screen and (max-width: 640px)": {
      padding: "14px 14px",
      gap: "14px",
      minHeight: 0,
      maxHeight: "none",
    },
  },
});

export const suggestionsBlock = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  margin: "auto 0",
});

export const suggestionsLabel = style({
  fontSize: vars.typography.sizeXs,
  color: vars.color.muted,
  margin: "0 0 10px 4px",
});

export const suggestionItem = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 10px",
  background: "transparent",
  border: "none",
  borderRadius: vars.radii.md,
  color: vars.color.text,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
  transition: "color 0.12s ease, background-color 0.12s ease",
  selectors: {
    "&:hover": {
      color: vars.color.iris,
      background: vars.color.accentMuted,
    },
  },
});

export const promptIndicator = style({
  color: vars.color.muted,
  flexShrink: 0,
  userSelect: "none",
  transition: "color 0.12s ease",
  selectors: {
    [`${suggestionItem}:hover &`]: {
      color: vars.color.iris,
    },
  },
});

export const userPromptLine = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  color: vars.color.iris,
  fontSize: vars.typography.sizeBase,
  fontWeight: 500,
  lineHeight: "1.7",
});

export const assistantOutput = style({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  fontSize: vars.typography.sizeBase,
  color: vars.color.text,
  lineHeight: "2.0",
});

export const outputParagraph = style({
  margin: 0,
});

export const outputBullet = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  margin: "4px 0",
});

export const bulletMarker = style({
  color: vars.color.muted,
  flexShrink: 0,
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

const blinkAnim = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0 },
});

export const streamingCursor = style({
  display: "inline-block",
  marginLeft: "3px",
  color: vars.color.iris,
  fontWeight: 700,
  lineHeight: 1,
  verticalAlign: "baseline",
  animation: `${blinkAnim} 0.8s infinite`,
});

export const inlineCode = style({
  fontFamily: vars.typography.fontMono,
  fontSize: "0.88em",
  padding: "2px 6px",
  background: vars.color.surface,
  border: `1px solid ${vars.color.highlightMed}`,
  borderRadius: vars.radii.sm,
  color: vars.color.rose,
});

export const codeBlock = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  padding: "12px 14px",
  background: vars.color.surface,
  border: `1px solid ${vars.color.highlightMed}`,
  borderRadius: vars.radii.md,
  overflowX: "auto",
  margin: "8px 0",
  color: vars.color.text,
  lineHeight: "1.6",
});

export const boldText = style({
  fontWeight: 700,
  color: vars.color.text,
});

export const outputHeading = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
  fontWeight: 600,
  color: vars.color.accent,
  margin: "14px 0 6px 0",
});

export const writeupLink = style({
  display: "inline",
  color: vars.color.accent,
  fontFamily: vars.typography.fontMono,
  fontSize: "inherit",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  cursor: "pointer",
  transition: "color 0.12s ease",
  selectors: {
    "&:hover": {
      color: vars.color.text,
    },
  },
});

export const inputArea = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px 22px",
  borderTop: `1px solid ${vars.color.highlightMed}`,
  background: vars.color.surface,
  "@media": {
    "screen and (max-width: 640px)": {
      padding: "10px 14px",
    },
  },
});

export const promptPrompt = style({
  color: vars.color.iris,
  fontSize: vars.typography.sizeBase,
  fontWeight: 600,
  userSelect: "none",
});

export const promptInput = style({
  flex: 1,
  background: "transparent",
  border: "none",
  color: vars.color.text,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeBase,
  outline: "none",
  selectors: {
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&::placeholder": {
      color: vars.color.muted,
      fontSize: vars.typography.sizeSm,
    },
  },
  "@media": {
    "screen and (max-width: 640px)": {
      fontSize: "16px",
    },
  },
});

export const errorNotice = style({
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.love,
  padding: "10px 14px",
  backgroundColor: "rgba(235, 111, 146, 0.08)",
  border: "1px solid rgba(235, 111, 146, 0.25)",
  borderRadius: vars.radii.sm,
  lineHeight: "1.5",
  margin: "4px 0",
  maxWidth: "100%",
  overflowWrap: "anywhere",
});

export const errorNoticePrefix = style({
  color: vars.color.love,
  fontWeight: 700,
  flexShrink: 0,
});

export const waitingIndicator = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: vars.color.subtle,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  padding: "4px 0",
});

export const referencesContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginTop: vars.space.xs,
  paddingTop: vars.space.sm,
  borderTop: `1px solid ${vars.color.highlightMed}`,
});

export const referencesLabel = style({
  fontSize: vars.typography.sizeXs,
  color: vars.color.muted,
  fontFamily: vars.typography.fontMono,
  letterSpacing: "0.04em",
});

export const referencesList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px 12px",
  alignItems: "center",
});

export const referenceLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  padding: "3px 7px",
  background: "transparent",
  border: "none",
  borderRadius: vars.radii.sm,
  color: vars.color.subtle,
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  textDecoration: "none",
  transition: "all 0.12s ease",
  selectors: {
    "&:hover": {
      backgroundColor: vars.color.accentMuted,
      color: vars.color.iris,
    },
  },
});

export const referenceArrow = style({
  color: vars.color.iris,
  opacity: 0.8,
});

export const referenceTitle = style({
  color: "inherit",
});

export const referenceExternalIcon = style({
  color: vars.color.muted,
  fontSize: "0.9em",
  opacity: 0.75,
  selectors: {
    [`${referenceLink}:hover &`]: {
      color: vars.color.iris,
      opacity: 1,
    },
  },
});
