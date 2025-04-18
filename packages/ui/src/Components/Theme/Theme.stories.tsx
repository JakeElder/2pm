import type { Meta, StoryObj } from "@storybook/react";
import Theme from "./Theme";
import { Palette } from "../Palette";

const meta: Meta<typeof Theme> = {
  title: "Components/Theme",
  parameters: { layout: "centered" },
  component: Theme,
};

type Story = StoryObj<typeof Theme>;

export const Default: Story = {
  args: {
    defaultThemeId: "frappe",
  },
  render: () => {
    return (
      <Theme>
        <Palette />
      </Theme>
    );
  },
};

export default meta;
