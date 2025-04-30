import type { Meta, StoryObj } from "@storybook/react";
import InfoBarAiState from "./InfoBarAiState";

const meta: Meta<typeof InfoBarAiState> = {
  title: "Components/InfoBarAiState",
  component: InfoBarAiState,
};

type Story = StoryObj<typeof InfoBarAiState>;

export const Default: Story = {
  args: {},
};

export default meta;
