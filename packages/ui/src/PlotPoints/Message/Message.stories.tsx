import type { Meta, StoryObj } from "@storybook/react";
import Message from "./Message";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof Message> = {
  title: "Plot Points/Message",
  component: Message,
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

type Story = StoryObj<typeof Message>;

export const Default: Story = {
  args: {
    type: "AI",
    user: "niko",
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
