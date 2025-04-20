"use client";

import { messagesSocket } from "@/socket";
import {
  HumanUserMessagePlotPointDto,
  MessagesRoomJoinedEventDto,
} from "@2pm/core";
import { AiUserMessagePlotPointDto } from "@2pm/core";
import { Message } from "@2pm/ui/plot-points";
import { useEffect, useState } from "react";

/**
 * AiUserMessage
 */

type AiUserMessageProps = AiUserMessagePlotPointDto;

export const AiUserMessage = (props: AiUserMessageProps) => {
  const [content, setContent] = useState(props.data.aiUserMessage.content);

  useEffect(() => {
    const e: MessagesRoomJoinedEventDto = {
      messageId: props.data.message.id,
    };

    messagesSocket
      .emit("join", e)
      .on("messages.ai.updated", async ({ aiUserMessage }) => {
        if (props.data.aiUserMessage.id === aiUserMessage.id) {
          setContent(aiUserMessage.content);
        }
      });

    return () => {
      messagesSocket.off("messages.ai.updated");
      messagesSocket.emit("leave", e);
    };
  }, []);

  return (
    <Message type="AI" user={props.data.aiUser.tag}>
      {content}
    </Message>
  );
};

/**
 * HumanUserMessage
 */

type HumanUserMessageProps = HumanUserMessagePlotPointDto;

export const HumanUserMessage = (props: HumanUserMessageProps) => {
  return (
    <Message type="HUMAN" user={props.data.humanUser.id}>
      {props.data.humanUserMessage.content}
    </Message>
  );
};

/**
 * MessageContainer
 */

type Props = AiUserMessagePlotPointDto | HumanUserMessagePlotPointDto;

const MessageViewContainer = (plotPoint: Props) => {
  if (plotPoint.type === "AI_USER_MESSAGE") {
    return <AiUserMessage {...plotPoint} />;
  }

  if (plotPoint.type === "HUMAN_USER_MESSAGE") {
    return <HumanUserMessage {...plotPoint} />;
  }
};

export default MessageViewContainer;
