"use client";

import { nextTheme, prevTheme } from "@/actions";
import { useHumanUserThemeEvents } from "@/hooks/use-human-user-theme-events";
import { HumanUserThemeDto, SessionDto } from "@2pm/core";
import { Theme } from "@2pm/ui/components";
import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  humanUserTheme: HumanUserThemeDto;
  session: SessionDto;
  children: React.ReactNode;
};

const ThemeViewContainer = ({ session, children, ...rest }: Props) => {
  const [humanUserTheme, setHumanUserTheme] = useState(rest.humanUserTheme);

  useHotkeys("c", () => nextTheme(humanUserTheme.id), [humanUserTheme.id]);

  useHotkeys("shift+c", () => prevTheme(humanUserTheme.id), [
    humanUserTheme.id,
  ]);

  useHumanUserThemeEvents({
    humanUserId: session.humanUserId,
    humanUserThemeId: humanUserTheme.id,
    onUpdated: useCallback((e) => setHumanUserTheme(e), []),
  });

  return <Theme theme={humanUserTheme.theme}>{children}</Theme>;
};

export default ThemeViewContainer;
