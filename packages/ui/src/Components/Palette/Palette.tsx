import React from "react";
import css from "./Palette.module.css";
import { ThemeColor } from "@2pm/core";

/*
 * Color
 */

type ColorProps = {
  name: ThemeColor;
};

export const Color = ({ name }: ColorProps) => {
  return (
    <div className={css["color"]}>
      <div className={css["block"]} style={{ background: `var(--${name})` }} />
      <div className={css["name"]}>{name}</div>
    </div>
  );
};

/*
 * Palette
 */

type PaletteProps = {};

export const Palette = ({}: PaletteProps) => {
  return (
    <div className={css["root"]}>
      <div className={css["group"]}>
        <Color name="base" />
        <Color name="mantle" />
        <Color name="crust" />
        <Color name="text" />
        <Color name="subtext1" />
        <Color name="subtext0" />
        <Color name="overlay2" />
        <Color name="overlay1" />
        <Color name="overlay0" />
        <Color name="surface2" />
        <Color name="surface1" />
        <Color name="surface0" />
      </div>
      <div className={css["group"]}>
        <Color name="rosewater" />
        <Color name="flamingo" />
        <Color name="pink" />
        <Color name="mauve" />
        <Color name="red" />
        <Color name="maroon" />
        <Color name="peach" />
        <Color name="yellow" />
        <Color name="green" />
        <Color name="teal" />
        <Color name="sky" />
        <Color name="sapphire" />
        <Color name="blue" />
        <Color name="lavender" />
      </div>
    </div>
  );
};
