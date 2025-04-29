import { getOneWorldRoomEnvironment } from "@/api/world-room-environments";
import ProseViewContainer from "@/components/client/ProseViewContainer";
import ConversationNarrativeContainer from "@/components/server/ConversationNarrativeContainer";
import InfoBarUserContainer from "@/components/server/InfoBarUserContainer";
import ReferenceNarrativeContainer from "@/components/server/ReferenceNarrativeContainer";
import {
  InfoBar,
  InfoBarLogo,
  PaneHeader,
  SpaceList,
  Theme,
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
            <SpaceList />
          </StandardLayout.Spaces>
          <StandardLayout.ReferenceNarrative>
            <ReferenceNarrativeContainer environmentId={environmentId} />
          </StandardLayout.ReferenceNarrative>
          <StandardLayout.Conversation>
            <ConversationNarrativeContainer environmentId={environmentId} />
            <StandardLayout.InputBar>
              <ProseViewContainer environmentId={environmentId} />
            </StandardLayout.InputBar>
          </StandardLayout.Conversation>
        </StandardLayout.Main>
        <StandardLayout.StatusBar />
        <StandardLayout.InfoBar>
          <InfoBar.Root>
            <InfoBar.Logo>
              <InfoBarLogo />
            </InfoBar.Logo>
            <InfoBar.Separator />
            <InfoBar.User>
              <InfoBarUserContainer />
            </InfoBar.User>
          </InfoBar.Root>
        </StandardLayout.InfoBar>
      </StandardLayout.Root>
    </Theme>
  );
}
