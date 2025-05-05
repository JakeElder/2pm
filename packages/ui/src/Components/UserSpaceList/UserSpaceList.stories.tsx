import type { Meta, StoryObj } from "@storybook/react";
import UserSpaceList from "./UserSpaceList";

const meta: Meta<typeof UserSpaceList> = {
  title: "Components/UserSpaceList",
  component: UserSpaceList,
};

type Story = StoryObj<typeof UserSpaceList>;

export const Default: Story = {
  args: {},
};

export default meta;
