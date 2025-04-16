import React from "react";
import css from "./EmailSent.module.css";

type Props = {
  reference: number;
  email: string;
};

const EmailSent = ({ reference, email }: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["header"]}>
        <div className={css["title-and-reference-number"]}>
          <div className={css["title"]}>󱡰 Email Sent</div>
          <div className={css["reference-number"]}>[{reference}]</div>
        </div>
      </div>
      <div className={css["body"]}>
        <span className={css["key"]}>email</span>:{" "}
        <span className={css["value"]}>{email}</span>
      </div>
    </div>
  );
};

export default EmailSent;
