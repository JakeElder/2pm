"use client";

import { messagesSocket } from "@/socket";
import {
  AiMessagePlotPointDto,
  HumanMessagePlotPointDto,
} from "@2pm/api/client";
// import { MessagesRoomJoinedEventDto } from "@2pm/core";
import { Message } from "@2pm/ui/plot-points";
import { useEffect, useState } from "react";

/**
 * AiMessage
 */

type AiMessageProps = AiMessagePlotPointDto;

export const AiMessage = (props: AiMessageProps) => {
  const [content, setContent] = useState(props.data.aiMessage.content);

  // useEffect(() => {
  //   const e: MessagesRoomJoinedEventDto = {
  //     messageId: props.data.message.id,
  //   };
  //
  //   messagesSocket
  //     .emit("join", e)
  //     .on("messages.ai.updated", async ({ aiMessage }) => {
  //       if (props.data.aiMessage.id === aiMessage.id) {
  //         setContent(aiMessage.content);
  //       }
  //     });
  //
  //   return () => {
  //     messagesSocket.off("messages.ai.updated");
  //     messagesSocket.emit("leave", e);
  //   };
  // }, []);

  return (
    <Message type="AI" user={props.data.aiUser.tag}>
      {content}
    </Message>
  );
};

/**
 * HumanMessage
 */

type HumanMessageProps = HumanMessagePlotPointDto;

export const HumanMessage = (props: HumanMessageProps) => {
  return (
    <Message type="HUMAN" user={props.data.humanUser.tag || "anon"}>
      {JSON.stringify(props.data.humanMessage.content)}
    </Message>
  );
};

/**
 * MessageContainer
 */

type Props = AiMessagePlotPointDto | HumanMessagePlotPointDto;

const MessagePlotPointViewContainer = (plotPoint: Props) => {
  if (plotPoint.type === "AI_MESSAGE") {
    return <AiMessage {...plotPoint} />;
  }

  if (plotPoint.type === "HUMAN_MESSAGE") {
    return <HumanMessage {...plotPoint} />;
  }
};

export default MessagePlotPointViewContainer;
