import type { Meta, StoryObj } from "@storybook/react";
import UserList from "./UserList";

const meta: Meta<typeof UserList> = {
  title: "Components/UserList",
  component: UserList,
};

type Story = StoryObj<typeof UserList>;

export const Default: Story = {
  args: {},
};

export default meta;
