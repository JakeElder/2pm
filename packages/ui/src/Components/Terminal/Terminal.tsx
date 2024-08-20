import React from "react";
import Image from "next/image";
import css from "./Terminal.module.css";

/*
 * Root
 */

interface RootProps {
  children: React.ReactNode;
}

export const Root = ({ children }: RootProps) => {
  return <div className={css["root"]}>{children}</div>;
};

/*
 * Foreground
 */

interface ForegroundProps {
  children: React.ReactNode;
}

export const Foreground = ({ children }: ForegroundProps) => {
  return <div className={css["foreground"]}>{children}</div>;
};

/*
 * Main
 */

interface MainProps {
  children: React.ReactNode;
}

export const Main = ({ children }: MainProps) => {
  return <div className={css["main"]}>{children}</div>;
};

/*
 * Avatar
 */

interface AvatarProps {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const Avatar = ({ src, width, height, alt }: AvatarProps) => {
  return (
    <div className={css["avatar"]}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        style={{ width: 64, height: 64 }}
      />
    </div>
  );
};

/*
 * Header
 */

interface HeaderProps {
  name: string;
}

export const Header = ({ name }: HeaderProps) => {
  return (
    <header className={css["header"]}>
      <span className={css["name"]}>{name}</span>
    </header>
  );
};

/*
 * Body
 */

interface BodyProps {
  children: React.ReactNode;
}

export const Body = ({ children }: BodyProps) => {
  return <div className={css["body"]}>{children}</div>;
};

/*
 * Narrative
 */

interface NarrativeProps {
  children?: React.ReactNode;
}

export const Narrative = ({ children }: NarrativeProps) => {
  return <div className={css["narrative"]}>{children}</div>;
};

/*
 * Footer
 */

interface FooterProps {}

export const Footer = (props: FooterProps) => {
  return <div className={css["footer"]}></div>;
};
