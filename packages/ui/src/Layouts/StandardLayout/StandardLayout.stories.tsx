import type { Meta, StoryObj } from "@storybook/react";
import * as StandardLayout from "./StandardLayout";
import { EmailSent, BibleVerseReference, Message } from "../../PlotPoints";
import {
  PaneHeader,
  SpaceList,
  Prose,
  InfoBar,
  InfoBarLogo,
  EnvironmentUserList,
  InfoBarAiState,
  UserTag,
  LibraryList,
  UserSpaceList,
} from "../../Components";
import * as users from "../../fixtures/users";
import * as prose from "../../fixtures/prose";

const meta: Meta<typeof StandardLayout.Root> = {
  title: "Layouts/StandardLayout",
  component: StandardLayout.Root,
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof StandardLayout>;

export const Default: Story = {
  render() {
    return (
      <StandardLayout.Root>
        <StandardLayout.Main>
          <StandardLayout.SiteMap>
            <StandardLayout.Spaces>
              <PaneHeader> Spaces</PaneHeader>
              <SpaceList.Root>
                <SpaceList.Channel active slug="universe" userCount={12} />
                <SpaceList.Channel slug="about-2pm" userCount={2} />
                <SpaceList.Channel slug="dev-log" userCount={15} />
              </SpaceList.Root>
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
            <StandardLayout.UserSpaces>
              <PaneHeader>󱕭 User Spaces</PaneHeader>
              <UserSpaceList.Root>
                <UserSpaceList.Tag>
                  <UserTag {...users.AUTHENTICATED} />
                </UserSpaceList.Tag>
                <UserSpaceList.Channels>
                  <UserSpaceList.Channel>#home</UserSpaceList.Channel>
                  <UserSpaceList.Channel updates>#bytes</UserSpaceList.Channel>
                </UserSpaceList.Channels>
              </UserSpaceList.Root>
              <UserSpaceList.Root>
                <UserSpaceList.Tag>
                  <UserTag {...users.ANONYMOUS} showHash />
                </UserSpaceList.Tag>
                <UserSpaceList.Channels>
                  <UserSpaceList.Channel disabled>#home</UserSpaceList.Channel>
                </UserSpaceList.Channels>
              </UserSpaceList.Root>
            </StandardLayout.UserSpaces>
          </StandardLayout.SiteMap>
          <StandardLayout.ReferenceNarrative>
            <EmailSent email="jake@2pm.io" reference={2} />
            <BibleVerseReference verse="Job 11:18">
              Because thou shalt forget thy misery, and remember it as waters
              that pass away: And thine age shall be clearer than the noonday;
              thou shalt shine forth, thou shalt be as the morning. And thou
              shalt be secure, because there is hope; yea, thou shalt dig about
              thee, and thou shalt take thy rest in safety. Also thou shalt lie
              down, and none shall make thee afraid; yea, many sh all make suit
              unto thee. But the eyes of the wicked shall fail, and they shall
              not escape, and their hope shall be as the giving up of the ghost.
            </BibleVerseReference>
          </StandardLayout.ReferenceNarrative>
          <StandardLayout.Conversation>
            <StandardLayout.ConversationNarrative>
              <Message.Root>
                <Message.Header>
                  <UserTag {...users.AUTHENTICATED} showHash />
                </Message.Header>
                <Message.Body>
                  <Prose editable={false} content={prose.WITH_BOLD} />
                </Message.Body>
              </Message.Root>
              <Message.Root>
                <Message.Header>
                  <UserTag type="AI" data={users.AI} />
                </Message.Header>
                <Message.Body>
                  Lorem ipsum dolor sit amet, [1] adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </Message.Body>
              </Message.Root>
            </StandardLayout.ConversationNarrative>
            <StandardLayout.InputBar>
              <Prose onSubmit={(editor) => console.log(editor.getJSON())} />
            </StandardLayout.InputBar>
          </StandardLayout.Conversation>
          <StandardLayout.Users>
            <PaneHeader>
              <span style={{ fontSize: 10, marginRight: 10 }}></span> Users
            </PaneHeader>
            <EnvironmentUserList.Root>
              <EnvironmentUserList.User type="AI" data={users.AI} />
              <EnvironmentUserList.User {...users.AUTHENTICATED} showHash />
              <EnvironmentUserList.User {...users.ANONYMOUS} showHash />
            </EnvironmentUserList.Root>
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
                <UserTag {...users.AUTHENTICATED} showHash />
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
        </StandardLayout.InfoBar>
      </StandardLayout.Root>
    );
  },
};

export default meta;
