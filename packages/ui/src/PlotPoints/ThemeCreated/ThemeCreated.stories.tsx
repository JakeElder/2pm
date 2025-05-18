import type { Meta, StoryObj } from "@storybook/react";
import ThemeCreated from "./ThemeCreated";
import * as Frame from "../../Components/Frame";
import { DEFAULT_THEMES } from "@2pm/core";

const meta: Meta<typeof ThemeCreated> = {
  title: "Plot Points/ThemeCreated",
  component: ThemeCreated,
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

type Story = StoryObj<typeof ThemeCreated>;

export const Default: Story = {
  args: {
    theme: DEFAULT_THEMES.dark,
  },
};

export default meta;
