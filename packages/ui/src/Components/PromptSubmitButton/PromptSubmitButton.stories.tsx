import type { Meta, StoryObj } from "@storybook/react";
import PromptSubmitButton from "./PromptSubmitButton";

const meta: Meta<typeof PromptSubmitButton> = {
  title: "Components/PromptSubmitButton",
  component: PromptSubmitButton,
};

type Story = StoryObj<typeof PromptSubmitButton>;

export const Default: Story = {
  args: {},
};

export default meta;
