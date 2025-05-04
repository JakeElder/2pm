import type { Meta, StoryObj } from "@storybook/react";
import * as SpaceList from "./SpaceList";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof SpaceList.Root> = {
  title: "Components/SpaceList",
  component: SpaceList.Root,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill center>
          <div style={{ width: 240 }}>
            <Story />
          </div>
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof SpaceList>;

export const Default: Story = {
  render() {
    return (
      <SpaceList.Root>
        <SpaceList.Channel active slug="universe" userCount={12} />
        <SpaceList.Channel slug="about-2pm" userCount={2} />
      </SpaceList.Root>
    );
  },
};

export default meta;
