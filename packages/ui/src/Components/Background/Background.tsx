import React from "react";
import css from "./Background.module.css";

interface BackgroundProps {
  children: React.ReactNode;
  src: string;
}

export const Background = ({ src, children }: BackgroundProps) => {
  return (
    <div className={css["root"]} style={{ backgroundImage: `url(${src})` }}>
      {children}
    </div>
  );
};

export default Background;
