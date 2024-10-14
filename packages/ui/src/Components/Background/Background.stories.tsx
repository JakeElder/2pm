import type { Meta, StoryObj } from "@storybook/react";
import Background from "./Background";

const meta: Meta<typeof Background> = {
  title: "Components/Background",
  component: Background,
};

type Story = StoryObj<typeof Background>;

export const Default: Story = {
  args: {},
};

export default meta;
