import type { Meta, StoryObj } from "@storybook/react";
import * as UserList from "./UserList";
import * as Frame from "../../Components/Frame";
import * as users from "../../fixtures/users";

const meta: Meta<typeof UserList> = {
  title: "Components/UserList",
  component: UserList.Root,
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

type Story = StoryObj<typeof UserList>;

export const Default: Story = {
  args: {},
  render() {
    return (
      <UserList.Root>
        <UserList.User {...users.AI} />
        <UserList.User {...users.AUTHENTICATED} />
        <UserList.User {...users.ANONYMOUS} />
      </UserList.Root>
    );
  },
};

export default meta;
