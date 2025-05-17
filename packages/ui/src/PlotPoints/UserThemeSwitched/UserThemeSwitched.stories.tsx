import type { Meta, StoryObj } from "@storybook/react";
import * as UserThemeSwitched from "./UserThemeSwitched";
import * as Frame from "../../Components/Frame";
import { UserTag } from "../../Components";
import * as users from "../../fixtures/users";

const meta: Meta<typeof UserThemeSwitched.Root> = {
  title: "Plot Points/UserThemeSwitched",
  component: UserThemeSwitched.Root,
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

type Story = StoryObj<typeof UserThemeSwitched.Root>;

export const Default: Story = {
  render() {
    return (
      <UserThemeSwitched.Root>
        <UserThemeSwitched.Icon />
        <UserThemeSwitched.Tag>
          <UserTag {...users.AUTHENTICATED} />
        </UserThemeSwitched.Tag>
        <UserThemeSwitched.Action themeName="light" />
      </UserThemeSwitched.Root>
    );
  },
};

export default meta;
