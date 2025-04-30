import React from "react";
import css from "./InfoBarAiState.module.css";
import classNames from "classnames";

/*
 * Idle
 */

type IdleProps = {};

export const Idle = ({}: IdleProps) => {
  return (
    <div className={classNames(css["root"], css["idle"])}>
      <div className={css["label"]}>[idle]</div>
      <div className={css["icon"]}>
        <span className={css["roby"]}>󱚣</span>
      </div>
    </div>
  );
};

/*
 * Active
 */

type ActiveProps = {
  tag: string;
  state: "THINKING" | "ACTING" | "RESPONDING";
};

export const Active = ({ tag, state }: ActiveProps) => {
  return (
    <div className={classNames(css["root"], css[state.toLowerCase()])}>
      <div className={css["tag"]}>@{tag}</div>
      <div className={classNames(css["label"])}>[{state.toLowerCase()}]</div>
      <div className={css["icon"]}>
        <span className={css["roby"]}>
          <Roby state={state} />
        </span>
      </div>
    </div>
  );
};

/*
 * Roby
 */

type RobyProps = {
  state: ActiveProps["state"];
};

const Roby = ({ state }: RobyProps) => {
  const robyMap: Record<RobyProps["state"], string> = {
    THINKING: "󱚟",
    ACTING: "󱙺",
    RESPONDING: "󱜙",
  };

  return robyMap[state];
};
