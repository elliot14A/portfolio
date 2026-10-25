import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const sbarContainer = style({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 60,
  display: "flex",
  gap: "14px",
  alignItems: "center",
  padding: "8px 16px",
  fontSize: "12px",
  letterSpacing: "0.06em",
  color: vars.color.muted,
  backgroundColor: "rgba(4, 4, 7, 0.88)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  borderTop: `1px solid ${vars.color.border}`,
  fontFamily: vars.typography.fontMono,
});

export const host = style({
  color: vars.color.accent,
  "@media": {
    "(max-width: 440px)": {
      display: "none",
    },
  },
});

export const section = style({
  color: vars.color.text,
});

export const rightSide = style({
  marginLeft: "auto",
  display: "flex",
  gap: "10px",
  alignItems: "center",
  whiteSpace: "nowrap",
});

export const meter = style({
  color: vars.color.accent,
  letterSpacing: 0,
});

export const percentage = style({
  color: vars.color.muted,
});

export const clock = style({
  color: vars.color.subtle,
});
