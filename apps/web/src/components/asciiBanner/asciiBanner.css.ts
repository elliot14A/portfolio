import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const bannerStyle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: "clamp(5.5px, 1.8vw, 11px)",
  lineHeight: 1.15,
  color: vars.color.accent,
  margin: `${vars.space.sm} 0 ${vars.space.lg} 0`,
  whiteSpace: "pre",
  userSelect: "none",
  letterSpacing: "-0.01em",
  maxWidth: "100%",
  overflowX: "hidden",
});
