import type { Meta, StoryObj } from "@storybook/react";
import * as Module from "./Module";
import * as Narrative from "../Narrative";
import { Background } from "../Background";
import PromptSubmitButton from "../PromptSubmitButton";
import PromptInput from "../PromptInput";
import universe from "../../../public/images/universe.png";
import { Message } from "../PlotPoints";

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

const handle = "ivan";

export const Default: Story = {
  render() {
    return (
      <Module.Root>
        <Module.Foreground>
          <Module.AiAvatar code="IVAN" />
        </Module.Foreground>
        <Module.Main>
          <Module.Header handle={handle} />
          <Module.Body>
            <Module.Narrative></Module.Narrative>
          </Module.Body>
          <Module.Footer>{null}</Module.Footer>
        </Module.Main>
      </Module.Root>
    );
  },
};

export const Conversation: Story = {
  render() {
    const ConversationNarrative = () => (
      <Module.Narrative>
        <Narrative.Root>
          <Narrative.PlotPoint
            type="AI_USER_MESSAGE"
            perspective="THIRD_PERSON"
          >
            <Message perspective="THIRD_PERSON">Hi</Message>
          </Narrative.PlotPoint>
          <Narrative.PlotPoint
            type="AUTHENTICATED_USER_MESSAGE"
            perspective="FIRST_PERSON"
          >
            <Message perspective="FIRST_PERSON">Hi</Message>
          </Narrative.PlotPoint>
        </Narrative.Root>
      </Module.Narrative>
    );

    return (
      <Module.Root>
        <Module.Foreground>
          <Module.AiAvatar code="IVAN" />
        </Module.Foreground>
        <Module.Main>
          <Module.Header handle={handle} />
          <Module.Body>
            <ConversationNarrative />
          </Module.Body>
          <Module.Footer>
            <Module.Prompt>
              <Module.Input>
                <PromptInput />
              </Module.Input>
              <Module.SubmitButton>
                <PromptSubmitButton />
              </Module.SubmitButton>
            </Module.Prompt>
          </Module.Footer>
        </Module.Main>
      </Module.Root>
    );
  },
};

export default meta;
