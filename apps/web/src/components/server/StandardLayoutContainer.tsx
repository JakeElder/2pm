import ProseViewContainer from "@/components/client/ProseViewContainer";
import ConversationNarrativeContainer from "@/components/server/ConversationNarrativeContainer";
import InfoBarUserTagContainer from "@/components/server/InfoBarUserTagContainer";
import ReferenceNarrativeContainer from "@/components/server/ReferenceNarrativeContainer";
import SpaceListContainer from "@/components/server/SpaceListContainer";
import EnvironmentUserListContainer from "@/components/server/EnvironmentUserListContainer";
import { StandardLayout } from "@2pm/ui/layouts";
import EnvironmentAiTaskStateContainer from "@/components/server/EnvironmentAiTaskStateContainer";
import UserSpaceListContainer from "@/components/server/UserSpaceListContainer";
import {
  InfoBar,
  InfoBarLogo,
  LibraryList,
  PaneHeader,
} from "@2pm/ui/components";
import { Environment } from "@2pm/core";

type Props = {
  environmentId: Environment["id"];
};

const StandardLayoutContainer = async ({ environmentId }: Props) => {
  return (
    <StandardLayout.Root>
      <StandardLayout.Main>
        <StandardLayout.SiteMap>
          <StandardLayout.Spaces>
            <PaneHeader> Spaces</PaneHeader>
            <SpaceListContainer activeEnvironmentId={environmentId} />
          </StandardLayout.Spaces>
          <StandardLayout.Library>
            <PaneHeader> Library</PaneHeader>
            <LibraryList.Root>
              <LibraryList.Resource>~[the-pali-canon]</LibraryList.Resource>
              <LibraryList.Resource>~[the-bible]</LibraryList.Resource>
              <LibraryList.Resource disabled>
                ~[meditations]
              </LibraryList.Resource>
              <LibraryList.Resource disabled>
                ~[the-art-of-war]
              </LibraryList.Resource>
              <LibraryList.Resource disabled>
                ~[the-us-constitution]
              </LibraryList.Resource>
            </LibraryList.Root>
          </StandardLayout.Library>
          <StandardLayout.UserSpaces>
            <PaneHeader>󱕭 User Spaces</PaneHeader>
            <UserSpaceListContainer activeEnvironmentId={environmentId} />
          </StandardLayout.UserSpaces>
        </StandardLayout.SiteMap>
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
          <EnvironmentUserListContainer environmentId={environmentId} />
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
              <InfoBarUserTagContainer />
            </InfoBar.User>
          </InfoBar.LogoAndUser>
          <InfoBar.AiState>
            <EnvironmentAiTaskStateContainer environmentId={environmentId} />
          </InfoBar.AiState>
        </InfoBar.Root>
      </StandardLayout.InfoBar>
    </StandardLayout.Root>
  );
};

export default StandardLayoutContainer;
