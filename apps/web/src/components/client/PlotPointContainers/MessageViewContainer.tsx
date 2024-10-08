"use client";

import {
  AiMessageDto,
  AiMessagesClientSocket,
  AiMessagesRoomJoinedEventDto,
  PlotPointPerspective,
} from "@2pm/data";
import {
  AiMessageHydratedPlotPointDto,
  HumanMessageHydratedPlotPointDto,
} from "@2pm/data";
import { Message } from "@2pm/ui/plot-points";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

type Perspective = {
  perspective: PlotPointPerspective;
};

/**
 * AiMessage
 */

type AiMessageProps = Perspective & {
  plotPoint: AiMessageHydratedPlotPointDto;
};

export const AiMessage = (props: AiMessageProps) => {
  const [content, setContent] = useState(
    props.plotPoint.data.aiMessage.content,
  );

  useEffect(() => {
    const e: AiMessagesRoomJoinedEventDto = {
      aiMessageId: props.plotPoint.data.aiMessage.id,
    };

    const socket: AiMessagesClientSocket = io(
      "http://localhost:3002/ai-messages",
    );

    socket
      .emit("join", e)
      .on("ai-messages.updated", async ({ content }: AiMessageDto) => {
        setContent(content);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <Message perspective={props.perspective}>{content}</Message>;
};

/**
 * HumanMessage
 */

type HumanMessageProps = Perspective & {
  plotPoint: HumanMessageHydratedPlotPointDto;
};

export const HumanMessage = (props: HumanMessageProps) => {
  const { perspective } = props;
  return (
    <Message perspective={perspective}>
      {props.plotPoint.data.humanMessage.content}
    </Message>
  );
};

/**
 * MessageContainer
 */

type Props = AiMessageHydratedPlotPointDto | HumanMessageHydratedPlotPointDto;

const MessageViewContainer = (plotPoint: Props) => {
  const { user } = plotPoint.data;
  const perspective = user.id === 3 ? "FIRST_PERSON" : "THIRD_PERSON";

  if (plotPoint.type === "AI_MESSAGE") {
    return <AiMessage perspective={perspective} plotPoint={plotPoint} />;
  } else {
    return <HumanMessage perspective={perspective} plotPoint={plotPoint} />;
  }
};

export default MessageViewContainer;
