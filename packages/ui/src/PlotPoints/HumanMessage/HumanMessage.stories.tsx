import type { Meta, StoryObj } from "@storybook/react";
import HumanMessage from "./HumanMessage";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof HumanMessage> = {
  title: "Plot Points/HumanMessage",
  component: HumanMessage,
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

type Story = StoryObj<typeof HumanMessage>;

export const Default: Story = {
  args: {
    tag: "jake",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "thank you" },
            { type: "text", text: " sir", marks: [{ type: "bold" }] },
          ],
        },
      ],
    },
  },
};

export default meta;
