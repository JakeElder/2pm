import React from "react";
import css from "./SpaceList.module.css";
import classNames from "classnames";

type Props = {};

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return <ul className={css["root"]}>{children}</ul>;
};

/*
 * Channel
 */

type ChannelProps = {
  slug: React.ReactNode;
  userCount: number;
  active?: boolean;
};

export const Channel = ({ slug, active, userCount }: ChannelProps) => {
  return (
    <li
      className={classNames({
        [css["channel"]]: true,
        [css["active-channel"]]: active,
      })}
    >
      <div className={css["name"]}>#{slug}</div>
      <div className={css["users"]}>
        <span className={css["user-icon"]}></span>
        <span className={css["user-count"]}>{userCount}</span>
      </div>
    </li>
  );
};
