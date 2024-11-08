import {
  PromptInput,
  PromptSubmitButton,
  StandardLayout,
  UserList,
  WorldRoomModule,
} from "@2pm/ui";
import CompanionOneToOneContainer from "@/components/server/CompanionOneToOneContainer";
import UserModuleContainer from "@/components/server/UserModuleContainer";

const {
  AiUserList,
  AiUser,
  AuthenticatedUserList,
  AuthenticatedUser,
  Divider,
} = UserList;

export default async function Home() {
  return (
    <StandardLayout.Root>
      <StandardLayout.UserAndLeaderboard>
        <StandardLayout.User>
          <UserModuleContainer />
        </StandardLayout.User>
        <StandardLayout.Leaderboard>{null}</StandardLayout.Leaderboard>
      </StandardLayout.UserAndLeaderboard>
      <StandardLayout.CompanionOneToOne>
        <CompanionOneToOneContainer />
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
}
