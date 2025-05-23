import React from "react";
import css from "./EnvironmentUserList.module.css";

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
 * User
 */

type UserProps = {
  children: React.ReactNode;
};

export const User = ({ children }: UserProps) => {
  return (
    <li className={css["user"]}>
      <div className={css["meta"]}>
        <div className={css["placeholder"]} />
      </div>
      <div className={css["tag"]}>{children}</div>
    </li>
  );
};
