import type { Meta, StoryObj } from "@storybook/react";
import RoomPresenceChange from "./RoomPresenceChange";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof RoomPresenceChange> = {
  title: "Plot Points/RoomPresenceChange",
  component: RoomPresenceChange,
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

type Story = StoryObj<typeof RoomPresenceChange>;

export const Entered: Story = {
  args: {
    type: "ENTRACE",
    tag: "jake",
  },
};

export const Left: Story = {
  args: {
    type: "EXIT",
    tag: "jake",
  },
};

export default meta;
