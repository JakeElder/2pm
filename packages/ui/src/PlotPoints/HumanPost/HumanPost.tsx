import React from "react";
import css from "./HumanPost.module.css";
import { format } from "date-fns";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return <div className={css["root"]}>{children}</div>;
};

/*
 * Header
 */

type HeaderProps = {
  children: React.ReactNode;
};

export const Header = ({ children }: HeaderProps) => {
  return <div className={css["header"]}>{children}</div>;
};

/*
 * Heading
 */

type HeadingProps = {
  children: React.ReactNode;
};

export const Heading = ({ children }: HeadingProps) => {
  return (
    <div className={css["heading"]}>
      <span className={css["icon"]}></span>
      {children}
    </div>
  );
};

/*
 * Text
 */

type TextProps = {
  children: React.ReactNode;
};

export const Text = ({ children }: TextProps) => {
  return <div className={css["text"]}>{children}</div>;
};

/*
 * Body
 */

type BodyProps = {
  children: React.ReactNode;
};

export const Body = ({ children }: BodyProps) => {
  return <div className={css["body"]}>{children}</div>;
};

/*
 * Images
 */

type ImagesProps = {
  children: React.ReactNode;
};

export const Images = ({ children }: ImagesProps) => {
  return <div className={css["images"]}>{children}</div>;
};

/*
 * Footer
 */

type FooterProps = {
  children: React.ReactNode;
};

export const Footer = ({ children }: FooterProps) => {
  return <div className={css["footer"]}>{children}</div>;
};

/*
 * Tag
 */

type TagProps = {
  children: React.ReactNode;
};

export const Tag = ({ children }: TagProps) => {
  return <div className={css["tag"]}>{children}</div>;
};

/*
 * Date
 */

type DateProps = {
  date: Date;
};

export const Date = ({ date }: DateProps) => {
  return (
    <div className={css["date"]}>
      <div className={css["date-prefix"]}>was here</div>
      <div className={css["formatted-date"]}>
        {format(date, "do 'of' MMMM yyyy")}
      </div>
    </div>
  );
};
