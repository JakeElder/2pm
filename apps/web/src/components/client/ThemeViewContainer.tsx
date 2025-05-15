"use client";

import { ThemeDto } from "@2pm/core";
import { Theme } from "@2pm/ui/components";

type Props = {
  theme: ThemeDto;
  children: React.ReactNode;
};

const ThemeViewContainer = ({ theme, children }: Props) => {
  // useHotkeys(
  //   ["c", "shift+c"],
  //   (e) =>
  //     setThemeId((current) => {
  //       const offset = e.shiftKey ? -1 : 1;
  //       const nextIndex =
  //         (THEMES.indexOf(current) + offset + THEMES.length) % THEMES.length;
  //       return THEMES[nextIndex];
  //     }),
  //   [themeId],
  // );

  return <Theme theme={theme}>{children}</Theme>;
};

export default ThemeViewContainer;
