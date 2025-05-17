import React from "react";
import css from "./UserThemeSwitched.module.css";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";

type Props = {};

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
 * Icon
 */

type IconProps = {};

export const Icon = ({}: IconProps) => {
  return (
    <>
      <span className={css["icon"]}></span>
    </>
  );
};

/*
 * Tag
 */

type TagProps = {
  children: React.ReactNode;
};

export const Tag = ({ children }: TagProps) => {
  return (
    <>
      <span className={css["tag"]}>{children}</span>
      &nbsp;
    </>
  );
};

const UserThemeSwitched = ({}: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Body>{null}</StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

/*
 * Action
 */

type ActionProps = {
  themeName: string;
};

export const Action = ({ themeName }: ActionProps) => {
  return (
    <span className={css["action"]}>
      changed to <span className={css["name"]}>{themeName}</span> theme
    </span>
  );
};
