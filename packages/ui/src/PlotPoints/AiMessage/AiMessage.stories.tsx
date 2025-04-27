import type { Meta, StoryObj } from "@storybook/react";
import AiMessage from "./AiMessage";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof AiMessage> = {
  title: "Plot Points/AiMessage",
  component: AiMessage,
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

type Story = StoryObj<typeof AiMessage>;

export const Default: Story = {
  args: {
    tag: "niko",
    children: (
      <>
        Lorem ipsum dolor sit amet, [1] adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </>
    ),
  },
};

export default meta;
