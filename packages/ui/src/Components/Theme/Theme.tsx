"use client";

import React, { useState } from "react";
import css from "./Theme.module.css";
import classNames from "classnames";
import { ThemeId, THEMES } from "@2pm/core";
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  defaultThemeId?: ThemeId;
  children: React.ReactNode;
};

const Theme = ({ children, defaultThemeId = "frappe" }: Props) => {
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);

  useHotkeys(
    ["c", "shift+c"],
    (e) =>
      setThemeId((current) => {
        const offset = e.shiftKey ? -1 : 1;
        const nextIndex =
          (THEMES.indexOf(current) + offset + THEMES.length) % THEMES.length;
        return THEMES[nextIndex];
      }),
    [themeId],
  );

  return (
    <div className={classNames(css["root"], css[themeId])}>{children}</div>
  );
};

export default Theme;
