import type { Meta, StoryObj } from "@storybook/react";
import SpaceList from "./SpaceList";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof SpaceList> = {
  title: "Components/SpaceList",
  component: SpaceList,
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

type Story = StoryObj<typeof SpaceList>;

export const Default: Story = {
  args: {},
};

export default meta;
