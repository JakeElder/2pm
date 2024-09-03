import React from "react";
import $css from "../../Shared.module.css";
import css from "./PromptInput.module.css";
import classNames from "classnames";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const PromptInput = (props: Props) => {
  return (
    <div className={css["root"]}>
      <input className={classNames($css["reset"], css["input"])} {...props} />
    </div>
  );
};

export default PromptInput;
