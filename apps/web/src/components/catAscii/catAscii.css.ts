import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const catStyle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  lineHeight: 1.2,
  color: vars.color.subtle,
  margin: 0,
  whiteSpace: "pre",
  userSelect: "none",
});
