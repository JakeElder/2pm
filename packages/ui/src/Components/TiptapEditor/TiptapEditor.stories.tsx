import type { Meta, StoryObj } from "@storybook/react";
import TiptapEditor from "./TiptapEditor";
import * as Frame from "../Frame";

const meta: Meta<typeof TiptapEditor> = {
  title: "Components/TiptapEditor",
  component: TiptapEditor,
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

type Story = StoryObj<typeof TiptapEditor>;

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
