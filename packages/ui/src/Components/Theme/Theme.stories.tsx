import type { Meta, StoryObj } from "@storybook/react";
import { DEFAULT_THEMES } from "@2pm/core";
import Theme from "./Theme";
import * as Frame from "../Frame";

const meta: Meta<typeof Theme> = {
  title: "Components/Theme",
  component: Theme,
  decorators: [
    (Story) => {
      return (
        <Frame.PlotPoint>
          <Story />
        </Frame.PlotPoint>
      );
    },
  ],
};

type Story = StoryObj<typeof Theme>;

export const Default: Story = {
  args: DEFAULT_THEMES.dark,
};

export default meta;
