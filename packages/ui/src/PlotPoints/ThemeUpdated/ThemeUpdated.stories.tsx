import type { Meta, StoryObj } from "@storybook/react";
import * as ThemeUpdated from "./ThemeUpdated";
import * as Frame from "../../Components/Frame";
import { UserTag } from "../../Components";
import * as users from "../../fixtures/users";

const meta: Meta<typeof ThemeUpdated.Root> = {
  title: "Plot Points/ThemeUpdated",
  component: ThemeUpdated.Root,
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

type Story = StoryObj<typeof ThemeUpdated.Root>;

export const Default: Story = {
  render() {
    return (
      <ThemeUpdated.Root>
        <ThemeUpdated.Icon />
        <ThemeUpdated.Tag>
          <UserTag {...users.AUTHENTICATED} />
        </ThemeUpdated.Tag>
        <ThemeUpdated.Action themeName="light" />
      </ThemeUpdated.Root>
    );
  },
};

export default meta;
