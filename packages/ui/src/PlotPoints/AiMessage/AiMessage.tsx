import React from "react";
import css from "./AiMessage.module.css";

type Props = {
  children: React.ReactNode;
  tag: string;
};

const AiMessage = ({ children, tag }: Props) => {
  return (
    <div className={css["message"]}>
      <div className={css["header"]}>
        <div className={css["user"]}>
          <div className={css["tag"]}>@{tag}</div>
        </div>
      </div>
      <div className={css["body"]}>{children}</div>
    </div>
  );
};

export default AiMessage;
