import React from "react";
import css from "./PromptSubmitButton.module.css";
import classNames from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PromptSubmitButton = (props: Props) => {
  return (
    <div className={css["root"]}>
      <button className={classNames("reset", css["button"])} {...props}>
        &rsaquo;
      </button>
    </div>
  );
};

export default PromptSubmitButton;
