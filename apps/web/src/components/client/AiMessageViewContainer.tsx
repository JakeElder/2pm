"use client";

import { useAiMessageEvents } from "@/hooks";
import { AiMessageDto, AiMessageUpdatedEventDto, SessionDto } from "@2pm/core";
import { UserTag } from "@2pm/ui/components";
import { Message } from "@2pm/ui/plot-points";
import { useCallback, useState } from "react";

type Props = {
  session: SessionDto;
  message: AiMessageDto;
};

const AiMessageViewContainer = ({ session, ...rest }: Props) => {
  const [message, setMessage] = useState(rest.message);

  useAiMessageEvents({
    aiMessageId: message.aiMessage.id,
    humanUserId: session.user.data.id,
    onUpdated: useCallback((e: AiMessageUpdatedEventDto) => {
      setMessage(e);
    }, []),
  });

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
