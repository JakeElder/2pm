import React from "react";
import css from "./Narrative.module.css";
import classNames from "classnames";
import { PlotPointPerspective } from "@2pm/schemas";
import { PlotPointDto } from "@2pm/schemas/dto";

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
  type: PlotPointDto["type"];
  perspective: PlotPointPerspective;
  children: React.ReactNode;
}

export const PlotPoint = ({ type, perspective, children }: PlotPointProps) => {
  if (type === "AI_MESSAGE" || type === "HUMAN_MESSAGE") {
    return <Message perspective={perspective}>{children}</Message>;
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
  return (
    <div className={classNames(css["plot-point"], css[className])}>
      {children}
    </div>
  );
};
