import React from "react";
import css from "./FirstPersonMessage.module.css";
import $css from "../../../Shared.module.css";
import classNames from "classnames";
import { processMessageBody } from "../../../utils";
import Markdown from "../../Markdown";

interface Props {
  children: string;
}

const FirstPersonMessage = ({ children }: Props) => {
  const processed = processMessageBody(children);
  return (
    <div className={css["root"]}>
      <div className={classNames($css["message-body"], css["body"])}>
        <Markdown>{processed}</Markdown>
      </div>
    </div>
  );
};

export default FirstPersonMessage;
