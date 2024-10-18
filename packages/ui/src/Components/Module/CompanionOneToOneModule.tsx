import css from "./Module.module.css";
import * as Module from "./Module";
import Badge from "../Badge";

/*
 * Root
 */

type RootProps = {
  children: React.ReactNode;
};

export const Root = ({ children }: RootProps) => {
  return <Module.Root expand>{children}</Module.Root>;
};

/*
 * Avatar
 */

type AvatarProps = React.ComponentProps<typeof Module.AiAvatar>;

export const Avatar = (props: AvatarProps) => {
  return (
    <Module.Foreground>
      <Module.AiAvatar {...props} />
    </Module.Foreground>
  );
};

/*
 * Main
 */

type MainProps = React.ComponentProps<typeof Module.Main>;

export const Main = (props: MainProps) => {
  return <Module.Main {...props} />;
};

/*
 * Header
 */

type HeaderProps = {
  handle: string;
};

export const Header = ({ handle }: HeaderProps) => {
  return (
    <Module.Header>
      <div className={css["handle"]}>@{handle}</div>
      <div className={css["badge"]}>
        <Badge icon="LOCK">Private</Badge>
      </div>
    </Module.Header>
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
      <Module.Narrative>{children}</Module.Narrative>
    </Module.Body>
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
