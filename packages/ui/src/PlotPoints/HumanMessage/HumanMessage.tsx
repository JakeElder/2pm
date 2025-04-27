import React from "react";
import css from "./HumanMessage.module.css";
import { Prose } from "@2pm/core";

type Props = {
  content: Prose;
  tag: string;
};

const HumanMessage = ({ content, tag }: Props) => {
  return (
    <div className={css["message"]}>
      <div className={css["header"]}>
        <div className={css["user"]}>
          <div className={css["tag"]}>@{tag}</div>
        </div>
      </div>
      <div className={css["body"]}>{JSON.stringify(content)}</div>
    </div>
  );
};

export default HumanMessage;
