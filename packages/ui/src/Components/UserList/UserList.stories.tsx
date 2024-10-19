import type { Meta, StoryObj } from "@storybook/react";
import * as Module from "../Module";
import * as WorldRoomModule from "../Module/WorldRoomModule";
import * as UserList from "../UserList";
import { Background } from "../Background";
import PromptSubmitButton from "../PromptSubmitButton";
import PromptInput from "../PromptInput";
import universe from "../../../public/images/channels/UNIVERSE.png";

const meta: Meta<typeof Module.Root> = {
  title: "Components/UserList",
  component: Module.Root,
  decorators: [
    (Component) => (
      <Background src={universe.src}>
        <div
          style={{
            boxSizing: "border-box",
            padding: 50,
            height: "100dvh",
          }}
        >
          <WorldRoomModule.Root>
            <WorldRoomModule.Header code="UNIVERSE" channel="universe" />
            <WorldRoomModule.Body split>
              <WorldRoomModule.Partition>{null}</WorldRoomModule.Partition>
              <WorldRoomModule.Partition style={{ maxWidth: 180 }}>
                <Component />
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
        </div>
      </Background>
    ),
  ],
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof Module.Root>;

const { AiUserList, AiUser } = UserList;

export const Default: Story = {
  render() {
    return (
      <UserList.Root>
        <AiUserList>
          <AiUser code="G">g</AiUser>
          <AiUser code="IVAN">ivan</AiUser>
          <AiUser code="THE_HOSTESS">the_hostess</AiUser>
        </AiUserList>
        <UserList.Divider />
      </UserList.Root>
    );
  },
};

export default meta;
