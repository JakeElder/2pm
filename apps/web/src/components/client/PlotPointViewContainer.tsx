"use client";

import { PlotPointDto } from "@2pm/core";
import { Prose, UserTag } from "@2pm/ui/components";
import { RoomPresenceChange, Message } from "@2pm/ui/plot-points";

type Props = PlotPointDto;

const PlotPointViewContainer = ({ type, data }: Props) => {
  if (type === "AI_MESSAGE") {
    const { aiUser, aiMessage } = data;
    return (
      <Message.Root>
        <Message.Header>
          <UserTag type="AI" data={aiUser} />
        </Message.Header>
        <Message.Body>{aiMessage.content}</Message.Body>
      </Message.Root>
    );
  }

  if (type === "HUMAN_MESSAGE") {
    const { user, humanMessage } = data;
    return (
      <Message.Root>
        <Message.Header>
          <UserTag {...user} showHash />
        </Message.Header>
        <Message.Body>
          <Prose editable={false} content={humanMessage.content} />
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

  throw new Error();
};

export default PlotPointViewContainer;
