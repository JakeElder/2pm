import React from "react";
import css from "./Message.module.css";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  type: "AI" | "HUMAN";
  user: string;
};

const Message = ({ children, user, type }: Props) => {
  const tagClassNames = classNames(css["tag"], {
    [css["ai-tag"]]: type === "AI",
    [css["human-tag"]]: type === "HUMAN",
  });

  return (
    <div className={css["message"]}>
      <div className={css["header"]}>
        <div className={css["user"]}>
          <div className={tagClassNames}>@{user}</div>
        </div>
      </div>
      <div className={css["body"]}>{children}</div>
    </div>
  );
};

export default Message;
