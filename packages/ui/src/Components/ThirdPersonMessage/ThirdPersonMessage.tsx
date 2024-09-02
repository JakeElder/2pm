import React from "react";
import css from "./ThirdPersonMessage.module.css";
import $css from "../../Shared.module.css";
import { processMessageBody } from "@/utils";
import Markdown from "../Markdown";
import classNames from "classnames";

interface Props {
  children: string;
}

const ThirdPersonMessage = ({ children }: Props) => {
  const processed = processMessageBody(children);
  return (
    <div className={css["root"]}>
      <div className={classNames($css["message-body"], css["body"])}>
        <Markdown>{processed}</Markdown>
      </div>
    </div>
  );
};

export default ThirdPersonMessage;
