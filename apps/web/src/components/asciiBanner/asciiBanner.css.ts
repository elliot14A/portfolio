import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const bannerWrapper = style({
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  touchAction: "pan-y",
});

export const bannerStyle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: "clamp(3.5px, 2.25vw, 11px)",
  lineHeight: 1.15,
  color: vars.color.accent,
  margin: `${vars.space.sm} 0 ${vars.space.lg} 0`,
  whiteSpace: "pre",
  userSelect: "none",
  WebkitUserSelect: "none",
  letterSpacing: "-0.01em",
  maxWidth: "100%",
  boxSizing: "border-box",
  overflow: "hidden",
  touchAction: "pan-y",
  WebkitTextSizeAdjust: "none",
  "@media": {
    "(max-width: 640px)": {
      fontSize: "clamp(3.5px, 2.2vw, 8.5px)",
      margin: `${vars.space.xs} 0 ${vars.space.md} 0`,
    },
  },
});
