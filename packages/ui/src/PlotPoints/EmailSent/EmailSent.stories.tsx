import type { Meta, StoryObj } from "@storybook/react";
import EmailSent from "./EmailSent";

const meta: Meta<typeof EmailSent> = {
  title: "Plot Points/EmailSent",
  component: EmailSent,
};

type Story = StoryObj<typeof EmailSent>;

export const Default: Story = {
  args: {},
};

export default meta;
