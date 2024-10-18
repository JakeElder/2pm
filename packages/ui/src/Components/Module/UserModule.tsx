import css from "./Module.module.css";
import * as Module from "./Module";
import { WorldRoomCode } from "@2pm/data";
import UNIVERSE from "../../../public/images/medallions/UNIVERSE.png";
import Image, { StaticImageData } from "next/image";
import Badge from "../Badge";

/*
 * Root
 */

const medallions: Record<WorldRoomCode, StaticImageData> = {
  UNIVERSE,
};

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return (
    <Module.Root fill={false}>
      <Module.Main>{children}</Module.Main>
    </Module.Root>
  );
};

/*
 * Header
 */

type HeaderProps = {
  children: React.ReactNode;
};

export const Header = ({ children }: HeaderProps) => {
  return (
    <Module.Header>
      <div className={css["user-header"]}>{children}</div>
    </Module.Header>
  );
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
 * Level
 */

type LevelProps = {
  children: React.ReactNode;
};

export const Level = ({ children }: LevelProps) => {
  return <div className={css["level"]}>{children}</div>;
};

/*
 * Body
 */

type BodyProps = {
  children: React.ReactNode;
};

export const Body = ({ children }: BodyProps) => {
  return <Module.Body>{children}</Module.Body>;
};

/*
 * Avatar
 */

type AvatarProps = {
  children: React.ReactNode;
};

export const Avatar = ({ children }: AvatarProps) => {
  return <div className={css["user-avatar"]}>{children}</div>;
};

/*
 * Rep
 */

type RepProps = {
  children: React.ReactNode;
};

export const Rep = ({ children }: RepProps) => {
  return <div className={css["rep"]}>{children}</div>;
};

/*
 * Footer
 */

type FooterProps = {
  children: React.ReactNode;
};

export const Footer = ({ children }: FooterProps) => {
  return (
    <Module.Footer>
      <Module.Prompt>{children}</Module.Prompt>
    </Module.Footer>
  );
};

/*
 * Input
 */

type InputProps = React.ComponentProps<typeof Module.Input>;

export const Input = (props: InputProps) => {
  return <Module.Input {...props} />;
};

/*
 * SubmitButton
 */

type SubmitButtonProps = React.ComponentProps<typeof Module.SubmitButton>;

export const SubmitButton = (props: SubmitButtonProps) => {
  return <Module.SubmitButton {...props} />;
};
