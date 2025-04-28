import React from "react";
import css from "./HumanMessage.module.css";
import { Prose } from "../../Components";
import { ProseDto } from "@2pm/core";

type Props = {
  content: ProseDto;
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
      <Prose editable={false} content={content} />
    </div>
  );
};

export default HumanMessage;
