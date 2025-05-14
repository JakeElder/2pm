import type { Meta, StoryObj } from "@storybook/react";
import * as EnvironmentUserList from "./EnvironmentUserList";
import * as Frame from "../Frame";
import * as users from "../../fixtures/users";

const meta: Meta<typeof EnvironmentUserList> = {
  title: "Components/EnvironmentUserList",
  component: EnvironmentUserList.Root,
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

type Story = StoryObj<typeof EnvironmentUserList>;

export const Default: Story = {
  args: {},
  render() {
    return (
      <EnvironmentUserList.Root>
        <EnvironmentUserList.User type="AI" data={users.AI} />
        <EnvironmentUserList.User {...users.AUTHENTICATED} />
        <EnvironmentUserList.User {...users.ANONYMOUS} showHash />
      </EnvironmentUserList.Root>
    );
  },
};

export default meta;
