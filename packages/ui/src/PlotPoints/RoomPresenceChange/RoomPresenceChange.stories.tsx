import type { Meta, StoryObj } from "@storybook/react";
import * as RoomPresenceChange from "./RoomPresenceChange";
import * as Frame from "../../Components/Frame";
import { UserTag } from "../../Components";
import * as users from "../../fixtures/users";

const meta: Meta<typeof RoomPresenceChange.Root> = {
  title: "Plot Points/RoomPresenceChange",
  component: RoomPresenceChange.Root,
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

type Story = StoryObj<typeof RoomPresenceChange.Root>;
export const Entered: Story = {
  args: {},
  render() {
    return (
      <RoomPresenceChange.Root type="ENTRACE">
        <RoomPresenceChange.Icon />
        <RoomPresenceChange.Tag>
          <UserTag {...users.AUTHENTICATED} />
        </RoomPresenceChange.Tag>
        <RoomPresenceChange.Action />
      </RoomPresenceChange.Root>
    );
  },
};

export const Left: Story = {
  args: {},
  render() {
    return (
      <RoomPresenceChange.Root type="EXIT">
        <RoomPresenceChange.Icon />
        <RoomPresenceChange.Tag>
          <UserTag {...users.AUTHENTICATED} />
        </RoomPresenceChange.Tag>
        <RoomPresenceChange.Action />
      </RoomPresenceChange.Root>
    );
  },
};

export default meta;
