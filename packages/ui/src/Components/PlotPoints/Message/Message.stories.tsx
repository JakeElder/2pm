import type { Meta, StoryObj } from "@storybook/react";
import Message from "./Message";

const meta: Meta<typeof Message> = {
  title: "Plot Points/Message",
  component: Message,
};

type Story = StoryObj<typeof Message>;

export const FirstPerson: Story = {
  args: {
    perspective: "FIRST_PERSON",
    children: "Hi",
  },
};

export const ThirdPerson: Story = {
  args: {
    perspective: "THIRD_PERSON",
    children: "Hi",
  },
};

export default meta;
