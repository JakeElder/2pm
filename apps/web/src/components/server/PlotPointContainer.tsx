import { PlotPointDto } from "@2pm/schemas/dto";
import { MessageContainer } from "./PlotPointContainers/MessageContainer";

interface Props extends PlotPointDto {}

const PlotPointContainer = (plotPoint: Props) => {
  const { type } = plotPoint;
  if (type === "HUMAN_MESSAGE" || type === "AI_MESSAGE") {
    return <MessageContainer {...plotPoint} />;
  }
};

export default PlotPointContainer;
