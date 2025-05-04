import type { Meta, StoryObj } from "@storybook/react";
import UserTag from "./UserTag";
import * as Frame from "../Frame";
import * as users from "../../fixtures/users";

const meta: Meta<typeof UserTag> = {
  title: "Components/UserTag",
  component: UserTag,
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

type Story = StoryObj<typeof UserTag>;

export const Anonymous: Story = {
  args: users.ANONYMOUS,
};

export const Authenticated: Story = {
  args: users.AUTHENTICATED,
};

export const Ai: Story = {
  args: users.AI,
};

export default meta;
