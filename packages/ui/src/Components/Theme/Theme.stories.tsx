import type { Meta, StoryObj } from "@storybook/react";
import Theme from "./Theme";
import { Palette } from "../Palette";
import { DEFAULT_THEMES } from "@2pm/core";

const meta: Meta<typeof Theme> = {
  title: "Components/Theme",
  parameters: { layout: "centered" },
  component: Theme,
};

type Story = StoryObj<typeof Theme>;

export const Default: Story = {
  render: () => {
    return (
      <Theme theme={DEFAULT_THEMES.dark}>
        <Palette />
      </Theme>
    );
  },
};

export default meta;
