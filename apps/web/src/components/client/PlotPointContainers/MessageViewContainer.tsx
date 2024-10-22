"use client";

import { useSession } from "@/hooks/use-session";
import { messagesSocket } from "@/socket";
import {
  AnonymousUserMessagePlotPointDto,
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
 * AnonymousUserMessage
 */

type AnonymousUserMessageProps = Perspective & {
  plotPoint: AnonymousUserMessagePlotPointDto;
};

export const AnonymousUserMessage = (props: AnonymousUserMessageProps) => {
  const { perspective } = props;
  return (
    <Message perspective={perspective}>
      {props.plotPoint.data.anonymousUserMessage.content}
    </Message>
  );
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

type Props =
  | AiUserMessagePlotPointDto
  | AuthenticatedUserMessagePlotPointDto
  | AnonymousUserMessagePlotPointDto;

const MessageViewContainer = (plotPoint: Props) => {
  const session = useSession();

  const perspective =
    plotPoint.data.message.userId === session.data.user.id
      ? "FIRST_PERSON"
      : "THIRD_PERSON";

  if (plotPoint.type === "AI_USER_MESSAGE") {
    return <AiUserMessage perspective={perspective} plotPoint={plotPoint} />;
  }

  if (plotPoint.type === "AUTHENTICATED_USER_MESSAGE") {
    return (
      <AuthenticatedUserMessage
        perspective={perspective}
        plotPoint={plotPoint}
      />
    );
  }

  if (plotPoint.type === "ANONYMOUS_USER_MESSAGE") {
    return (
      <AnonymousUserMessage perspective={perspective} plotPoint={plotPoint} />
    );
  }
};

export default MessageViewContainer;
