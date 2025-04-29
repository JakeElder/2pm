"use client";

import {
  AiMessagePlotPointDto,
  HumanMessagePlotPointDto,
} from "@2pm/api/client";
import {
  AiMessageDto,
  AiMessageDtoSchema,
  HumanMessageDto,
  HumanMessageDtoSchema,
} from "@2pm/core";
import { AiMessage, HumanMessage } from "@2pm/ui/plot-points";

/**
 * AiMessageViewContainer
 */

export const AiMessageViewContainer = ({ aiMessage, aiUser }: AiMessageDto) => {
  return <AiMessage tag={aiUser.tag}>{aiMessage.content}</AiMessage>;
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
