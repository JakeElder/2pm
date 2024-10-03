import React from "react";
import css from "./Message.module.css";
import { processMessageBody } from "../../../utils";
import Markdown from "../../Markdown";
import classNames from "classnames";
import { PlotPointPerspective } from "@2pm/schemas";

/*
 * Message
 */

type Props = {
  perspective: PlotPointPerspective;
  children: string;
};

const perspectiveClassName = (perspective: PlotPointPerspective) =>
  perspective === "FIRST_PERSON" ? "first-person-body" : "third-person-body";

export const Message = ({ perspective, children }: Props) => {
  const processed = processMessageBody(children);
  return (
    <div className={css["root"]}>
      <div
        className={classNames(
          css["message-body"],
          css[perspectiveClassName(perspective)],
        )}
      >
        <Markdown>{processed}</Markdown>
      </div>
    </div>
  );
};

export default Message;
