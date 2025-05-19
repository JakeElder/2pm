import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./ThemeCreated.module.css";

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

type HeaderProps = {
  name: string;
};

export const Header = ({ name }: HeaderProps) => {
  return (
    <StandardPlotPoint.Header>
      <StandardPlotPoint.HeadingAndReference>
        <StandardPlotPoint.Heading>
          <div className={css["heading"]}> Theme Created</div>
          <div className={css["name"]}>
            <span className={css["label"]}>[name]:</span>
            <span className={css["value"]}>{name}</span>
          </div>
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
  return <StandardPlotPoint.Body>{children}</StandardPlotPoint.Body>;
};
