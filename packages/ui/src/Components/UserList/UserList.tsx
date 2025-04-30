import React from "react";
import css from "./UserList.module.css";
import classNames from "classnames";

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
  type: "HUMAN" | "AI";
  authenticated?: boolean;
  tag: string;
};

export const User = ({ type, authenticated, tag }: ChannelProps) => {
  return (
    <li
      className={classNames(css["user"], {
        [css["human"]]: type === "HUMAN",
        [css["ai"]]: type === "AI",
      })}
    >
      <div className={css["meta"]}>
        <div className={css["placeholder"]}></div>
      </div>
      <div className={css["name"]}>@{tag}</div>
    </li>
  );
};
