import type { Meta, StoryObj } from "@storybook/react";
import PlotPointFrame from "./PlotPointFrame";

const meta: Meta<typeof PlotPointFrame> = {
  title: "Components/PlotPointFrame",
  component: PlotPointFrame,
};

type Story = StoryObj<typeof PlotPointFrame>;

export const Default: Story = {
  args: {},
};

export default meta;
