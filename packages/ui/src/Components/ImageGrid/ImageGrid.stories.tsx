import type { Meta, StoryObj } from "@storybook/react";
import ImageGrid from "./ImageGrid";

const meta: Meta<typeof ImageGrid> = {
  title: "Components/ImageGrid",
  component: ImageGrid,
};

type Story = StoryObj<typeof ImageGrid>;

export const Default: Story = {
  args: {},
};

export default meta;
