import React from "react";
import css from "./InfoBar.module.css";
import Logo from "../Logo";
import InfoBarUser from "../InfoBarUser";

/*
 * Separator
 */

type SeparatorProps = {};

export const Separator = (props: SeparatorProps) => {
  return <div className={css["separator"]}>│</div>;
};

/*
 * InfoBar
 */

type InfoBarProps = {};

const InfoBar = ({}: InfoBarProps) => {
  return (
    <div className={css["info-bar"]}>
      <div className={css["logo"]}>
        <Logo />
      </div>
      <Separator />
      <div className={css["user"]}>
        <InfoBarUser />
      </div>
    </div>
  );
};

export default InfoBar;
