import type { Meta, StoryObj } from "@storybook/react";
import * as InfoBar from "./InfoBar";
import * as Frame from "../../Components/Frame";
import InfoBarLogo from "../InfoBarLogo/InfoBarLogo";
import InfoBarUser from "../InfoBarUser/InfoBarUser";

const meta: Meta<typeof InfoBar.Root> = {
  title: "Components/InfoBar",
  component: InfoBar.Root,
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
  render() {
    return (
      <InfoBar.Root>
        <InfoBar.Logo>
          <InfoBarLogo />
        </InfoBar.Logo>
        <InfoBar.Separator />
        <InfoBar.User>
          <InfoBarUser name="anon" hash="uf4DyTAVLKBfDe6ky7mSoz" />
        </InfoBar.User>
      </InfoBar.Root>
    );
  },
};

export default meta;
