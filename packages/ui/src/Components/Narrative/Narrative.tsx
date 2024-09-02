import React from "react";
import css from "./Narrative.module.css";
import classNames from "classnames";

/**
 * Root
 */

interface RootProps {
  children: React.ReactNode;
}

export const Root = ({ children }: RootProps) => {
  return <div className={css["root"]}>{children}</div>;
};

/*
 * FirstPersonMessage
 */

interface FirstPersonMessageProps {
  children: React.ReactNode;
}

export const FirstPersonMessage = ({ children }: FirstPersonMessageProps) => {
  return (
    <div className={classNames(css["plot-point"], css["first-person-message"])}>
      {children}
    </div>
  );
};

/*
 * ThirdPersonMessage
 */

interface ThirdPersonMessageProps {
  children: React.ReactNode;
}

export const ThirdPersonMessage = ({ children }: ThirdPersonMessageProps) => {
  return (
    <div className={classNames(css["plot-point"], css["third-person-message"])}>
      {children}
    </div>
  );
};
