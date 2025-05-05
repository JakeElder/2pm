import type { Meta, StoryObj } from "@storybook/react";
import * as StandardLayout from "./StandardLayout";
import { EmailSent, BibleVerse, Message } from "../../PlotPoints";
import {
  PaneHeader,
  SpaceList,
  Prose,
  InfoBar,
  InfoBarLogo,
  UserList,
  InfoBarAiState,
  UserTag,
  LibraryList,
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
          </StandardLayout.SiteMap>
          <StandardLayout.ReferenceNarrative>
            <EmailSent email="jake@2pm.io" reference={2} />
            <BibleVerse verse="Ecclesiastes 3:6" reference={1}>
              A time to weep, and a time to laugh; a time to mourn, and a time
              to dance; A time to cast away stones, and a time to gather stones
              together; a time to embrace, and a time to refrain from embracing;
              A time to get, and a time to lose; a time to keep, and a time to
              cast away; A time to rend, and a time to sew; a time to keep
              silence, and a time to speak; A time to love, and a time to hate;
              a time of war, and a time of peace.
            </BibleVerse>
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
                  <UserTag {...users.AI} />
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
            <UserList.Root>
              <UserList.User {...users.AI} />
              <UserList.User {...users.AUTHENTICATED} showHash />
              <UserList.User {...users.ANONYMOUS} showHash />
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
