import React from "react";
import css from "./Message.module.css";
import { processMessageBody } from "../../../utils";
import Markdown from "../../Markdown";
import classNames from "classnames";
import { PlotPointPerspective } from "@2pm/data";

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
  const body = processed ? <Markdown>{processed}</Markdown> : <>&nbsp;</>;
  return (
    <div className={css["root"]}>
      <div
        className={classNames(
          css["message-body"],
          css[perspectiveClassName(perspective)],
        )}
      >
        {body}
      </div>
    </div>
  );
};

export default Message;
