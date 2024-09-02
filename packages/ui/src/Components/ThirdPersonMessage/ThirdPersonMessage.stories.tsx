import type { Meta, StoryObj } from "@storybook/react";
import ThirdPersonMessage from "./ThirdPersonMessage";

const meta: Meta<typeof ThirdPersonMessage> = {
  title: "Components/ThirdPersonMessage",
  component: ThirdPersonMessage,
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj<typeof ThirdPersonMessage>;

export const Default: Story = {
  args: { children: "Sure, I’ve added the e-mail address to our wait list." },
};

export default meta;
