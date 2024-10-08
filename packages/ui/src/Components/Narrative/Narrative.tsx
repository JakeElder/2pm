import React from "react";
import css from "./Narrative.module.css";
import { PlotPointPerspective } from "@2pm/data";
import { HydratedPlotPoint } from "@2pm/data";

/**
 * Root
 */

interface RootProps {
  children: React.ReactNode[];
}

export const Root = ({ children }: RootProps) => {
  return <div className={css["root"]}>{children}</div>;
};

/*
 * PlotPoint
 */

interface PlotPointProps {
  type: HydratedPlotPoint["type"];
  perspective: PlotPointPerspective;
  children: React.ReactNode;
}

export const PlotPoint = ({ type, perspective, children }: PlotPointProps) => {
  if (type === "AI_MESSAGE" || type === "HUMAN_MESSAGE") {
    return (
      <div className={css["plot-point"]}>
        <Message perspective={perspective}>{children}</Message>
      </div>
    );
  }
};

/*
 * Message
 */

interface MessageProps {
  perspective: PlotPointPerspective;
  children: React.ReactNode;
}

const Message = ({ children, perspective }: MessageProps) => {
  const className =
    perspective === "FIRST_PERSON"
      ? "first-person-message"
      : "third-person-message";
  return <div className={css[className]}>{children}</div>;
};
