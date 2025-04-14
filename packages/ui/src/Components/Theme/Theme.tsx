import React from "react";
import css from "./Theme.module.css";
import classNames from "classnames";
import { ThemeId } from "@2pm/data";

type Props = {
  themeId: ThemeId;
  children: React.ReactNode;
};

const Theme = ({ children, themeId }: Props) => {
  return (
    <div className={classNames(css["root"], css[themeId])}>{children}</div>
  );
};

export default Theme;
