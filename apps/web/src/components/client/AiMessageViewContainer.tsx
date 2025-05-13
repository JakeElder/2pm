"use client";

import { aiMessagesSocket } from "@/socket";
import {
  AiMessageDto,
  AiMessagesRoomJoinedEventDto,
  SessionDto,
} from "@2pm/core";
import { UserTag } from "@2pm/ui/components";
import { Message } from "@2pm/ui/plot-points";
import { useEffect, useState } from "react";

type Props = {
  session: SessionDto;
  message: AiMessageDto;
};

const AiMessageViewContainer = ({ session, ...rest }: Props) => {
  const [message, setMessage] = useState(rest.message);

  useEffect(() => {
    const e: AiMessagesRoomJoinedEventDto = {
      humanUserId: session.user.data.id,
      aiMessageId: rest.message.aiMessage.id,
    };

    aiMessagesSocket.emit("join", e).on("updated", async (message) => {
      setMessage(message);
    });

    return () => {
      aiMessagesSocket.removeAllListeners();
      aiMessagesSocket.emit("leave", e);
    };
  }, []);
  return (
    <Message.Root>
      <Message.Header>
        <UserTag type="AI" data={message.aiUser} />
      </Message.Header>
      <Message.Body>
        <Message.Markdown>{message.aiMessage.content}</Message.Markdown>
      </Message.Body>
    </Message.Root>
  );
};

export default AiMessageViewContainer;
