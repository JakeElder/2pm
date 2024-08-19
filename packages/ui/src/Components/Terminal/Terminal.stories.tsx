import type { Meta, StoryObj } from "@storybook/react";
import * as Terminal from "./Terminal";
import ivan from "../../../public/images/ivan.png";

const meta: Meta<typeof Terminal.Root> = {
  title: "Components/Terminal",
  component: Terminal.Root,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
};

type Story = StoryObj<typeof Terminal.Root>;

export const Default: Story = {
  render() {
    return (
      <Terminal.Root>
        <Terminal.Foreground>
          <Terminal.Avatar image={ivan} alt="Ivan" />
        </Terminal.Foreground>
        <Terminal.Main>
          <Terminal.Header name="Ivan" />
        </Terminal.Main>
      </Terminal.Root>
    );
  },
};

export default meta;
