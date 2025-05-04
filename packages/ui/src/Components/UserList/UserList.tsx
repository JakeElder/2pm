import React from "react";
import css from "./UserList.module.css";
import { UserDto } from "@2pm/core";
import UserTag from "../UserTag/UserTag";

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

type UserProps = UserDto & { showHash?: boolean };

export const User = (props: UserProps) => {
  return (
    <li className={css["user"]}>
      <div className={css["meta"]}>
        <div className={css["placeholder"]} />
      </div>
      <div className={css["tag"]}>
        <UserTag {...props} />
      </div>
    </li>
  );
};
