import type { Meta, StoryObj } from "@storybook/react";
import * as Terminal from "./Terminal";
import * as Narrative from "../Narrative";
import { Background } from "../Background";
import FirstPersonMessage from "../FirstPersonMessage";
import ThirdPersonMessage from "../ThirdPersonMessage";
import ivan from "../../../public/images/ivan.png";
import universe from "../../../public/images/universe.png";

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

export const Default: Story = {
  render() {
    const name = "Ivan";

    return (
      <Terminal.Root>
        <Terminal.Foreground>
          <Terminal.Avatar {...ivan} alt={name} />
        </Terminal.Foreground>
        <Terminal.Main>
          <Terminal.Header name={name} />
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
    const name = "Ivan";

    return (
      <Terminal.Root>
        <Terminal.Foreground>
          <Terminal.Avatar {...ivan} alt={name} />
        </Terminal.Foreground>
        <Terminal.Main>
          <Terminal.Header name={name} />
          <Terminal.Body>
            <Terminal.Narrative>
              <Narrative.Root>
                <Narrative.FirstPersonMessage>
                  <FirstPersonMessage>
                    My email address is jake@2pm.io
                  </FirstPersonMessage>
                </Narrative.FirstPersonMessage>
                <Narrative.ThirdPersonMessage>
                  <ThirdPersonMessage>
                    Sure, I’ve added the e-mail address to our wait list.
                  </ThirdPersonMessage>
                </Narrative.ThirdPersonMessage>
              </Narrative.Root>
            </Terminal.Narrative>
          </Terminal.Body>
          <Terminal.Footer>{null}</Terminal.Footer>
        </Terminal.Main>
      </Terminal.Root>
    );
  },
};

export default meta;
