import type { Meta, StoryObj } from "@storybook/react";
import * as StandardLayout from "./StandardLayout";

const meta: Meta<typeof StandardLayout.Root> = {
  title: "Layouts/StandardLayout",
  component: StandardLayout.Root,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof StandardLayout>;

export const Default: Story = {
  render() {
    return <StandardLayout.Root>{null}</StandardLayout.Root>;
  },
};

export default meta;
