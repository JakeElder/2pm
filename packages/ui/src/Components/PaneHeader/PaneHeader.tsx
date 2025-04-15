import React from "react";
import css from "./PaneHeader.module.css";

type Props = {
  children: React.ReactNode;
};

const PaneHeader = ({ children }: Props) => {
  return <div className={css["root"]}>{children}</div>;
};

export default PaneHeader;
