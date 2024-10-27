"use client";

import { useSession } from "@/hooks/use-session";
import { messagesSocket } from "@/socket";
import {
  HumanUserMessagePlotPointDto,
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
 * HumanUserMessage
 */

type HumanUserMessageProps = Perspective & {
  plotPoint: HumanUserMessagePlotPointDto;
};

export const HumanUserMessage = (props: HumanUserMessageProps) => {
  const { perspective } = props;
  return (
    <Message perspective={perspective}>
      {props.plotPoint.data.humanUserMessage.content}
    </Message>
  );
};

/**
 * MessageContainer
 */

type Props = AiUserMessagePlotPointDto | HumanUserMessagePlotPointDto;

const MessageViewContainer = (plotPoint: Props) => {
  const session = useSession();

  const perspective =
    plotPoint.data.message.userId === session.user.id
      ? "FIRST_PERSON"
      : "THIRD_PERSON";

  if (plotPoint.type === "AI_USER_MESSAGE") {
    return <AiUserMessage perspective={perspective} plotPoint={plotPoint} />;
  }

  if (plotPoint.type === "HUMAN_USER_MESSAGE") {
    return (
      <HumanUserMessage perspective={perspective} plotPoint={plotPoint} />
    );
  }
};

export default MessageViewContainer;
