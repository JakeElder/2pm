import React, { useState } from "react";
import * as StandardPlotPoint from "../../Components/StandardPlotPoint";
import css from "./ThemeCreated.module.css";
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
  name?: string;
  color: string;
};

export const Color = ({ name, color }: ColorProps) => {
  if (name) {
    return <TooltipColor name={name} color={color} />;
  }
  return <span className={css["color"]} style={{ background: `#${color}` }} />;
};

/*
 * TooltipColor
 */

type TooltipColorProps = {
  name: string;
  color: string;
};

export const TooltipColor = ({ name, color }: TooltipColorProps) => {
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
          {name}
        </div>
      ) : null}
    </div>
  );
};

/**
 * ThemeCreated
 */
type Props = {
  theme: ThemeDto;
};

const ThemeCreated = ({ theme }: Props) => {
  return (
    <StandardPlotPoint.Root>
      <StandardPlotPoint.Header>
        <StandardPlotPoint.HeadingAndReference>
          <StandardPlotPoint.Heading>
            <div className={css["heading"]}> Theme Created</div>
            <div className={css["name"]}>
              <span className={css["label"]}>[name]:</span>
              <span className={css["value"]}>{theme.name}</span>
            </div>
          </StandardPlotPoint.Heading>
        </StandardPlotPoint.HeadingAndReference>
      </StandardPlotPoint.Header>
      <StandardPlotPoint.Body>
        <div className={css["semantic"]}>
          {SEMANTIC_THEME_KEYS.map((key) => {
            return <Color key={key} name={key} color={theme[key]} />;
          })}
        </div>
        <div className={css["named"]}>
          {NAMED_THEME_KEYS.map((key) => {
            return <Color key={key} name={key} color={theme[key]} />;
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
                    <Color color={v} />
                  </div>{" "}
                  {key.replace("Alias", "")}
                </li>
              );
            })}
          </ul>
        </div>
      </StandardPlotPoint.Body>
    </StandardPlotPoint.Root>
  );
};

export default ThemeCreated;
