import React from "react";
import css from "./UserTag.module.css";
import {
  AiUserDto,
  AnonymousUserDto,
  AuthenticatedUserDto,
  UserDto,
} from "@2pm/core";
import classNames from "classnames";

/*
 * UserTag
 */

type UserTagProps = UserDto & {
  showHash?: boolean;
};

export const UserTag = ({ type, data, showHash }: UserTagProps) => {
  if (type === "ANONYMOUS") {
    return <AnonymousUserTag {...data} showHash={showHash} />;
  }

  if (type === "AUTHENTICATED") {
    return <AuthenticatedUserTag {...data} showHash={showHash} />;
  }

  if (type === "AI") {
    return <AiUserTag {...data} />;
  }

  throw new Error();
};

export default UserTag;

/*
 * AnonymousUserTag
 */

type AnonymousUserTagProps = AnonymousUserDto["data"] & {
  showHash?: boolean;
};

export const AnonymousUserTag = ({ hash, showHash }: AnonymousUserTagProps) => {
  return (
    <div className={classNames(css["root"], css["anonymous"])}>
      <span className={css["at"]}>@</span>
      <span className={css["name"]}>anon</span>
      {showHash ? (
        <>
          <span className={css["hash-symbol"]}>#</span>
          <span className={css["hash"]}>{hash}</span>
        </>
      ) : null}
    </div>
  );
};

/*
 * AuthenticatedUserTag
 */

type AuthenticatedTagProps = AuthenticatedUserDto["data"] & {
  showHash?: boolean;
};

export const AuthenticatedUserTag = ({
  hash,
  tag,
  showHash,
}: AuthenticatedTagProps) => {
  return (
    <div className={classNames(css["root"], css["authenticated"])}>
      <span className={css["at"]}>@</span>
      <span className={css["name"]}>{tag}</span>
      {showHash ? (
        <>
          <span className={css["hash-symbol"]}>#</span>
          <span className={css["hash"]}>{hash}</span>
        </>
      ) : null}
    </div>
  );
};

/*
 * AiTag
 */

type AiTagProps = AiUserDto;

export const AiUserTag = ({ tag }: AiTagProps) => {
  return (
    <div className={classNames(css["root"], css["ai"])}>
      <span className={css["at"]}>@</span>
      <span className={css["name"]}>{tag}</span>
    </div>
  );
};
