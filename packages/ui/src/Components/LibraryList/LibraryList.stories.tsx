import type { Meta, StoryObj } from "@storybook/react";
import * as LibraryList from "./LibraryList";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof LibraryList.Root> = {
  title: "Components/LibraryList",
  component: LibraryList.Root,
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

type Story = StoryObj<typeof LibraryList>;

export const Default: Story = {
  render() {
    return (
      <LibraryList.Root>
        <LibraryList.Resource>*[the-pali-canon]</LibraryList.Resource>
        <LibraryList.Resource>*[the-bible]</LibraryList.Resource>
        <LibraryList.Resource>*[meditations]</LibraryList.Resource>
        <LibraryList.Resource>*[the-us-constitution]</LibraryList.Resource>
      </LibraryList.Root>
    );
  },
};

export default meta;
