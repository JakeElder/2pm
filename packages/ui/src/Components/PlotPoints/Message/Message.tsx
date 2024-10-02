import React from "react";
import css from "./Message.module.css";
import { processMessageBody } from "../../../utils";
import Markdown from "../../Markdown";
import classNames from "classnames";

/*
 * Message
 */

type Perspective = "FIRST_PERSON" | "THIRD_PERSON";

type Props = {
  perspective: Perspective;
  children: string;
};

const perspectiveClassName = (perspective: Perspective) =>
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
