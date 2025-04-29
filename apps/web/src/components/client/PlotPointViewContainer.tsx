"use client";

import { PlotPointDto } from "@2pm/core";
import {
  AiMessage,
  HumanMessage,
  RoomPresenceChange,
} from "@2pm/ui/plot-points";

type Props = PlotPointDto;

const PlotPointViewContainer = ({ type, data }: Props) => {
  if (type === "AI_MESSAGE") {
    const { aiUser, aiMessage } = data;
    return <AiMessage tag={aiUser.tag}>{aiMessage.content}</AiMessage>;
  }

  if (type === "HUMAN_MESSAGE") {
    const { humanUser, humanMessage } = data;
    return (
      <HumanMessage
        tag={humanUser.tag || "anon"}
        content={humanMessage.content}
      />
    );
  }

  if (type === "ENVIRONMENT_ENTERED") {
    const { user, humanUser, aiUser } = data;
    const tag = user.type === "HUMAN" ? humanUser!.tag || "anon" : aiUser!.tag;
    return <RoomPresenceChange userType={user.type} type="ENTRACE" tag={tag} />;
  }

  throw new Error();
};

export default PlotPointViewContainer;
