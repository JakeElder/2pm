import type { Meta, StoryObj } from "@storybook/react";
import InfoBarUser from "./InfoBarUser";

const meta: Meta<typeof InfoBarUser> = {
  title: "Components/InfoBarUser",
  component: InfoBarUser,
};

type Story = StoryObj<typeof InfoBarUser>;

export const Default: Story = {
  args: {},
};

export default meta;
