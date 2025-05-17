"use client";

import { PlotPointDto, SessionDto } from "@2pm/core";
import { Prose, UserTag } from "@2pm/ui/components";
import {
  RoomPresenceChange,
  Message,
  BibleVerseReference,
  UserThemeSwitched,
  PaliCanonReference,
} from "@2pm/ui/plot-points";
import AiMessageViewContainer from "./AiMessageViewContainer";

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

  throw new Error();
};

export default PlotPointViewContainer;
