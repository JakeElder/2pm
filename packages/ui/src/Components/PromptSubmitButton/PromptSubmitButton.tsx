import React from "react";
import css from "./PromptSubmitButton.module.css";
import $css from "../../Shared.module.css";
import classNames from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const PromptSubmitButton = (props: Props) => {
  return (
    <div className={css["root"]}>
      <button className={classNames($css["reset"], css["button"])} {...props}>
        &rsaquo;
      </button>
    </div>
  );
};

export default PromptSubmitButton;
