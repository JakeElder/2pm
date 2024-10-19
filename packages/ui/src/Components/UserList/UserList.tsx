import Image from "next/image";
import React from "react";
import css from "./UserList.module.css";
import { AiUserCode } from "@2pm/data";
import { aiUserIcons, anonymousAvatar } from "../../images";

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

/*
 * AuthenticatedList
 */

type AuthenticatedListProps = {
  children: React.ReactNode;
};

export const AuthenticatedUserList = ({ children }: AuthenticatedListProps) => {
  return <ul className={css["authenticated-user-list"]}>{children}</ul>;
};

/*
 * AuthenticatedUserAvatar
 */

type AuthenticatedUserAvatarProps = {
  src?: string;
  alt: string;
};

export const AuthenticatedUserAvatar = (
  props: AuthenticatedUserAvatarProps,
) => {
  const src = props.src ?? anonymousAvatar.src;

  return (
    <div className={css["authenticated-avatar"]}>
      <div className={css["authenticated-avatar-inner"]}>
        <Image
          className={css["authenticated-avatar-image"]}
          src={src}
          width={256}
          height={256}
          alt={props.alt}
        />
      </div>
    </div>
  );
};

/*
 * AuthenticatedUser
 */

type AuthenticatedUserProps = {
  avatar?: string;
  children: string;
};

export const AuthenticatedUser = ({
  avatar,
  children,
}: AuthenticatedUserProps) => {
  return (
    <li className={css["authenticated-user"]}>
      <AuthenticatedUserAvatar src={avatar} alt={children} />
      <div className={css["tag"]}>@{children}</div>
      <div className={css["status"]}></div>
    </li>
  );
};
