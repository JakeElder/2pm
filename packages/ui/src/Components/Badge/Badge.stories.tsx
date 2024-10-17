import type { Meta, StoryObj } from "@storybook/react";
import Badge from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
};

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {},
};

export default meta;
