import type { Meta, StoryObj } from "@storybook/react";
import PaneHeader from "./PaneHeader";

const meta: Meta<typeof PaneHeader> = {
  title: "Components/PaneHeader",
  component: PaneHeader,
};

type Story = StoryObj<typeof PaneHeader>;

export const Default: Story = {
  args: {},
};

export default meta;
