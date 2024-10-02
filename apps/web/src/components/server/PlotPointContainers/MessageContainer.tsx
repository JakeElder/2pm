import { PlotPoint } from "@2pm/schemas";
import api from "@/api";
import { Message } from "@2pm/ui/plot-points";
import { Narrative } from "@2pm/ui";

/*
 * Container
 */

interface ContainerProps {
  plotPoint: PlotPoint;
  children: React.ReactNode;
}

const getPerspective = async ({ userId }: PlotPoint) =>
  userId === 3 ? "FIRST_PERSON" : "THIRD_PERSON";

const getContent = async ({ type, id }: PlotPoint) => {
  if (type === "AI_MESSAGE") {
    return api.plotPoints.getAiMessageByPlotPointId(id);
  } else {
    return api.plotPoints.getHumanMessageByPlotPointId(id);
  }
};

const Container = async ({ plotPoint, children }: ContainerProps) => {
  const perspective = await getPerspective(plotPoint);
  return perspective === "FIRST_PERSON" ? (
    <Narrative.FirstPersonMessage children={children} />
  ) : (
    <Narrative.ThirdPersonMessage children={children} />
  );
};

/*
 * AiMessage
 */

interface AiMessageProps extends PlotPoint {}

export const AiMessage = async (plotPoint: AiMessageProps) => {
  const perspective = await getPerspective(plotPoint);
  const res = await api.plotPoints.getAiMessageByPlotPointId(plotPoint.id);
  return (
    <Container plotPoint={plotPoint}>
      <Message perspective={perspective}>{res.data.message.content}</Message>
    </Container>
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
    <Container plotPoint={plotPoint}>
      <Message perspective={perspective}>{res.data.message.content}</Message>
    </Container>
  );
};

/*
 * MessageContainer
 */

interface Props extends PlotPoint {}

export const MessageContainer = async (plotPoint: Props) => {
  if (plotPoint.type === "AI_MESSAGE") {
    return <AiMessage {...plotPoint} />;
  }

  if (plotPoint.type === "HUMAN_MESSAGE") {
    return <HumanMessage {...plotPoint} />;
  }

  return null;
};
