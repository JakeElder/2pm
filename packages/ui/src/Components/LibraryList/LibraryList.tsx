import React from "react";
import css from "./LibraryList.module.css";

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
};

export const Resource = ({ children }: ResourceProps) => {
  return <li className={css["resource"]}>{children}</li>;
};
