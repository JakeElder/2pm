import type { Meta, StoryObj } from "@storybook/react";
import InfoBarUser from "./InfoBarUser";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof InfoBarUser> = {
  title: "Components/InfoBarUser",
  component: InfoBarUser,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill center>
          <div style={{ maxWidth: 200 }}>
            <Story />
          </div>
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof InfoBarUser>;

export const Default: Story = {
  args: {},
};

export default meta;
