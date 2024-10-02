import type { Meta, StoryObj } from "@storybook/react";
import Message from "./Message";

const meta: Meta<typeof Message> = {
  title: "Plot Points/Message",
  component: Message,
};

type Story = StoryObj<typeof Message>;

export const Default: Story = {
  args: {},
};

export default meta;
