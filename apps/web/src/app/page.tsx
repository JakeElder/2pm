import { getOneWorldRoomEnvironment } from "@/api/world-room-environments";
import ProseViewContainer from "@/components/client/ProseViewContainer";
import ConversationNarrativeContainer from "@/components/server/ConversationNarrativeContainer";
import InfoBarUserContainer from "@/components/server/InfoBarUserContainer";
import ReferenceNarrativeContainer from "@/components/server/ReferenceNarrativeContainer";
import {
  InfoBar,
  InfoBarAiState,
  InfoBarLogo,
  PaneHeader,
  SpaceList,
  Theme,
  UserList,
} from "@2pm/ui/components";
import { StandardLayout } from "@2pm/ui/layouts";

export default async function Home() {
  const universe = await getOneWorldRoomEnvironment("UNIVERSE");
  const { environmentId } = universe.data;

  return (
    <Theme>
      <StandardLayout.Root>
        <StandardLayout.Main>
          <StandardLayout.Spaces>
            <PaneHeader> Spaces</PaneHeader>
            <SpaceList.Root>
              <SpaceList.Channel active slug="universe" userCount={12} />
              <SpaceList.Channel slug="about-2pm" userCount={2} />
              <SpaceList.Channel slug="dev-log" userCount={9} />
              <SpaceList.Channel slug="supporters" userCount={5} />
            </SpaceList.Root>
          </StandardLayout.Spaces>
          <ReferenceNarrativeContainer environmentId={environmentId} />
          <StandardLayout.Conversation>
            <ConversationNarrativeContainer environmentId={environmentId} />
            <StandardLayout.InputBar>
              <ProseViewContainer environmentId={environmentId} />
            </StandardLayout.InputBar>
          </StandardLayout.Conversation>
          <StandardLayout.Users>
            <PaneHeader>
              <span style={{ fontSize: 10, marginRight: 10 }}></span> Users
            </PaneHeader>
            <UserList.Root>
              <UserList.User type="AI" tag="niko" />
              <UserList.User type="HUMAN" tag="jake" />
            </UserList.Root>
          </StandardLayout.Users>
        </StandardLayout.Main>
        <StandardLayout.StatusBar />
        <StandardLayout.InfoBar>
          <InfoBar.Root>
            <InfoBar.LogoAndUser>
              <InfoBar.Logo>
                <InfoBarLogo />
              </InfoBar.Logo>
              <InfoBar.Separator />
              <InfoBar.User>
                <InfoBarUserContainer />
              </InfoBar.User>
            </InfoBar.LogoAndUser>
            <InfoBar.AiState>
              <InfoBarAiState.Idle />
            </InfoBar.AiState>
          </InfoBar.Root>
        </StandardLayout.InfoBar>
      </StandardLayout.Root>
    </Theme>
  );
}
