import { PlotPoint, PlotPointPerspective } from "@2pm/schemas";
import {
  getAiMessageByPlotPointId,
  getHumanMessageByPlotPointId,
} from "@/api/plot-points";
import { Message } from "@2pm/ui/plot-points";

interface Props extends PlotPoint {}

interface MessageProps {
  id: PlotPoint["id"];
  perspective: PlotPointPerspective;
}

/**
 * AiMessage
 */

export const AiMessage = async ({ id, perspective }: MessageProps) => {
  const { data } = await getAiMessageByPlotPointId(id);
  return <Message perspective={perspective}>{data.message.content}</Message>;
};

/**
 * HumanMessage
 */

export const HumanMessage = async ({ id, perspective }: MessageProps) => {
  const { data } = await getHumanMessageByPlotPointId(id);
  return <Message perspective={perspective}>{data.message.content}</Message>;
};

/**
 * MessageContainer
 */

export const MessageContainer = async ({ id, userId, type }: Props) => {
  const perspective = userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";
  const Component = type === "AI_MESSAGE" ? AiMessage : HumanMessage;
  const props: MessageProps = { id, perspective };
  return <Component {...props} />;
};
