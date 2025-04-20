import React from "react";
import css from "./InfoBarLogo.module.css";

type Props = {};

const InfoBarLogo = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <span className={css["icon"]}></span>
      <span className={css["brand"]}>2pm</span>
    </div>
  );
};

export default InfoBarLogo;
