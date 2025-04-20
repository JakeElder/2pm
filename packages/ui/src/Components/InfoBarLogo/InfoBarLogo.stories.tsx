import type { Meta, StoryObj } from "@storybook/react";
import InfoBarLogo from "./InfoBarLogo";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof InfoBarLogo> = {
  title: "Components/InfoBarLogo",
  component: InfoBarLogo,
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

type Story = StoryObj<typeof InfoBarLogo>;

export const Default: Story = {
  args: {},
};

export default meta;
