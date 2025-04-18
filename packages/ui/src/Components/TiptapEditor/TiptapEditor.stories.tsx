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
  args: {},
};

export default meta;
