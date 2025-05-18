import { ThemeDto } from "./theme.dto";

export const SEMANTIC_THEME_KEYS = [
  "base",
  "mantle",
  "crust",
  "text",
  "subtext0",
  "subtext1",
  "overlay0",
  "overlay1",
  "overlay2",
  "surface0",
  "surface1",
  "surface2",
] as const;

export const NAMED_THEME_KEYS = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
] as const;

export const ALIAS_THEME_KEYS = [
  "separatorAlias",
  "aiAlias",
  "authenticatedAlias",
  "anonymousAlias",
] as const;

export const THEME_KEYS = [
  ...SEMANTIC_THEME_KEYS,
  ...NAMED_THEME_KEYS,
  ...ALIAS_THEME_KEYS,
] as const;

export const DARK_THEME_ID = 1;
export const LIGHT_THEME_ID = 2;

export const DEFAULT_THEME_ID = DARK_THEME_ID;

export const DEFAULT_THEMES: Record<"dark" | "light", ThemeDto> = {
  dark: {
    id: DARK_THEME_ID,
    name: "dark",

    // Base
    base: "303446",
    mantle: "292c3c",
    crust: "232634",
    text: "c6d0f5",
    subtext0: "a5adce",
    subtext1: "b5bfe2",
    overlay0: "737994",
    overlay1: "838ba7",
    overlay2: "949cbb",
    surface0: "414559",
    surface1: "51576d",
    surface2: "626880",
    rosewater: "f2d5cf",
    flamingo: "eebebe",
    pink: "f4b8e4",
    mauve: "ca9ee6",
    red: "e78284",
    maroon: "ea999c",
    peach: "ef9f76",
    yellow: "e5c890",
    green: "a6d189",
    teal: "81c8be",
    sky: "99d1db",
    sapphire: "85c1dc",
    blue: "8caaee",
    lavender: "babbf1",

    // Alias
    separatorAlias: "mantle",
    aiAlias: "pink",
    authenticatedAlias: "yellow",
    anonymousAlias: "maroon",
  },
  light: {
    id: LIGHT_THEME_ID,
    name: "light",

    // Base
    base: "eff1f5",
    mantle: "e6e9ef",
    crust: "dce0e8",
    text: "4c4f69",
    subtext0: "6c6f85",
    subtext1: "5c5f77",
    overlay0: "9ca0b0",
    overlay1: "8c8fa1",
    overlay2: "7c7f93",
    surface0: "ccd0da",
    surface1: "bcc0cc",
    surface2: "acb0be",

    // Named
    rosewater: "dc8a78",
    flamingo: "dd7878",
    pink: "ea76cb",
    mauve: "8839ef",
    red: "d20f39",
    maroon: "e64553",
    peach: "fe640b",
    yellow: "df8e1d",
    green: "40a02b",
    teal: "179299",
    sky: "04a5e5",
    sapphire: "209fb5",
    blue: "1e66f5",
    lavender: "7287fd",

    // Alias
    separatorAlias: "crust",
    aiAlias: "pink",
    authenticatedAlias: "yellow",
    anonymousAlias: "maroon",
  },
};
