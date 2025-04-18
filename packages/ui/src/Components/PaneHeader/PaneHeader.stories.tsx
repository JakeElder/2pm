import type { Meta, StoryObj } from "@storybook/react";
import PaneHeader from "./PaneHeader";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof PaneHeader> = {
  title: "Components/PaneHeader",
  component: PaneHeader,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill>
          <div style={{ maxWidth: 200 }}>
            <Story />
          </div>
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof PaneHeader>;

export const Default: Story = {
  args: {
    children: " Spaces",
  },
};

export default meta;
