import React, { createContext, useContext } from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./RoomPresenceChange.module.css";
import classNames from "classnames";

type RoomPresenceType = "ENTRACE" | "EXIT";

const RoomPresenceContext = createContext<RoomPresenceType | null>(null);
const useRoomPresenceContext = () => useContext(RoomPresenceContext)!;

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
  type: RoomPresenceType;
};

export const Root = ({ children, type }: RootProps) => {
  return (
    <RoomPresenceContext.Provider value={type}>
      <StandardPlotPoint.Root>
        <div className={css["root"]}>{children}</div>
      </StandardPlotPoint.Root>
    </RoomPresenceContext.Provider>
  );
};

/*
 * Icon
 */

type IconProps = {};

export const Icon = ({}: IconProps) => {
  const type = useRoomPresenceContext();
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

type ActionProps = {};

export const Action = ({}: ActionProps) => {
  const type = useRoomPresenceContext();
  const verb = type === "ENTRACE" ? "entered" : "left";
  return <span className={css["action"]}>{verb} the room</span>;
};
