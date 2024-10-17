import type { Meta, StoryObj } from "@storybook/react";
import * as Module from "./Module";
import * as Narrative from "../Narrative";
import * as Companion from "./CompanionOneToOne";
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
      <Companion.Root>
        <Companion.Avatar code="IVAN" />
        <Companion.Main>
          <Companion.Header>
            <Companion.Handle>ivan</Companion.Handle>
          </Companion.Header>
          <Companion.Body>
            <Body />
          </Companion.Body>
          <Companion.Footer>
            <Companion.Input>
              <PromptInput />
            </Companion.Input>
            <Companion.SubmitButton>
              <PromptSubmitButton />
            </Companion.SubmitButton>
          </Companion.Footer>
        </Companion.Main>
      </Companion.Root>
    );
  },
};

export default meta;
