import React from "react";
import css from "./ThirdPersonMessage.module.css";
import { processMessageBody } from "@/utils";
import Markdown from "../Markdown";

interface Props {
  children: string;
}

const ThirdPersonMessage = ({ children }: Props) => {
  const processed = processMessageBody(children);
  return (
    <div className={css["root"]}>
      <div className={css["body"]}>
        <Markdown>{processed}</Markdown>
      </div>
    </div>
  );
};

export default ThirdPersonMessage;
