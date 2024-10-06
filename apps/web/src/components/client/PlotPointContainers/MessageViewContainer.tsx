"use client";

import { PlotPointPerspective } from "@2pm/data";
import {
  AiMessageHydratedPlotPoint,
  HumanMessageHydratedPlotPoint,
} from "@2pm/data/comps";
import { Message } from "@2pm/ui/plot-points";

type Perspective = {
  perspective: PlotPointPerspective;
};

/**
 * AiMessage
 */

type AiMessageProps = Perspective & {
  plotPoint: AiMessageHydratedPlotPoint;
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
  plotPoint: HumanMessageHydratedPlotPoint;
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

type Props = AiMessageHydratedPlotPoint | HumanMessageHydratedPlotPoint;

const MessageViewContainer = (plotPoint: Props) => {
  const { userId } = plotPoint;
  const perspective = userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";

  if (plotPoint.type === "AI_MESSAGE") {
    return <AiMessage perspective={perspective} plotPoint={plotPoint} />;
  } else {
    return <HumanMessage perspective={perspective} plotPoint={plotPoint} />;
  }
};

export default MessageViewContainer;
