import React from "react";
import css from "./StandardLayout.module.css";
import Theme from "../../Components/Theme";
import SpaceList from "../../Components/SpaceList";
import PaneHeader from "../../Components/PaneHeader";
import Logo from "../../Components/Logo";
import InfoBarUser from "../../Components/InfoBarUser";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({}: RootProps) => {
  return (
    <Theme themeId="frappe">
      <div className={css["root"]}>
        <div className={css["main"]}>
          <div className={css["spaces"]}>
            <PaneHeader> Spaces</PaneHeader>
            <SpaceList />
          </div>
          <div className={css["reference-plot-points"]}></div>
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
