import type { Meta, StoryObj } from "@storybook/react";
import Markdown from "./Markdown";

const meta: Meta<typeof Markdown> = {
  title: "Components/Markdown",
  component: Markdown
};

type Story = StoryObj<typeof Markdown>;

export const Default: Story = {
  args: {}
};

export default meta;
