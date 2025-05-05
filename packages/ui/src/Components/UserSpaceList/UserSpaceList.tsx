import React from "react";
import css from "./UserSpaceList.module.css";
// import UserTag from "../UserTag";
import * as users from "../../fixtures/users";
import classNames from "classnames";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return <div className={css["root"]}>{children}</div>;
};

/*
 * Tag
 */

type TagProps = {
  children: React.ReactNode;
};

export const Tag = ({ children }: TagProps) => {
  return <div className={css["tag"]}>{children}</div>;
};

/*
 * Channels
 */

type ChannelsProps = {
  children: React.ReactNode;
};

export const Channels = ({ children }: ChannelsProps) => {
  return <ul className={css["channels"]}>{children}</ul>;
};

/*
 * Channel
 */

type ChannelProps = {
  children: React.ReactNode;
  disabled?: boolean;
  updates?: boolean;
};

export const Channel = ({ children, disabled, updates }: ChannelProps) => {
  return (
    <li
      className={classNames({
        [css["channel"]]: true,
        [css["disabled-channel"]]: disabled,
        [css["updates-channel"]]: updates,
      })}
    >
      {children}
      {updates ? <span className={css["new"]}>󰎔</span> : null}
    </li>
  );
};
