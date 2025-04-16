import React from "react";
import css from "./StandardPlotPoint.module.css";

type Props = {};

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
 * HeadingAndReference
 */

type HeadingAndReferenceProps = {
  children: React.ReactNode;
};

export const HeadingAndReference = ({ children }: HeadingAndReferenceProps) => {
  return <div className={css["heading-and-reference"]}>{children}</div>;
};

/*
 * Heading
 */

type HeadingProps = {
  children: React.ReactNode;
};

export const Heading = ({ children }: HeadingProps) => {
  return <div className={css["heading"]}>{children}</div>;
};

/*
 * Reference
 */

type ReferenceProps = {
  children: React.ReactNode;
};

export const Reference = ({ children }: ReferenceProps) => {
  return <div className={css["reference"]}>[{children}]</div>;
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
