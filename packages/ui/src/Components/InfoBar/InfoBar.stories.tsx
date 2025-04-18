import type { Meta, StoryObj } from "@storybook/react";
import InfoBar from "./InfoBar";
import * as Frame from "../../Components/Frame";

const meta: Meta<typeof InfoBar> = {
  title: "Components/InfoBar",
  component: InfoBar,
  decorators: [
    (Story) => {
      return (
        <Frame.Generic fill>
          <div
            style={{
              display: "flex",
              width: "100dvw",
              height: "100dvh",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                borderTop: "1px solid var(--surface0)",
                borderBottom: "1px solid var(--surface0)",
              }}
            >
              <Story />
            </div>
          </div>
        </Frame.Generic>
      );
    },
  ],
};

type Story = StoryObj<typeof InfoBar>;

export const Default: Story = {
  args: {},
};

export default meta;
