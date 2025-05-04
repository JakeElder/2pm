import type { Meta, StoryObj } from "@storybook/react";
import * as Message from "./Message";
import { Prose, UserTag } from "../../Components";
import * as users from "../../fixtures/users";
import * as prose from "../../fixtures/prose";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof Message.Root> = {
  title: "Plot Points/Message",
  component: Message.Root,
  decorators: [
    (Story) => {
      return (
        <Frame.PlotPoint>
          <Story />
        </Frame.PlotPoint>
      );
    },
  ],
};

type Story = StoryObj<typeof Message>;

export const AuthenticatedHuman: Story = {
  args: {},
  render() {
    return (
      <Message.Root>
        <Message.Header>
          <UserTag {...users.AUTHENTICATED} />
        </Message.Header>
        <Message.Body>
          <Prose editable={false} content={prose.WITH_BOLD} />
        </Message.Body>
      </Message.Root>
    );
  },
};

export const Ai: Story = {
  args: {},
  render() {
    return (
      <Message.Root>
        <Message.Header>
          <UserTag {...users.AI} />
        </Message.Header>
        <Message.Body>
          Lorem ipsum dolor sit amet, [1] adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </Message.Body>
      </Message.Root>
    );
  },
};

export default meta;
