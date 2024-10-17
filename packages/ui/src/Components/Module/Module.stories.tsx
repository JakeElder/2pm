import type { Meta, StoryObj } from "@storybook/react";
import * as Module from "./Module";
import * as Narrative from "../Narrative";
import * as CompanionOneToOne from "./CompanionOneToOne";
import * as WorldRoom from "./WorldRoom";
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

export const CompanionOneToOneModule: Story = {
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
      <CompanionOneToOne.Root>
        <CompanionOneToOne.Avatar code="IVAN" />
        <CompanionOneToOne.Main>
          <CompanionOneToOne.Header>
            <CompanionOneToOne.Handle>ivan</CompanionOneToOne.Handle>
          </CompanionOneToOne.Header>
          <CompanionOneToOne.Body>
            <Body />
          </CompanionOneToOne.Body>
          <CompanionOneToOne.Footer>
            <CompanionOneToOne.Input>
              <PromptInput />
            </CompanionOneToOne.Input>
            <CompanionOneToOne.SubmitButton>
              <PromptSubmitButton />
            </CompanionOneToOne.SubmitButton>
          </CompanionOneToOne.Footer>
        </CompanionOneToOne.Main>
      </CompanionOneToOne.Root>
    );
  },
};

export const WorldRoomModule: Story = {
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
      <WorldRoom.Root>
        <WorldRoom.Main>
          <WorldRoom.Header code="UNIVERSE" channel="universe" />
          <WorldRoom.Body>
            <Body />
          </WorldRoom.Body>
          <WorldRoom.Footer>
            <WorldRoom.Input>
              <PromptInput />
            </WorldRoom.Input>
            <WorldRoom.SubmitButton>
              <PromptSubmitButton />
            </WorldRoom.SubmitButton>
          </WorldRoom.Footer>
        </WorldRoom.Main>
      </WorldRoom.Root>
    );
  },
};

export default meta;
