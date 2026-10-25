import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

const travelAndTurn = keyframes({
  "0%": {
    left: "0%",
    transform: "translateY(-50%) scaleX(1)",
  },
  "49.9%": {
    left: "calc(100% - 90px)",
    transform: "translateY(-50%) scaleX(1)",
  },
  "50%": {
    left: "calc(100% - 90px)",
    transform: "translateY(-50%) scaleX(-1)",
  },
  "99.9%": {
    left: "0%",
    transform: "translateY(-50%) scaleX(-1)",
  },
  "100%": {
    left: "0%",
    transform: "translateY(-50%) scaleX(1)",
  },
});

const hop = keyframes({
  "0%, 100%": {
    transform: "translateY(0)",
  },
  "50%": {
    transform: "translateY(-6px)",
  },
});

export const critterContainer = style({
  position: "relative",
  height: "76px",
  margin: `${vars.space.xl} 0 ${vars.space.md} 0`,
  overflow: "hidden",
  userSelect: "none",
  width: "100%",
});

export const mover = style({
  position: "absolute",
  top: "50%",
  willChange: "left, transform",
  animation: `${travelAndTurn} 12s linear infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      left: "calc(50% - 45px)",
      transform: "translateY(-50%)",
    },
  },
});

export const dogArt = style({
  fontFamily: vars.typography.fontMono,
  fontSize: "13px",
  lineHeight: 1.15,
  color: vars.color.accent,
  whiteSpace: "pre",
  margin: 0,
  cursor: "pointer",
  animation: `${hop} 0.65s ease-in-out infinite`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export const dogButton = style({
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  color: "inherit",
  cursor: "pointer",
  textAlign: "left",
  display: "block",
});
