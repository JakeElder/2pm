"use client";

import { PlotPointDto, SessionDto } from "@2pm/core";
import { Prose, UserTag } from "@2pm/ui/components";
import {
  RoomPresenceChange,
  Message,
  BibleVerseReference,
  UserThemeSwitched,
  PaliCanonReference,
  ThemeCreated,
  ThemesListed,
  ThemeUpdated,
} from "@2pm/ui/plot-points";
import AiMessageViewContainer from "./AiMessageViewContainer";
import ThemeViewContainer from "./ThemeViewContainer";

type Props = {
  session: SessionDto;
  plotPoint: PlotPointDto;
};

const PlotPointViewContainer = ({ plotPoint, session }: Props) => {
  const { type, data } = plotPoint;

  if (type === "AI_MESSAGE") {
    return <AiMessageViewContainer session={session} message={data} />;
  }

  if (type === "HUMAN_MESSAGE") {
    const { user, humanMessage } = data;
    return (
      <Message.Root>
        <Message.Header>
          <UserTag {...user} showHash />
        </Message.Header>
        <Message.Body>
          <Prose editable={false} content={humanMessage.json} />
        </Message.Body>
      </Message.Root>
    );
  }

  if (type === "ENVIRONMENT_ENTERED") {
    return (
      <RoomPresenceChange.Root type="ENTRACE">
        <RoomPresenceChange.Icon />
        <RoomPresenceChange.Tag>
          <UserTag {...data.user} showHash={data.user.type === "ANONYMOUS"} />
        </RoomPresenceChange.Tag>
        <RoomPresenceChange.Action />
      </RoomPresenceChange.Root>
    );
  }

  if (type === "ENVIRONMENT_LEFT") {
    return (
      <RoomPresenceChange.Root type="EXIT">
        <RoomPresenceChange.Icon />
        <RoomPresenceChange.Tag>
          <UserTag {...data.user} showHash={data.user.type === "ANONYMOUS"} />
        </RoomPresenceChange.Tag>
        <RoomPresenceChange.Action />
      </RoomPresenceChange.Root>
    );
  }

  if (type === "BIBLE_VERSE_REFERENCE") {
    const { verse, chapter } = data.bibleVerse;
    const { bibleBook } = data;
    return (
      <BibleVerseReference verse={`${bibleBook.name} ${chapter}:${verse}`}>
        {data.bibleChunk.content}
      </BibleVerseReference>
    );
  }

  if (type === "USER_THEME_SWITCHED") {
    return (
      <UserThemeSwitched.Root>
        <UserThemeSwitched.Icon />
        <UserThemeSwitched.Tag>
          <UserTag
            {...data.humanUserTheme.humanUser}
            showHash={data.humanUserTheme.humanUser.type === "ANONYMOUS"}
          />
        </UserThemeSwitched.Tag>
        <UserThemeSwitched.Action themeName={data.to.name} />
      </UserThemeSwitched.Root>
    );
  }

  if (type === "PALI_CANON_REFERENCE") {
    return (
      <PaliCanonReference
        author={data.paliCanonChunk.metadata.author_uid}
        basket={data.paliCanonChunk.metadata.basket}
      >
        {data.paliCanonChunk.content}
      </PaliCanonReference>
    );
  }

  if (type === "THEME_CREATED") {
    return (
      <ThemeCreated.Root>
        <ThemeCreated.Header name={data.theme.name} />
        <ThemeCreated.Body>
          <ThemeViewContainer session={session} theme={data.theme} />
        </ThemeCreated.Body>
      </ThemeCreated.Root>
    );
  }

  if (type === "THEMES_LISTED") {
    return (
      <ThemesListed.Root>
        <ThemesListed.Header />
        <ThemesListed.Body>
          {data.themes.map((t) => {
            return (
              <ThemesListed.Theme name={t.name} key={t.id}>
                <ThemeViewContainer session={session} theme={t} />
              </ThemesListed.Theme>
            );
          })}
        </ThemesListed.Body>
      </ThemesListed.Root>
    );
  }

  if (type === "THEME_UPDATED") {
    return (
      <ThemeUpdated.Root>
        <ThemeUpdated.Icon />
        <ThemeUpdated.Tag>
          <UserTag
            {...data.humanUser}
            showHash={data.humanUser.type === "ANONYMOUS"}
          />
        </ThemeUpdated.Tag>
        <ThemeUpdated.Action themeName={data.theme.name} />
      </ThemeUpdated.Root>
    );
  }

  throw new Error();
};

export default PlotPointViewContainer;
