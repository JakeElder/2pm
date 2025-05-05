import {
  getOneWorldRoomEnvironment,
  getWorldRoomEnvironments,
} from "@/api/world-room-environments";
import ProseViewContainer from "@/components/client/ProseViewContainer";
import ConversationNarrativeContainer from "@/components/server/ConversationNarrativeContainer";
import InfoBarUserTagContainer from "@/components/server/InfoBarUserTagContainer";
import ReferenceNarrativeContainer from "@/components/server/ReferenceNarrativeContainer";
import SpaceListContainer from "@/components/server/SpaceListContainer";
import UserListContainer from "@/components/server/UserListContainer";
import { WorldRoomEnvironmentDto } from "@2pm/core";
import {
  InfoBar,
  InfoBarAiState,
  InfoBarLogo,
  LibraryList,
  PaneHeader,
  Theme,
} from "@2pm/ui/components";
import { StandardLayout } from "@2pm/ui/layouts";
import { redirect } from "next/navigation";

type Params = Promise<{
  path?: string[];
}>;

type Props = {
  params: Params;
};

async function getDefaultEnvironment() {
  const res = await getOneWorldRoomEnvironment("UNIVERSE");
  return res.data;
}

async function getEnvironment(
  path: Awaited<Params>["path"],
): Promise<WorldRoomEnvironmentDto | null> {
  if (!path) {
    return getDefaultEnvironment();
  }

  if (path.length > 1) {
    return null;
  }

  const res = await getWorldRoomEnvironments({
    slug: path[0],
  });

  return res.data[0] || null;
}

export default async function Home({ params }: Props) {
  const { path } = await params;

  const environment = await getEnvironment(path);

  if (!environment) {
    redirect("/");
  }

  const { environmentId } = environment;

  return (
    <Theme>
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
                <LibraryList.Resource>*[the-pali-canon]</LibraryList.Resource>
                <LibraryList.Resource>*[the-bible]</LibraryList.Resource>
                <LibraryList.Resource>*[meditations]</LibraryList.Resource>
                <LibraryList.Resource>
                  *[the-us-constitution]
                </LibraryList.Resource>
              </LibraryList.Root>
            </StandardLayout.Library>
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
            <UserListContainer environmentId={environmentId} />
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
              <InfoBarAiState.Idle />
            </InfoBar.AiState>
          </InfoBar.Root>
        </StandardLayout.InfoBar>
      </StandardLayout.Root>
    </Theme>
  );
}
