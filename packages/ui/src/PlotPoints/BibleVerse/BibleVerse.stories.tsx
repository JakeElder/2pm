import type { Meta, StoryObj } from "@storybook/react";
import BibleVerse from "./BibleVerse";

const meta: Meta<typeof BibleVerse> = {
  title: "Plot Points/BibleVerse",
  component: BibleVerse,
};

type Story = StoryObj<typeof BibleVerse>;

export const Default: Story = {
  args: {},
};

export default meta;
