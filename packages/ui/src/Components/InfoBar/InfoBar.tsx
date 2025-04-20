import React from "react";
import css from "./InfoBar.module.css";

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
 * Logo
 */

type LogoProps = {
  children: React.ReactNode;
};

export const Logo = ({ children }: LogoProps) => {
  return <div className={css["logo"]}>{children}</div>;
};

/*
 * User
 */

type UserProps = {
  children: React.ReactNode;
};

export const User = ({ children }: UserProps) => {
  return <div className={css["user"]}>{children}</div>;
};

/*
 * Separator
 */

type SeparatorProps = {};

export const Separator = ({}: SeparatorProps) => {
  return <div className={css["separator"]}>│</div>;
};
