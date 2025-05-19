import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./ThemesListed.module.css";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return <StandardPlotPoint.Root>{children}</StandardPlotPoint.Root>;
};

/*
 * Header
 */

type HeaderProps = {};

export const Header = ({}: HeaderProps) => {
  return (
    <StandardPlotPoint.Header>
      <StandardPlotPoint.HeadingAndReference>
        <StandardPlotPoint.Heading>
          <div className={css["heading"]}> Themes Listed</div>
        </StandardPlotPoint.Heading>
      </StandardPlotPoint.HeadingAndReference>
    </StandardPlotPoint.Header>
  );
};

/*
 * Body
 */

type BodyProps = {
  children: React.ReactNode;
};

export const Body = ({ children }: BodyProps) => {
  return (
    <StandardPlotPoint.Body>
      <ul className={css["themes"]}>{children}</ul>
    </StandardPlotPoint.Body>
  );
};

/*
 * Theme
 */

type ThemeProps = {
  children: React.ReactNode;
  name: string;
};

export const Theme = ({ children, name }: ThemeProps) => {
  return (
    <li className={css["theme"]}>
      <div className={css["theme-heading"]}>
        <span className={css["name"]}>{name}</span>
      </div>
      {children}
    </li>
  );
};
