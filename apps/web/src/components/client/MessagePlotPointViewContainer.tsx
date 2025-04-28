"use client";

import { messagesSocket } from "@/socket";
import {
  AiMessagePlotPointDto,
  HumanMessagePlotPointDto,
} from "@2pm/api/client";
import {
  AiMessageDto,
  AiMessageDtoSchema,
  HumanMessageDto,
  HumanMessageDtoSchema,
  ProseDtoSchema,
} from "@2pm/core";
// import { MessagesRoomJoinedEventDto } from "@2pm/core";
import { AiMessage, HumanMessage } from "@2pm/ui/plot-points";
import { useState } from "react";

/**
 * AiMessageViewContainer
 */

export const AiMessageViewContainer = ({ aiMessage, aiUser }: AiMessageDto) => {
  const [content, setContent] = useState(aiMessage.content);

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

  return <AiMessage tag={aiUser.tag}>{content}</AiMessage>;
};

/**
 * HumanMessageViewContainer
 */

export const HumanMessageViewContainer = ({
  humanMessage: { content },
  humanUser: { tag },
}: HumanMessageDto) => {
  return <HumanMessage tag={tag || "anon"} content={content} />;
};

/**
 * MessagePlotPointViewContainer
 */

type Props = AiMessagePlotPointDto | HumanMessagePlotPointDto;

const MessagePlotPointViewContainer = (plotPoint: Props) => {
  if (plotPoint.type === "AI_MESSAGE") {
    const props = AiMessageDtoSchema.parse(plotPoint.data);
    return <AiMessageViewContainer {...props} />;
  }

  if (plotPoint.type === "HUMAN_MESSAGE") {
    const props = HumanMessageDtoSchema.parse(plotPoint.data);
    return <HumanMessageViewContainer {...props} />;
  }
};

export default MessagePlotPointViewContainer;
