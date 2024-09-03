import type { Meta, StoryObj } from "@storybook/react";
import PromptInput from "./PromptInput";

const meta: Meta<typeof PromptInput> = {
  title: "Components/PromptInput",
  component: PromptInput,
};

type Story = StoryObj<typeof PromptInput>;

export const Default: Story = {
  args: {},
};

export default meta;
