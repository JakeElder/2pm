import type { Meta, StoryObj } from "@storybook/react";
import FirstPersonMessage from "./FirstPersonMessage";

const meta: Meta<typeof FirstPersonMessage> = {
  title: "Components/FirstPersonMessage",
  component: FirstPersonMessage,
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj<typeof FirstPersonMessage>;

export const Default: Story = {
  args: { children: "My email address is jake@2pm.io" },
};

export default meta;
