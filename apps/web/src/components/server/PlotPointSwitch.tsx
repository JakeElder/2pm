import { PlotPoint } from "@2pm/schemas";
import { MessageContainer } from "./PlotPointContainers/MessageContainer";

interface Props extends PlotPoint {}

const PlotPointSwitch = (plotPoint: Props) => {
  const { type } = plotPoint;
  if (type === "HUMAN_MESSAGE" || type === "AI_MESSAGE") {
    return <MessageContainer {...plotPoint} />;
  }
};

export default PlotPointSwitch;
