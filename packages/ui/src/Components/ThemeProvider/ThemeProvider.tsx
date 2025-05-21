"use client";

import React from "react";
import css from "./ThemeProvider.module.css";
import classNames from "classnames";
import { ThemeDto } from "@2pm/core";
import { useSpring, animated, config } from "@react-spring/web";

type Props = {
  children: React.ReactNode;
  theme: ThemeDto;
};

const ThemeProvider = ({ children, theme }: Props) => {
  const spring = useSpring({
    base: `#${theme.base}`,
    mantle: `#${theme.mantle}`,
    crust: `#${theme.crust}`,
    text: `#${theme.text}`,
    subtext0: `#${theme.subtext0}`,
    subtext1: `#${theme.subtext1}`,
    overlay0: `#${theme.overlay0}`,
    overlay1: `#${theme.overlay1}`,
    overlay2: `#${theme.overlay2}`,
    surface0: `#${theme.surface0}`,
    surface1: `#${theme.surface1}`,
    surface2: `#${theme.surface2}`,
    rosewater: `#${theme.rosewater}`,
    flamingo: `#${theme.flamingo}`,
    pink: `#${theme.pink}`,
    mauve: `#${theme.mauve}`,
    red: `#${theme.red}`,
    maroon: `#${theme.maroon}`,
    peach: `#${theme.peach}`,
    yellow: `#${theme.yellow}`,
    green: `#${theme.green}`,
    teal: `#${theme.teal}`,
    sky: `#${theme.sky}`,
    sapphire: `#${theme.sapphire}`,
    blue: `#${theme.blue}`,
    lavender: `#${theme.lavender}`,
    config: {
      mass: 0.5,
      tension: 160,
      friction: 14,
    },
  });

  return (
    <animated.div
      className={classNames(css["root"])}
      style={
        {
          "--base": spring.base,
          "--mantle": spring.mantle,
          "--crust": spring.crust,
          "--text": spring.text,
          "--subtext0": spring.subtext0,
          "--subtext1": spring.subtext1,
          "--overlay0": spring.overlay0,
          "--overlay1": spring.overlay1,
          "--overlay2": spring.overlay2,
          "--surface0": spring.surface0,
          "--surface1": spring.surface1,
          "--surface2": spring.surface2,
          "--rosewater": spring.rosewater,
          "--flamingo": spring.flamingo,
          "--pink": spring.pink,
          "--mauve": spring.mauve,
          "--red": spring.red,
          "--maroon": spring.maroon,
          "--peach": spring.peach,
          "--yellow": spring.yellow,
          "--green": spring.green,
          "--teal": spring.teal,
          "--sky": spring.sky,
          "--sapphire": spring.sapphire,
          "--blue": spring.blue,
          "--lavender": spring.lavender,
          "--separator": `var(--${theme.separatorAlias})`,
          "--ai": `var(--${theme.aiAlias})`,
          "--authenticated": `var(--${theme.authenticatedAlias})`,
          "--anonymous": `var(--${theme.anonymousAlias})`,
          "--active-channel": `var(--${theme.activeChannelAlias})`,
        } as any
      }
      children={children}
    />
  );
};

export default ThemeProvider;
