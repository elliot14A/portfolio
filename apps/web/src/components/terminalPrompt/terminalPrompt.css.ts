import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const promptStyle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.muted,
  marginBottom: vars.space.md,
  userSelect: "none",
});

export const userStyle = style({
  color: vars.color.iris,
});

export const commandStyle = style({
  color: vars.color.text,
  fontWeight: 600,
});
