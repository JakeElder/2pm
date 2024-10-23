import css from "./Module.module.css";
import * as Module from "./Module";
import tag from "../../../public/images/tag.png";
import anonymous from "../../../public/images/anonymous.png";
import Image from "next/image";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return (
    <Module.Root>
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
  const { blurWidth, blurHeight, ...img } = tag;
  return (
    <div className={css["user-tag"]}>
      <Image className={css["tag-icon"]} {...img} alt="tag" />
      <div>@{children}</div>
    </div>
  );
};

/*
 * Level
 */

type LevelProps = {
  children: number;
};

export const Level = ({ children }: LevelProps) => {
  return (
    <div className={css["level"]}>
      <div className={css["label"]}>LVL</div>
      <div className={css["number"]}>{children}</div>
    </div>
  );
};

/*
 * Body
 */

type BodyProps = {
  children: React.ReactNode;
};

export const Body = ({ children }: BodyProps) => {
  return (
    <Module.Body>
      <div className={css["user-body"]}>{children}</div>
    </Module.Body>
  );
};

/*
 * Avatar
 */

type AvatarProps = {};

export const Avatar = (props: AvatarProps) => {
  const { blurHeight, blurWidth, ...img } = anonymous;
  return (
    <div className={css["user-avatar"]}>
      <div className={css["outer"]}>
        <div className={css["inner"]}>
          <Image className={css["user-avatar-img"]} {...img} alt="anonymous" />
        </div>
      </div>
    </div>
  );
};

/*
 * Rep
 */

type RepProps = {
  children: React.ReactNode;
};

export const Rep = ({ children }: RepProps) => {
  return (
    <div className={css["rep"]}>
      <div className={css["rep-title"]}>REP</div>
      <div className={css["rep-number"]}>{children}</div>
    </div>
  );
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
