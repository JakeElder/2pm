"use client";

import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ThemeId, THEMES } from "@2pm/data";
import css from "./StandardLayout.module.css";
import Theme from "../../Components/Theme";
import SpaceList from "../../Components/SpaceList";
import PaneHeader from "../../Components/PaneHeader";
import Logo from "../../Components/Logo";
import InfoBarUser from "../../Components/InfoBarUser";
import BibleVerse from "../../PlotPoints/BibleVerse/BibleVerse";
import EmailSent from "../../PlotPoints/EmailSent/EmailSent";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({}: RootProps) => {
  const [themeId, setThemeId] = useState<ThemeId>("frappe");

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
    <Theme themeId={themeId}>
      <div className={css["root"]}>
        <div className={css["main"]}>
          <div className={css["spaces"]}>
            <PaneHeader> Spaces</PaneHeader>
            <SpaceList />
          </div>
          <div className={css["reference-plot-points"]}>
            <div className={css["plot-point"]}>
              <EmailSent email="jake@2pm.io" reference={2} />
            </div>
            <div className={css["plot-point"]}>
              <BibleVerse verse="Ecclesiastes 3:6" reference={1}>
                A time to weep, and a time to laugh; a time to mourn, and a time
                to dance; A time to cast away stones, and a time to gather
                stones together; a time to embrace, and a time to refrain from
                embracing; A time to get, and a time to lose; a time to keep,
                and a time to cast away; A time to rend, and a time to sew; a
                time to keep silence, and a time to speak; A time to love, and a
                time to hate; a time of war, and a time of peace.
              </BibleVerse>
            </div>
          </div>
          <div className={css["conversation-plot-points"]}></div>
        </div>
        <div className={css["status-bar"]}></div>
        <div className={css["info-bar"]}>
          <div className={css["logo"]}>
            <Logo />
          </div>
          <div className={css["separator"]}>│</div>
          <div className={css["user"]}>
            <InfoBarUser />
          </div>
        </div>
      </div>
    </Theme>
  );
};
