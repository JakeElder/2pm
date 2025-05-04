import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./RoomPresenceChange.module.css";
import classNames from "classnames";

type Props = {
  type: "ENTRACE" | "EXIT";
};

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return (
    <StandardPlotPoint.Root>
      <div className={css["root"]}>{children}</div>
    </StandardPlotPoint.Root>
  );
};

/*
 * Icon
 */

type IconProps = Props;

export const Icon = ({ type }: IconProps) => {
  return (
    <>
      <span
        className={classNames({
          [css["icon"]]: true,
          [css["reverse"]]: type === "EXIT",
        })}
      >
        
      </span>
      &nbsp;
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

/*
 * Action
 */

type ActionProps = Props;

export const Action = ({ type }: ActionProps) => {
  const verb = type === "ENTRACE" ? "entered" : "left";
  return <span className={css["action"]}>{verb} the room</span>;
};
