"use client";

import {
  HumanMessagePlotPointDto,
  MessagesClientSocket,
  MessagesRoomJoinedEventDto,
  PlotPointPerspective,
} from "@2pm/data";
import { AiMessagePlotPointDto } from "@2pm/data";
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
  plotPoint: AiMessagePlotPointDto;
};

export const AiMessage = (props: AiMessageProps) => {
  const [content, setContent] = useState(
    props.plotPoint.data.aiMessage.content,
  );

  useEffect(() => {
    const e: MessagesRoomJoinedEventDto = {
      messageId: props.plotPoint.data.message.id,
    };

    const socket: MessagesClientSocket = io("http://localhost:3002/messages");

    socket.emit("join", e).on("messages.ai.updated", async ({ aiMessage }) => {
      setContent(aiMessage.content);
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
  plotPoint: HumanMessagePlotPointDto;
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

type Props = AiMessagePlotPointDto | HumanMessagePlotPointDto;

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
