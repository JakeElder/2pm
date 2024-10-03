import type { Meta, StoryObj } from "@storybook/react";
import * as Terminal from "./Terminal";
import * as Narrative from "../Narrative";
import { Background } from "../Background";
import PromptSubmitButton from "../PromptSubmitButton";
import PromptInput from "../PromptInput";
import universe from "../../../public/images/universe.png";
import { Message } from "../PlotPoints";

const meta: Meta<typeof Terminal.Root> = {
  title: "Components/Terminal",
  component: Terminal.Root,
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

type Story = StoryObj<typeof Terminal.Root>;

const handle = "ivan";

export const Default: Story = {
  render() {
    return (
      <Terminal.Root>
        <Terminal.Foreground>
          <Terminal.AiAvatar code="IVAN" />
        </Terminal.Foreground>
        <Terminal.Main>
          <Terminal.Header handle={handle} />
          <Terminal.Body>
            <Terminal.Narrative></Terminal.Narrative>
          </Terminal.Body>
          <Terminal.Footer>{null}</Terminal.Footer>
        </Terminal.Main>
      </Terminal.Root>
    );
  },
};

export const Conversation: Story = {
  render() {
    const ConversationNarrative = () => (
      <Terminal.Narrative>
        <Narrative.Root>
          <Narrative.PlotPoint type="AI_MESSAGE" perspective="THIRD_PERSON">
            <Message perspective="THIRD_PERSON">Hi</Message>
          </Narrative.PlotPoint>
          <Narrative.PlotPoint type="HUMAN_MESSAGE" perspective="FIRST_PERSON">
            <Message perspective="FIRST_PERSON">Hi</Message>
          </Narrative.PlotPoint>
        </Narrative.Root>
      </Terminal.Narrative>
    );

    return (
      <Terminal.Root>
        <Terminal.Foreground>
          <Terminal.AiAvatar code="IVAN" />
        </Terminal.Foreground>
        <Terminal.Main>
          <Terminal.Header handle={handle} />
          <Terminal.Body>
            <ConversationNarrative />
          </Terminal.Body>
          <Terminal.Footer>
            <Terminal.Prompt>
              <Terminal.Input>
                <PromptInput />
              </Terminal.Input>
              <Terminal.SubmitButton>
                <PromptSubmitButton />
              </Terminal.SubmitButton>
            </Terminal.Prompt>
          </Terminal.Footer>
        </Terminal.Main>
      </Terminal.Root>
    );
  },
};

export default meta;
