import React from "react";
import css from "./Logo.module.css";

type Props = {};

const Logo = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <span className={css["icon"]}></span>
      <span className={css["brand"]}>2pm</span>
    </div>
  );
};

export default Logo;
