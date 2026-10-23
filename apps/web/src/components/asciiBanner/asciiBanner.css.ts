import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const bannerStyle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeXs,
  lineHeight: 1.15,
  color: vars.color.iris,
  margin: `${vars.space.sm} 0 ${vars.space.md} 0`,
  whiteSpace: "pre",
  overflowX: "auto",
  userSelect: "none",
  letterSpacing: "0.05em",
});
