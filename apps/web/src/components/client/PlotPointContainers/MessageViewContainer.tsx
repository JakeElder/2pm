"use client";

import { PlotPointPerspective } from "@2pm/data";
import {
  AiMessageHydratedPlotPointDto,
  HumanMessageHydratedPlotPointDto,
} from "@2pm/data";
import { Message } from "@2pm/ui/plot-points";

type Perspective = {
  perspective: PlotPointPerspective;
};

/**
 * AiMessage
 */

type AiMessageProps = Perspective & {
  plotPoint: AiMessageHydratedPlotPointDto;
};

export const AiMessage = (props: AiMessageProps) => {
  const { perspective } = props;
  return (
    <Message perspective={perspective}>
      {props.plotPoint.data.message.content}
    </Message>
  );
};

/**
 * HumanMessage
 */

type HumanMessageProps = Perspective & {
  plotPoint: HumanMessageHydratedPlotPointDto;
};

export const HumanMessage = (props: HumanMessageProps) => {
  const { perspective } = props;
  return (
    <Message perspective={perspective}>
      {props.plotPoint.data.message.content}
    </Message>
  );
};

/**
 * MessageContainer
 */

type Props = AiMessageHydratedPlotPointDto | HumanMessageHydratedPlotPointDto;

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
