import React from "react";
import css from "./InfoBarUser.module.css";

type Props = {
  name: string;
  hash: string;
};

const InfoBarUser = ({ name, hash }: Props) => {
  return (
    <div className={css["root"]}>
      <span className={css["icon"]}></span>
      <span className={css["at"]}>@</span>
      <span className={css["name"]}>{name}</span>
      <span className={css["hash-symbol"]}>#</span>
      <span className={css["hash"]}>{hash}</span>
    </div>
  );
};

export default InfoBarUser;
