import type { Meta, StoryObj } from "@storybook/react";
import * as InfoBar from "./InfoBar";
import * as Frame from "../../Components/Frame";
import InfoBarLogo from "../InfoBarLogo/InfoBarLogo";
import { InfoBarAiState } from "..";
import UserTag from "../UserTag";
import * as users from "../../fixtures/users";

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
        <InfoBar.LogoAndUser>
          <InfoBar.Logo>
            <InfoBarLogo />
          </InfoBar.Logo>
          <InfoBar.Separator />
          <InfoBar.User>
            <UserTag {...users.ANONYMOUS} />
          </InfoBar.User>
        </InfoBar.LogoAndUser>
        <InfoBar.AiState>
          <div style={{ display: "flex", gap: 18 }}>
            <InfoBarAiState.Active tag="niko" state="RESPONDING" />
            <InfoBarAiState.Active tag="niko" state="ACTING" />
            <InfoBarAiState.Active tag="niko" state="THINKING" />
            <InfoBarAiState.Idle />
          </div>
        </InfoBar.AiState>
      </InfoBar.Root>
    );
  },
};

export default meta;
