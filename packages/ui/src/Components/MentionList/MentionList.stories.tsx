import type { Meta, StoryObj } from "@storybook/react";
import MentionList from "./MentionList";

const meta: Meta<typeof MentionList> = {
  title: "Components/MentionList",
  component: MentionList,
};

type Story = StoryObj<typeof MentionList>;

export const Default: Story = {
  args: {},
};

export default meta;
