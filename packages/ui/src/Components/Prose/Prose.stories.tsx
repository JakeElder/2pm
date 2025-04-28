import type { Meta, StoryObj } from "@storybook/react";
import Prose from "./Prose";
import * as Frame from "../Frame";

const meta: Meta<typeof Prose> = {
  title: "Components/Prose",
  component: Prose,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill center>
          <div style={{ width: 300 }}>
            <Story />
          </div>
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof Prose>;

export const Default: Story = {
  args: {
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "thank " },
            { type: "text", marks: [{ type: "bold" }], text: "you" },
            { type: "text", text: " sir" },
          ],
        },
      ],
    },
  },
};

export const ReadOnly: Story = {
  args: {
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "thank " },
            { type: "text", marks: [{ type: "bold" }], text: "you" },
            { type: "text", text: " sir" },
          ],
        },
      ],
    },
    editable: false,
  },
};

export default meta;
