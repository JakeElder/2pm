"use client";

import { PlotPointDto, SessionDto } from "@2pm/core";
import { ImageGrid, Prose } from "@2pm/ui/components";
import {
  RoomPresenceChange,
  Message,
  BibleVerseReference,
  UserThemeSwitched,
  PaliCanonReference,
  ThemeCreated,
  ThemesListed,
  ThemeUpdated,
  HumanPost,
} from "@2pm/ui/plot-points";
import AiMessageViewContainer from "./AiMessageViewContainer";
import ThemeViewContainer from "./ThemeViewContainer";
import UserTagViewContainer from "./UserTagViewContainer";

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
          <UserTagViewContainer {...user} />
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
          <UserTagViewContainer {...data.user} />
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
          <UserTagViewContainer {...data.user} />
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
          <UserTagViewContainer {...data.humanUserTheme.humanUser} />
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
          <UserTagViewContainer {...data.humanUser} />
        </ThemeUpdated.Tag>
        <ThemeUpdated.Action themeName={data.theme.name} />
      </ThemeUpdated.Root>
    );
  }

  if (type === "HUMAN_POST") {
    return (
      <HumanPost.Root>
        <HumanPost.Header>
          <HumanPost.Heading>
            Chiang Mai Food Festival Jan 2025
          </HumanPost.Heading>
          <HumanPost.Text>
            <p>A few snaps from Chiang Mai food festival</p>
            <p>กินข้าวหรือยังครับ</p>
          </HumanPost.Text>
        </HumanPost.Header>
        <HumanPost.Body>
          <HumanPost.Images>
            <ImageGrid />
          </HumanPost.Images>
        </HumanPost.Body>
        <HumanPost.Footer>
          <HumanPost.Tag>
            <UserTagViewContainer {...data.humanUser} />
          </HumanPost.Tag>
          <HumanPost.Date date={new Date(2025, 4, 20, 14, 0, 0)} />
        </HumanPost.Footer>
      </HumanPost.Root>
    );
  }

  if (type === "HUMAN_USER_CONFIG_UPDATED") {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  if (type === "HUMAN_USER_TAG_UPDATED") {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  throw new Error();
};

export default PlotPointViewContainer;
