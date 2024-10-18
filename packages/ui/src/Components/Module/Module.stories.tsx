import type { Meta, StoryObj } from "@storybook/react";
import * as Module from "./Module";
import * as Narrative from "../Narrative";
import * as CompanionOneToOneModule from "./CompanionOneToOneModule";
import * as WorldRoomModule from "./WorldRoomModule";
import * as UserModule from "./UserModule";
import { Background } from "../Background";
import PromptSubmitButton from "../PromptSubmitButton";
import PromptInput from "../PromptInput";
import { Message } from "../PlotPoints";
import universe from "../../../public/images/channels/UNIVERSE.png";

const meta: Meta<typeof Module.Root> = {
  title: "Components/Module",
  component: Module.Root,
  decorators: [
    (Component) => (
      <Background src={universe.src}>
        <div
          style={{
            boxSizing: "border-box",
            padding: 50,
            height: "100dvh",
          }}
        >
          <Component />
        </div>
      </Background>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Module.Root>;

export const CompanionOneToOne: Story = {
  render() {
    const Body = () => (
      <Narrative.Root>
        <Narrative.PlotPoint type="AI_USER_MESSAGE" perspective="THIRD_PERSON">
          <Message perspective="THIRD_PERSON">Hi</Message>
        </Narrative.PlotPoint>
        <Narrative.PlotPoint
          type="AUTHENTICATED_USER_MESSAGE"
          perspective="FIRST_PERSON"
        >
          <Message perspective="FIRST_PERSON">Hi</Message>
        </Narrative.PlotPoint>
      </Narrative.Root>
    );

    return (
      <CompanionOneToOneModule.Root>
        <CompanionOneToOneModule.Avatar code="IVAN" />
        <CompanionOneToOneModule.Main>
          <CompanionOneToOneModule.Header handle="ivan" />
          <CompanionOneToOneModule.Body>
            <Body />
          </CompanionOneToOneModule.Body>
          <CompanionOneToOneModule.Footer>
            <CompanionOneToOneModule.Input>
              <PromptInput />
            </CompanionOneToOneModule.Input>
            <CompanionOneToOneModule.SubmitButton>
              <PromptSubmitButton />
            </CompanionOneToOneModule.SubmitButton>
          </CompanionOneToOneModule.Footer>
        </CompanionOneToOneModule.Main>
      </CompanionOneToOneModule.Root>
    );
  },
};

export const WorldRoom: Story = {
  render() {
    const Body = () => (
      <Narrative.Root>
        <Narrative.PlotPoint type="AI_USER_MESSAGE" perspective="THIRD_PERSON">
          <Message perspective="THIRD_PERSON">Hi</Message>
        </Narrative.PlotPoint>
        <Narrative.PlotPoint
          type="AUTHENTICATED_USER_MESSAGE"
          perspective="FIRST_PERSON"
        >
          <Message perspective="FIRST_PERSON">Hi</Message>
        </Narrative.PlotPoint>
      </Narrative.Root>
    );

    return (
      <WorldRoomModule.Root>
        <WorldRoomModule.Header code="UNIVERSE" channel="universe" />
        <WorldRoomModule.Body>
          <Body />
        </WorldRoomModule.Body>
        <WorldRoomModule.Footer>
          <WorldRoomModule.Input>
            <PromptInput />
          </WorldRoomModule.Input>
          <WorldRoomModule.SubmitButton>
            <PromptSubmitButton />
          </WorldRoomModule.SubmitButton>
        </WorldRoomModule.Footer>
      </WorldRoomModule.Root>
    );
  },
};

export const User: Story = {
  render() {
    return (
      <UserModule.Root>
        <UserModule.Header>
          <UserModule.Tag>{null}</UserModule.Tag>
          <UserModule.Level>{null}</UserModule.Level>
        </UserModule.Header>
        <UserModule.Body>
          <UserModule.Avatar>{null}</UserModule.Avatar>
          <UserModule.Rep>{null}</UserModule.Rep>
        </UserModule.Body>
      </UserModule.Root>
    );
  },
};

export default meta;
