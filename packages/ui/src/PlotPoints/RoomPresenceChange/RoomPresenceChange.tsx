import React from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./RoomPresenceChange.module.css";

type Props = {
  type: "ENTRACE" | "EXIT";
  tag: string;
};

const RoomPresenceChange = ({ type, tag }: Props) => {
  const icon = type === "ENTRACE" ? "" : "󰩈";
  const verb = type === "ENTRACE" ? "entered" : "left";

  return (
    <StandardPlotPoint.Root>
      <span className={css["icon"]}>{icon}</span>&nbsp;
      <span className={css["tag"]}>@{tag}</span>&nbsp;
      <span className={css["action"]}>{verb} the room</span>
    </StandardPlotPoint.Root>
  );
};

export default RoomPresenceChange;
