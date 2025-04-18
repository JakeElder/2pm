import type { Meta, StoryObj } from "@storybook/react";
import TiptapEditor from "./TiptapEditor";

const meta: Meta<typeof TiptapEditor> = {
  title: "Components/TiptapEditor",
  component: TiptapEditor,
};

type Story = StoryObj<typeof TiptapEditor>;

export const Default: Story = {
  args: {},
};

export default meta;
