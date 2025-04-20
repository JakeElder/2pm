import React from "react";
import css from "./SpaceList.module.css";
import classNames from "classnames";

type Props = {};

const SpaceList = ({}: Props) => {
  return (
    <ul className={css["root"]}>
      <li className={classNames(css["channel"], css["active-channel"])}>
        <div className={css["name"]}>#universe</div>
        <div className={css["users"]}>
          <span className={css["user-icon"]}></span>
          <span className={css["user-count"]}>12</span>
        </div>
      </li>
      <li className={css["channel"]}>
        <div className={css["name"]}>#mini-mart</div>
        <div className={css["users"]}>
          <span className={css["user-icon"]}></span>
          <span className={css["user-count"]}>22</span>
        </div>
      </li>
      <li className={css["channel"]}>
        <div className={css["name"]}>#lobby</div>
        <div className={css["users"]}>
          <span className={css["user-icon"]}></span>
          <span className={css["user-count"]}>172</span>
        </div>
      </li>
      <li className={css["channel"]}>
        <div className={css["name"]}>#the-middle</div>
        <div className={css["users"]}>
          <span className={css["user-icon"]}></span>
          <span className={css["user-count"]}>114</span>
        </div>
      </li>
      <li className={css["channel"]}>
        <div className={css["name"]}>#meditations</div>
        <div className={css["users"]}>
          <span className={css["user-icon"]}></span>
          <span className={css["user-count"]}>190</span>
        </div>
      </li>
    </ul>
  );
};

export default SpaceList;
