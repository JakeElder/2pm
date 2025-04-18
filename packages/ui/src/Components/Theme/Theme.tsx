"use client";

import React, { useState } from "react";
import css from "./Theme.module.css";
import classNames from "classnames";
import { ThemeId, THEMES } from "@2pm/data";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  defaultThemeId?: ThemeId;
  children: React.ReactNode;
};

const Theme = ({ children, defaultThemeId = "frappe" }: Props) => {
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);

  useHotkeys(
    ["c"],
    () =>
      setThemeId((current) => {
        const index = (THEMES.indexOf(current) + 1) % THEMES.length;
        return THEMES[index];
      }),
    [themeId],
  );

  return (
    <div className={classNames(css["root"], css[themeId])}>{children}</div>
  );
};

export default Theme;
