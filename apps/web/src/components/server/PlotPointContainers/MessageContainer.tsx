import { PlotPoint, PlotPointPerspective } from "@2pm/schemas";
import api from "@/api";
import { Message } from "@2pm/ui/plot-points";

const getPerspective = async ({
  userId,
}: PlotPoint): Promise<PlotPointPerspective> => {
  return userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";
};

/*
 * AiMessage
 */

interface AiMessageProps extends PlotPoint {}

export const AiMessage = async (plotPoint: AiMessageProps) => {
  const perspective = await getPerspective(plotPoint);
  const res = await api.plotPoints.getAiMessageByPlotPointId(plotPoint.id);
  return (
    <Message perspective={perspective}>{res.data.message.content}</Message>
  );
};

/*
 * HumanMessage
 */

interface HumanMessageProps extends PlotPoint {}

export const HumanMessage = async (plotPoint: HumanMessageProps) => {
  const perspective = await getPerspective(plotPoint);
  const res = await api.plotPoints.getHumanMessageByPlotPointId(plotPoint.id);
  return (
    <Message perspective={perspective}>{res.data.message.content}</Message>
  );
};

/**
 * MessageContainer
 */

interface Props extends PlotPoint {}

export const MessageContainer = async (plotPoint: Props) => {
  return plotPoint.type === "AI_MESSAGE" ? (
    <AiMessage {...plotPoint} />
  ) : (
    <HumanMessage {...plotPoint} />
  );
};
