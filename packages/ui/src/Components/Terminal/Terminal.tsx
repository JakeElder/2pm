import React from "react";
import Image, { StaticImageData } from "next/image";
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
  image: StaticImageData;
  alt: string;
}

export const Avatar = ({ alt, image }: AvatarProps) => {
  return (
    <div className={css["avatar"]}>
      <Image {...image} alt={alt} style={{ width: 64, height: 64 }} />
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
