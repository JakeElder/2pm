import React from "react";
import css from "./LibraryList.module.css";
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
 * Resource
 */

type ResourceProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export const Resource = ({ children, disabled }: ResourceProps) => {
  return (
    <li
      className={classNames({
        [css["resource"]]: true,
        [css["disabled"]]: disabled,
      })}
    >
      {children}
    </li>
  );
};
