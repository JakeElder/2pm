import Image from "next/image";
import React from "react";
import css from "./UserList.module.css";
import { AiUserCode } from "@2pm/data";
import { aiUserIcons } from "../../images";

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
 * AiList
 */

type AiListProps = {
  children: React.ReactNode;
};

export const AiUserList = ({ children }: AiListProps) => {
  return <ul className={css["ai-user-list"]}>{children}</ul>;
};

/*
 * AiUser
 */

type AiUserProps = {
  code: AiUserCode;
  children: React.ReactNode;
};

export const AiUser = ({ children, code }: AiUserProps) => {
  return (
    <li className={css["ai-user"]}>
      <div className={css["ai-avatar"]}>
        <Image
          className={css["ai-avatar-image"]}
          {...aiUserIcons[code]}
          alt={code}
        />
      </div>
      <div className={css["tag"]}>@{children}</div>
      <div className={css["status"]}></div>
    </li>
  );
};

/*
 * Divider
 */

type DividerProps = {};

export const Divider = (props: DividerProps) => {
  return <div className={css["divider"]} />;
};
