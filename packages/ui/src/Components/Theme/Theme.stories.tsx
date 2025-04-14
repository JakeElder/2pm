import type { Meta, StoryObj } from "@storybook/react";
import Theme from "./Theme";
import { Palette } from "../Palette";

const meta: Meta<typeof Theme> = {
  title: "Components/Theme",
  component: Theme,
};

type Story = StoryObj<typeof Theme>;

export const Default: Story = {
  args: {
    themeId: "frappe",
  },
  render: ({ themeId }) => {
    return (
      <Theme themeId={themeId}>
        <Palette />
      </Theme>
    );
  },
};

export default meta;
