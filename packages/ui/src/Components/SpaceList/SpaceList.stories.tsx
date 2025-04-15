import type { Meta, StoryObj } from "@storybook/react";
import SpaceList from "./SpaceList";

const meta: Meta<typeof SpaceList> = {
  title: "Components/SpaceList",
  component: SpaceList,
};

type Story = StoryObj<typeof SpaceList>;

export const Default: Story = {
  args: {},
};

export default meta;
