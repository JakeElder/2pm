import React from "react";
import css from "./AiMentionList.module.css";
import { AiUserDto } from "@2pm/core";
import UserTag from "../UserTag";
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
 * User
 */

type UserProps = {
  user: AiUserDto;
  handleClick?: React.DOMAttributes<HTMLDivElement>["onClick"];
  selected?: boolean;
};

export const User = ({ user, handleClick: onClick, selected }: UserProps) => {
  return (
    <div
      className={classNames({
        [css["user"]]: true,
        [css["selected"]]: selected,
      })}
      onClick={onClick}
    >
      <div className={css["avatar-and-info"]}>
        <div className={css["avatar"]}></div>
        <div className={css["info"]}>
          <div className={css["tag"]}>
            <UserTag type="AI" data={user} />
          </div>
          <div className={css["bio"]}>
            <span className={css["bio-prefix"]}>&raquo;</span>
            <span className={css["bio-text"]}>{user.bio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
 * NoResults
 */

type NoResultsProps = {};

export const NoResults = ({}: NoResultsProps) => {
  return (
    <div className={css["no-results"]}>
      <div className={css["avatar-and-info"]}>
        <div className={css["avatar"]}></div>
        <div className={css["info"]}>
          <div className={css["tag"]}>no results</div>
          <div className={css["bio"]}>
            <span className={css["bio-prefix"]}>&raquo;</span>
            <span className={css["bio-text"]}></span>
          </div>
        </div>
      </div>
    </div>
  );
};
