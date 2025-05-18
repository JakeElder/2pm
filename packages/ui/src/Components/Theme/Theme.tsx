"use client";

import React, { useState } from "react";
import css from "./Theme.module.css";
import {
  SEMANTIC_THEME_KEYS,
  NAMED_THEME_KEYS,
  ALIAS_THEME_KEYS,
  ThemeDto,
} from "@2pm/core";
import {
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  offset,
  shift,
  autoUpdate,
} from "@floating-ui/react";

/*
 * Color
 */

type ColorProps = {
  toolTip?: string;
  color: string;
};

export const Color = ({ toolTip, color }: ColorProps) => {
  if (toolTip) {
    return <TooltipColor toolTip={toolTip} color={color} />;
  }
  return <span className={css["color"]} style={{ background: `#${color}` }} />;
};

/*
 * TooltipColor
 */

type TooltipColorProps = {
  toolTip: string;
  color: string;
};

export const TooltipColor = ({ toolTip, color }: TooltipColorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, context, x, y, strategy } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    placement: "top",
  });

  const hover = useHover(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

  return (
    <div className={css["color-container"]}>
      <span
        ref={refs.setReference}
        className={css["color"]}
        style={{ background: `#${color}` }}
        {...getReferenceProps()}
      />

      {isOpen ? (
        <div
          ref={refs.setFloating}
          className={css["color-tooltip"]}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            zIndex: 1000,
          }}
          {...getFloatingProps()}
        >
          {toolTip}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Theme
 */

type Props = ThemeDto;

const Theme = (theme: Props) => {
  return (
    <div className={css["root"]}>
      <div className={css["semantic"]}>
        {SEMANTIC_THEME_KEYS.map((key) => {
          return <Color key={key} toolTip={key} color={theme[key]} />;
        })}
      </div>
      <div className={css["named"]}>
        {NAMED_THEME_KEYS.map((key) => {
          return <Color key={key} toolTip={key} color={theme[key]} />;
        })}
      </div>
      <div className={css["aliases"]}>
        <ul className={css["alias-list"]}>
          {ALIAS_THEME_KEYS.map((key) => {
            const k = theme[key]!;
            const v = theme[k]!;
            return (
              <li className={css["alias"]} key={key}>
                <div className={css["alias-color"]}>
                  <Color toolTip={k} color={v} />
                </div>{" "}
                {key.replace("Alias", "")}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Theme;
