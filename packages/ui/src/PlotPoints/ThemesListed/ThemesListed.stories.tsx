import type { Meta, StoryObj } from "@storybook/react";
import ThemeListed from "./ThemesListed";
import * as Frame from "../../Components/Frame";
import { DEFAULT_THEMES } from "@2pm/core";

const meta: Meta<typeof ThemeListed> = {
  title: "Plot Points/ThemeListed",
  component: ThemeListed,
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

type Story = StoryObj<typeof ThemeListed>;

export const Default: Story = {
  args: {
    themes: [DEFAULT_THEMES.dark, DEFAULT_THEMES.light],
  },
};

export default meta;
