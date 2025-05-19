"use client";

import React from "react";
import css from "./ThemeProvider.module.css";
import classNames from "classnames";
import { ThemeDto } from "@2pm/core";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

type Props = {
  children: React.ReactNode;
  theme: ThemeDto;
};

const ThemeProvider = ({ children, theme }: Props) => {
  return (
    <div
      className={classNames(css["root"])}
      style={{
        "--base": `#${theme.base}`,
        "--mantle": `#${theme.mantle}`,
        "--crust": `#${theme.crust}`,
        "--text": `#${theme.text}`,
        "--subtext0": `#${theme.subtext0}`,
        "--subtext1": `#${theme.subtext1}`,
        "--overlay0": `#${theme.overlay0}`,
        "--overlay1": `#${theme.overlay1}`,
        "--overlay2": `#${theme.overlay2}`,
        "--surface0": `#${theme.surface0}`,
        "--surface1": `#${theme.surface1}`,
        "--surface2": `#${theme.surface2}`,

        "--rosewater": `#${theme.rosewater}`,
        "--flamingo": `#${theme.flamingo}`,
        "--pink": `#${theme.pink}`,
        "--mauve": `#${theme.mauve}`,
        "--red": `#${theme.red}`,
        "--maroon": `#${theme.maroon}`,
        "--peach": `#${theme.peach}`,
        "--yellow": `#${theme.yellow}`,
        "--green": `#${theme.green}`,
        "--teal": `#${theme.teal}`,
        "--sky": `#${theme.sky}`,
        "--sapphire": `#${theme.sapphire}`,
        "--blue": `#${theme.blue}`,
        "--lavender": `#${theme.lavender}`,

        "--separator": `var(--${theme.separatorAlias})`,
        "--ai": `var(--${theme.aiAlias})`,
        "--authenticated": `var(--${theme.authenticatedAlias})`,
        "--anonymous": `var(--${theme.anonymousAlias})`,
        "--active-channel": `var(--${theme.activeChannelAlias})`,
      }}
    >
      {children}
    </div>
  );
};

export default ThemeProvider;
