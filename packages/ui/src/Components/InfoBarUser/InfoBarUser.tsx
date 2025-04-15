import React from "react";
import css from "./InfoBarUser.module.css";

type Props = {};

const InfoBarUser = ({}: Props) => {
  return (
    <div className={css["root"]}>
      <span className={css["icon"]}></span>
      <span className={css["at"]}>@</span>
      <span className={css["name"]}>anon</span>
      <span className={css["hash"]}>#</span>
      <span className={css["id"]}>uf4DyTAVLKBfDe6ky7mSoz</span>
    </div>
  );
};

export default InfoBarUser;
