"use client";

import { useThemeEvents } from "@/hooks";
import { SessionDto, ThemeDto } from "@2pm/core";
import { Theme } from "@2pm/ui/components";
import { useState, useCallback } from "react";

type Props = {
  theme: ThemeDto;
  session: SessionDto;
};

const ThemeViewContainer = ({ session, ...rest }: Props) => {
  const [theme, setTheme] = useState(rest.theme);

  useThemeEvents({
    humanUserId: session.humanUserId,
    themeId: rest.theme.id,
    onUpdated: useCallback((e) => {
      if (e.data.theme.id === rest.theme.id) {
        setTheme(e.data.theme);
      }
    }, []),
  });

  return <Theme {...theme} />;
};

export default ThemeViewContainer;
