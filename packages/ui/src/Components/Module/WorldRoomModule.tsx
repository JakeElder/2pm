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
    <Module.Root expand>
      <Module.Main>{children}</Module.Main>
    </Module.Root>
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
  code: WorldRoomCode;
  channel: string;
};

export const Header = ({ code, channel }: HeaderProps) => {
  return (
    <Module.Header>
      <div className={css["world-room-header"]}>
        <div className={css["medallion"]}>
          <Image
            {...medallions[code]}
            alt={code}
            style={{ width: 25, height: 25 }}
          />
        </div>
        <div className={css["channel"]}>#{channel}</div>
        <div className={css["badge"]}>
          <Badge icon="STARS">Public</Badge>
        </div>
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
