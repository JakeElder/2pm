import type { Meta, StoryObj } from "@storybook/react";
import Prose from "./Prose";
import * as Frame from "../Frame";
import * as prose from "../../fixtures/prose";
import * as users from "../../fixtures/users";

const meta: Meta<typeof Prose> = {
  title: "Components/Prose",
  component: Prose,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill center>
          <div style={{ width: 300 }}>
            <Story />
          </div>
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof Prose>;

export const Default: Story = {
  args: {
    content: prose.WITH_BOLD,
    suggestionItems: async ({ query }) => {
      return [users.AI]
        .filter((item) =>
          item.tag.toLowerCase().startsWith(query.toLowerCase()),
        )
        .slice(0, 5);
    },
  },
};

export const NoResults: Story = {
  args: {
    content: prose.WITH_BOLD,
    suggestionItems: async () => [],
  },
};

export const ReadOnly: Story = {
  args: {
    content: prose.WITH_BOLD,
    editable: false,
  },
};

export default meta;
