import React from "react";
import Image from "next/image";
import css from "./Module.module.css";
import ivan from "../../../public/images/avatars/IVAN.png";
import { AiUserCode } from "@2pm/data";

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
 * Foreground
 */

type ForegroundProps = {
  children: React.ReactNode;
};

export const Foreground = ({ children }: ForegroundProps) => {
  return <div className={css["foreground"]}>{children}</div>;
};

/*
 * Main
 */

type MainProps = {
  children: React.ReactNode;
};

export const Main = ({ children }: MainProps) => {
  return <div className={css["main"]}>{children}</div>;
};

/*
 * Avatar
 */

type AvatarProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  style?: React.CSSProperties;
};

export const Avatar = ({ src, width, height, alt, style }: AvatarProps) => {
  return (
    <div className={css["avatar"]}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        style={{ width: 64, height: 64, ...style }}
      />
    </div>
  );
};

/*
 * AiAvatar
 */

type AiAvatarProps = {
  code: AiUserCode;
};

export const AiAvatar = ({ code }: AiAvatarProps) => {
  if (code === "IVAN") {
    return (
      <Avatar
        {...ivan}
        alt="Ivan"
        style={{
          width: 54,
          height: 54,
          position: "relative",
          left: -1,
          top: 1,
        }}
      />
    );
  }

  return null;
};

/*
 * Header
 */

type HeaderProps = {
  children: React.ReactNode;
};

export const Header = ({ children }: HeaderProps) => {
  return <header className={css["header"]}>{children}</header>;
};

/*
 * Handle
 */

type HandleProps = {
  children: string;
};

export const Handle = ({ children }: HandleProps) => {
  return <span className={css["handle"]}>@{children}</span>;
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
 * Narrative
 */

type NarrativeProps = {
  children?: React.ReactNode;
};

export const Narrative = ({ children }: NarrativeProps) => {
  return <div className={css["narrative"]}>{children}</div>;
};

/*
 * Footer
 */

type FooterProps = {
  children?: React.ReactNode;
};

export const Footer = ({ children }: FooterProps) => {
  return <div className={css["footer"]}>{children}</div>;
};

/*
 * Prompt
 */

type PromptProps = {
  children: React.ReactNode;
};

export const Prompt = ({ children }: PromptProps) => {
  return <div className={css["prompt"]}>{children}</div>;
};

/*
 * Input
 */

type InputProps = {
  children: React.ReactNode;
};

export const Input = ({ children }: InputProps) => {
  return <div className={css["input"]}>{children}</div>;
};

/*
 * SubmitButton
 */

type SubmitButtonProps = {
  children: React.ReactNode;
};

export const SubmitButton = ({ children }: SubmitButtonProps) => {
  return <div className={css["submit-button"]}>{children}</div>;
};
