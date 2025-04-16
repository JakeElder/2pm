import React from "react";
import css from "./PlotPointFrame.module.css";

type Props = {
  children: React.ReactNode;
};

const PlotPointFrame = ({ children }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["container"]}>{children}</div>
    </div>
  );
};

export default PlotPointFrame;
