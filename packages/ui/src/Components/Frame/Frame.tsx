import React from "react";
import css from "./Frame.module.css";
import classNames from "classnames";

type GenericProps = {
  children: React.ReactNode;
  center?: boolean;
  fill?: boolean;
};

/*
 * Generic
 */

export const Generic = ({ children, center, fill }: GenericProps) => {
  return (
    <div
      className={classNames(css["root"], {
        [css["center"]]: center,
        [css["fill"]]: fill,
      })}
    >
      {children}
    </div>
  );
};

/*
 * PlotPoint
 */

type PlotPointProps = {
  children: React.ReactNode;
};

export const PlotPoint = ({ children }: PlotPointProps) => {
  return (
    <Generic center fill>
      <div className={css["plot-point"]}>{children}</div>
    </Generic>
  );
};
