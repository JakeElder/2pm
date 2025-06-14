"use client";

import { nextTheme, prevTheme } from "@/actions";
import { useHumanUserThemeEvents } from "@/hooks/use-human-user-theme-events";
import { Environment, HumanUserThemeDto, SessionDto } from "@2pm/core";
import { ThemeProvider } from "@2pm/ui/components";
import { useCallback, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  humanUserTheme: HumanUserThemeDto;
  session: SessionDto;
  children: React.ReactNode;
  environmentId: Environment["id"];
};

const ThemeProviderViewContainer = ({
  session,
  children,
  environmentId,
  ...rest
}: Props) => {
  const [humanUserTheme, setHumanUserTheme] = useState(rest.humanUserTheme);

  useHotkeys("c", () => nextTheme({ id: humanUserTheme.id, environmentId }), [
    humanUserTheme.id,
  ]);

  useHotkeys(
    "shift+c",
    () => prevTheme({ id: humanUserTheme.id, environmentId }),
    [humanUserTheme.id],
  );

  useHumanUserThemeEvents({
    humanUserId: session.humanUserId,
    humanUserThemeId: humanUserTheme.id,
    onUpdated: useCallback((e) => {
      setHumanUserTheme(e);
    }, []),
  });

  return <ThemeProvider theme={humanUserTheme.theme}>{children}</ThemeProvider>;
};

export default ThemeProviderViewContainer;
