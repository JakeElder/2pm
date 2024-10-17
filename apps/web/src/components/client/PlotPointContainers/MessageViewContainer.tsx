"use client";

import { messagesSocket } from "@/socket";
import {
  AuthenticatedUserMessagePlotPointDto,
  MessagesRoomJoinedEventDto,
  PlotPointPerspective,
} from "@2pm/data";
import { AiUserMessagePlotPointDto } from "@2pm/data";
import { Message } from "@2pm/ui/plot-points";
import { useEffect, useState } from "react";

type Perspective = {
  perspective: PlotPointPerspective;
};

/**
 * AiUserMessage
 */

type AiUserMessageProps = Perspective & {
  plotPoint: AiUserMessagePlotPointDto;
};

export const AiUserMessage = (props: AiUserMessageProps) => {
  const [content, setContent] = useState(
    props.plotPoint.data.aiUserMessage.content,
  );

  useEffect(() => {
    const e: MessagesRoomJoinedEventDto = {
      messageId: props.plotPoint.data.message.id,
    };

    messagesSocket
      .emit("join", e)
      .on("messages.ai.updated", async ({ aiUserMessage }) => {
        if (props.plotPoint.data.aiUserMessage.id === aiUserMessage.id) {
          setContent(aiUserMessage.content);
        }
      });

    return () => {
      messagesSocket.off("messages.ai.updated");
      messagesSocket.emit("leave", e);
    };
  }, []);

  return <Message perspective={props.perspective}>{content}</Message>;
};

/**
 * AuthenticatedUserMessage
 */

type AuthenticatedUserMessageProps = Perspective & {
  plotPoint: AuthenticatedUserMessagePlotPointDto;
};

export const AuthenticatedUserMessage = (
  props: AuthenticatedUserMessageProps,
) => {
  const { perspective } = props;
  return (
    <Message perspective={perspective}>
      {props.plotPoint.data.authenticatedUserMessage.content}
    </Message>
  );
};

/**
 * MessageContainer
 */

type Props = AiUserMessagePlotPointDto | AuthenticatedUserMessagePlotPointDto;

const MessageViewContainer = (plotPoint: Props) => {
  const { user } = plotPoint.data;
  const perspective = user.id === 3 ? "FIRST_PERSON" : "THIRD_PERSON";

  if (plotPoint.type === "AI_USER_MESSAGE") {
    return <AiUserMessage perspective={perspective} plotPoint={plotPoint} />;
  } else {
    return (
      <AuthenticatedUserMessage
        perspective={perspective}
        plotPoint={plotPoint}
      />
    );
  }
};

export default MessageViewContainer;
