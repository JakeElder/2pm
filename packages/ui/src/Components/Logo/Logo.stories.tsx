import type { Meta, StoryObj } from "@storybook/react";
import Logo from "./Logo";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill center>
          <Story />
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {},
};

export default meta;
