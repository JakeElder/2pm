import type { Meta, StoryObj } from "@storybook/react";
import * as AiMentionList from "./AiMentionList";
import * as Frame from "../../Components/Frame";
import * as users from "../../fixtures/users";

const meta: Meta<typeof AiMentionList.Root> = {
  title: "Components/AiMentionList",
  component: AiMentionList.Root,
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

type Story = StoryObj<typeof AiMentionList.Root>;

export const Default: Story = {
  render() {
    return (
      <AiMentionList.Root>
        <AiMentionList.User user={users.AI} />
        <AiMentionList.User user={users.AI} />
      </AiMentionList.Root>
    );
  },
};

export default meta;
