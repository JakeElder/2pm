import type { Meta, StoryObj } from "@storybook/react";
import * as StandardLayout from "./StandardLayout";
import * as UserModule from "../../Components/Module/UserModule";
import * as CompanionOneToOneModule from "../../Components/Module/CompanionOneToOneModule";
import * as WorldRoomModule from "../../Components/Module/WorldRoomModule";
import * as UserList from "../../Components/UserList";
import PromptSubmitButton from "../../Components/PromptSubmitButton";
import PromptInput from "../../Components/PromptInput";

const meta: Meta<typeof StandardLayout.Root> = {
  title: "Layouts/StandardLayout",
  component: StandardLayout.Root,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof StandardLayout>;

const {
  AiUserList,
  AiUser,
  AuthenticatedUserList,
  AuthenticatedUser,
  Divider,
} = UserList;

export const Default: Story = {
  render() {
    return (
      <StandardLayout.Root>
        <StandardLayout.UserAndLeaderboard>
          <StandardLayout.User>
            <UserModule.Root>
              <UserModule.Header>
                <UserModule.Tag>jake</UserModule.Tag>
                <UserModule.Level>{1}</UserModule.Level>
              </UserModule.Header>
              <UserModule.Body>
                <UserModule.Avatar />
                <UserModule.Rep>{0.000001}</UserModule.Rep>
              </UserModule.Body>
            </UserModule.Root>
          </StandardLayout.User>
          <StandardLayout.Leaderboard>{null}</StandardLayout.Leaderboard>
        </StandardLayout.UserAndLeaderboard>
        <StandardLayout.CompanionOneToOne>
          <CompanionOneToOneModule.Root>
            <CompanionOneToOneModule.Avatar code="IVAN" />
            <CompanionOneToOneModule.Main>
              <CompanionOneToOneModule.Header tag="ivan" />
              <CompanionOneToOneModule.Body>
                {null}
              </CompanionOneToOneModule.Body>
              <CompanionOneToOneModule.Footer>
                <CompanionOneToOneModule.Input>
                  <PromptInput />
                </CompanionOneToOneModule.Input>
                <CompanionOneToOneModule.SubmitButton>
                  <PromptSubmitButton />
                </CompanionOneToOneModule.SubmitButton>
              </CompanionOneToOneModule.Footer>
            </CompanionOneToOneModule.Main>
          </CompanionOneToOneModule.Root>
        </StandardLayout.CompanionOneToOne>
        <StandardLayout.WorldRoom>
          <WorldRoomModule.Root>
            <WorldRoomModule.Header code="UNIVERSE" channel="universe" />
            <WorldRoomModule.Body split>
              <WorldRoomModule.Partition>{null}</WorldRoomModule.Partition>
              <WorldRoomModule.Partition style={{ maxWidth: 180 }}>
                <UserList.Root>
                  <AiUserList>
                    <AiUser code="G">g</AiUser>
                    <AiUser code="IVAN">ivan</AiUser>
                    <AiUser code="THE_HOSTESS">the_hostess</AiUser>
                  </AiUserList>
                  <Divider />
                  <AuthenticatedUserList>
                    <AuthenticatedUser>jake</AuthenticatedUser>
                    <AuthenticatedUser>danbee</AuthenticatedUser>
                  </AuthenticatedUserList>
                </UserList.Root>
              </WorldRoomModule.Partition>
            </WorldRoomModule.Body>
            <WorldRoomModule.Footer>
              <WorldRoomModule.Input>
                <PromptInput />
              </WorldRoomModule.Input>
              <WorldRoomModule.SubmitButton>
                <PromptSubmitButton />
              </WorldRoomModule.SubmitButton>
            </WorldRoomModule.Footer>
          </WorldRoomModule.Root>
        </StandardLayout.WorldRoom>
      </StandardLayout.Root>
    );
  },
};

export default meta;
