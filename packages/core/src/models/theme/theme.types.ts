import { THEMES } from "./theme.constants";

type CoreColor =
  | "base"
  | "mantle"
  | "crust"
  | "text"
  | "subtext1"
  | "subtext0"
  | "overlay2"
  | "overlay1"
  | "overlay0"
  | "surface2"
  | "surface1"
  | "surface0";

type NamedColor =
  | "rosewater"
  | "flamingo"
  | "pink"
  | "mauve"
  | "red"
  | "maroon"
  | "peach"
  | "yellow"
  | "green"
  | "teal"
  | "sky"
  | "sapphire"
  | "blue"
  | "lavender";

export type ThemeId = (typeof THEMES)[number];
export type ThemeColor = CoreColor | NamedColor;
