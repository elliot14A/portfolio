import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/tokens.css";

export const promptStyle = style({
  fontFamily: vars.typography.fontMono,
  fontSize: vars.typography.sizeSm,
  color: vars.color.muted,
  marginBottom: vars.space.md,
  userSelect: "none",
  maxWidth: "100%",
  overflowWrap: "break-word",
  "@media": {
    "(max-width: 640px)": {
      fontSize: vars.typography.sizeXs,
      marginBottom: vars.space.sm,
    },
  },
});

export const userStyle = style({
  color: vars.color.accent,
});

export const commandStyle = style({
  color: vars.color.text,
  fontWeight: 600,
});
