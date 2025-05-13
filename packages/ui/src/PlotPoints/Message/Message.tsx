import React from "react";
import css from "./Message.module.css";
import { default as ReactMarkdown } from "react-markdown";

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
 * User
 */

type UserProps = {
  children: React.ReactNode;
};

export const User = ({ children }: UserProps) => {
  return <div className={css["user"]}>{children}</div>;
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
 * Markdown
 */

type MarkdownProps = {
  children: React.ComponentProps<typeof ReactMarkdown>["children"];
};

export const Markdown = ({ children }: MarkdownProps) => {
  return (
    <div className={css["markdown"]}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};
